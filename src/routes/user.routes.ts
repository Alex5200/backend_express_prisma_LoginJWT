import { Router, Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import authenticateToken from '../middleware/authenticateToken'
const prisma = new PrismaClient()
const router = Router()
const JWT_SECRET = process.env.JWT_SECRET!

interface AuthRequest extends Request {
  user?: { id: number; role: string }
}

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     security: [{ bearerAuth: [] }]
 *     summary: Получить пользователя по ID
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: 'OK' }
 *       403: { description: 'Access denied' }
 */
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  const id = Number(req.params.id)
  const target = await prisma.user.findUnique({ where: { id } })
  if (!target) return res.status(404).json({ error: 'Not found' })
  if (req.user!.role !== 'admin' && req.user!.id !== id) {
    return res.status(403).json({ error: 'Access denied' })
  }
  res.json(target)
})

/**
 * @swagger
 * /users:
 *   get:
 *     security: [{ bearerAuth: [] }]
 *     summary: Список пользователей (только админ)
 *     responses:
 *       200: { description: 'OK' }
 *       403: { description: 'Admin only' }
 */
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  if (req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' })
  }
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, surname: true, role: true, status: true }
  })
  res.json(users)
})

/**
 * @swagger
 * /user/{id}/block:
 *   patch:
 *     security: [{ bearerAuth: [] }]
 *     summary: Заблокировать пользователя
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses:
 *       200: { description: 'Blocked' }
 *       403: { description: 'Access denied' }
 */
router.patch('/:id/block', authenticateToken, async (req: AuthRequest, res) => {
  const id = Number(req.params.id)
  const target = await prisma.user.findUnique({ where: { id } })
  if (!target) return res.status(404).json({ error: 'Not found' })
  if (req.user!.role !== 'admin' && req.user!.id !== id) {
    return res.status(403).json({ error: 'Access denied' })
  }
  const updated = await prisma.user.update({ where: { id }, data: { status: false } })
  res.json({ message: 'User blocked', user: updated })
})

export default router