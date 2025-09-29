import 'dotenv/config'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import postRoutes from './routes/post.routes'

const app = express()
app.use(express.json())

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Routes
app.use(authRoutes)
app.use('/user', userRoutes)
app.use('/users', userRoutes)
app.use('/post', postRoutes)

export default app