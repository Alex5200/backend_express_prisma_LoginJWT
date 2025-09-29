import request from 'supertest'
import app from '../src/app'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

describe('Auth', () => {
  it('should register', async () => {
    const res = await request(app).post('/signup').send({
      name: 'Test', surname: 'User', seconame: 'Middle',
      email: Date.now().toString()+'@example.com', password: 'password123', dateBirthday: '1990-01-01'
    })
    expect(res.statusCode).toBe(201)
    expect(res.body.token).toBeDefined()
  })

  it('should login', async () => {
    const hash = await bcrypt.hash('123', 10)
    await prisma.user.create({
       data: { email: 'test@example.com', name: 'L', surname: 'U', seconame: 'M', password: hash, dateBirthday: '1990-01-01', role: 'user', status: true }
    })
    const res = await request(app).post('/login').send({ email: 'login@test.com', password: '123' })
    expect(res.statusCode).toBe(200)
    expect(res.body.token).toBeDefined()
  })
})