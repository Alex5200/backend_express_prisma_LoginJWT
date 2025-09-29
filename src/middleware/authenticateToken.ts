import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

interface AuthRequest extends Request {
    user?: { id: number; email: string; role: string }
}
const JWT_SECRET = process.env.JWT_SECRET!
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] 
  console.log('Received token:', token) 

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Error verifying token:', err)
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    (req as AuthRequest).user = user as { id: number; email: string; role: string }
    next()
  })
}
export default authenticateToken