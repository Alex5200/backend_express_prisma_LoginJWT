import request from 'supertest'
import app from '../src/app'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'test'

describe('User', () => {
  let adminToken: any
  let userId: number

  beforeAll(async () => {
    const hash = await bcrypt.hash('123', 10)
    const admin = await prisma.user.create({
      data: { email: 'admin@test.com', name: 'A', surname: 'D', seconame: 'M', password: hash, dateBirthday: '1990-01-01', role: 'admin', status: true }
    })
    const user = await prisma.user.create({
      data: { email: 'user@test.com', name: 'U', surname: 'S', seconame: 'E', password: hash, dateBirthday: '1990-01-01', role: 'user', status: true }
    })
    adminToken = jwt.sign({ id: admin.id, role: 'admin' }, JWT_SECRET)
    userId = user.id
  })

  it('admin can get user list', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('user can get self', async () => {
    const userToken = jwt.sign({ id: userId, role: 'user' }, JWT_SECRET)
    const res = await request(app)
      .get(`/user/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.statusCode).toBe(200)
  })
})