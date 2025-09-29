import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

beforeAll(async () => {
  await prisma.post.deleteMany({})
  await prisma.user.deleteMany({})
})

afterAll(async () => {
  await prisma.$disconnect()
})