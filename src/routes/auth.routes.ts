import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const router = Router()
const JWT_SECRET = process.env.JWT_SECRET!

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Регистрация
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               surname: { type: string }
 *               seconame: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string }
 *               dateBirthday: { type: string, example: "1990-01-01" }
 *             required: [name, surname, seconame, email, password, dateBirthday]
 *     responses:
 *       201: { description: 'Пользователь создан' }
 */
router.post('/signup', async (req, res) => {
  const { name, surname, seconame, email, password, dateBirthday } = req.body
  const hashed = await bcrypt.hash(password, 10)
  try {
    const user = await prisma.user.create({
      data: { // ← ОБЯЗАТЕЛЬНО: data: { ... }
        name,
        surname,
        seconame,
        email,
        password: hashed,
        dateBirthday,
        role: 'user',
        status: true,
      },
      select: { id: true, email: true, name: true, role: true },
    })
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    )
    res.status(201).json({ user, token })
  } catch (e: any) {
    if (e.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' })
    }
    res.status(500).json({ error: 'Failed to create user' })
  }
})

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Вход
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *             required: [email, password]
 *     responses:
 *       200: { description: 'Успешный вход' }
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  if (!user.status) {
    return res.status(403).json({ error: 'Account blocked' })
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  )
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } })
})

export default router