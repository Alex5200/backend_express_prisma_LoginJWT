import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

router.post('/', async (req, res) => {
  const { title, content, authorEmail } = req.body
  try {
    const post = await prisma.post.create({
       data: { title, content, author: { connect: { email: authorEmail } } }
    })
    res.json(post)
  } catch (e) {
    res.status(400).json({ error: 'Invalid author email' })
  }
})

router.get('/:id', async (req, res) => {
  const post = await prisma.post.findUnique({ where: { id: Number(req.params.id) } })
  post ? res.json(post) : res.status(404).json({ error: 'Not found' })
})

export default router