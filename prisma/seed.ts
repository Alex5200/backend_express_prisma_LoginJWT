import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding...')

  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Админ',
      surname: 'Системный',
      seconame: 'Главный',
      role: 'admin',
      status: true,
      dateBirthday: '1980-01-01',
      password: hashedPassword,
    },
  })
  console.log(`✅ Created admin: ${admin.email}`)

  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Алиса',
      surname: 'Иванова',
      seconame: 'Сергеевна',
      role: 'user',
      status: true,
      dateBirthday: '1992-05-14',
      password: hashedPassword,
    },
  })

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Боб',
      surname: 'Петров',
      seconame: 'Александрович',
      role: 'user',
      status: true,
      dateBirthday: '1988-11-23',
      password: hashedPassword,
    },
  })

  const eve = await prisma.user.create({
    data: {
      email: 'eve@example.com',
      name: 'Ева',
      surname: 'Сидорова',
      seconame: 'Владимировна',
      role: 'user',
      status: false, // заблокирована
      dateBirthday: '1995-03-30',
      password: hashedPassword,
    },
  })

  console.log(`✅ Created 3 users`)

  await prisma.post.create({
    data: {
      title: 'Добро пожаловать в систему!',
      content: 'Это официальный пост от администратора.',
      published: true,
      authorId: admin.id,
    },
  })

  await prisma.post.create({
    data: {
      title: 'Привет от Алисы',
      content: 'Привет! Я Алиса Иванова. Это мой первый пост.',
      published: true,
      authorId: alice.id,
    },
  })

  await prisma.post.create({
    data: {
      title: 'Черновик Алисы',
      content: 'Это черновик — не публиковать!',
      published: false,
      authorId: alice.id,
    },
  })

  await prisma.post.create({
    data: {
      title: 'Привет от Боба',
      content: 'Привет! Я Боб Петров.',
      published: true,
      authorId: bob.id,
    },
  })

  console.log('✅ Seeding finished!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })