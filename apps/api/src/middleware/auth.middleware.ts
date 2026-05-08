import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { PersonaRole } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: PersonaRole
  systemRole: string
  aiProvider: string
  aiModel?: string | null
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    res.status(401).json({ error: 'Authentication required', code: 'UNAUTHORIZED' })
    return
  }

  try {
    const payload = jwt.verify(token, process.env.NEXTAUTH_SECRET ?? 'secret') as AuthUser
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token', code: 'INVALID_TOKEN' })
  }
}
