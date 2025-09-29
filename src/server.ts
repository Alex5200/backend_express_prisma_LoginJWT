import 'dotenv/config'
import app from './app'

const PORT = 3000
app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`)
  console.log(`📚 Swagger: http://localhost:${PORT}/api-docs`)
})