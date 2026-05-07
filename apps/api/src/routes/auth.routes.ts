import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const router = Router()

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
  role: z.enum([
    'EXECUTIVE', 'PRODUCT_OWNER', 'BUSINESS_ANALYST', 'CUSTOMER_SERVICE',
    'HR', 'FINANCE', 'LEGAL_SOURCING', 'DEVELOPER', 'GOVERNANCE',
  ]).optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body)
    const exists = await prisma.user.findUnique({ where: { email: data.email } })
    if (exists) {
      res.status(409).json({ error: 'Email already registered', code: 'EMAIL_EXISTS' })
      return
    }
    const passwordHash = await bcrypt.hash(data.password, 12)
    const user = await prisma.user.create({
      data: { email: data.email, name: data.name, passwordHash, role: data.role ?? 'DEVELOPER' },
      select: { id: true, email: true, name: true, role: true, systemRole: true },
    })
    const token = jwt.sign(user, process.env.NEXTAUTH_SECRET ?? 'secret', { expiresIn: '7d' })
    res.json({ user, token })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message, code: 'VALIDATION_ERROR' })
      return
    }
    throw err
  }
})

router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (!user || !user.passwordHash) {
      res.status(401).json({ error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' })
      return
    }
    const valid = await bcrypt.compare(data.password, user.passwordHash)
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' })
      return
    }
    const payload = { id: user.id, email: user.email, name: user.name, role: user.role, systemRole: user.systemRole, aiProvider: user.aiProvider, aiModel: user.aiModel }
    const token = jwt.sign(payload, process.env.NEXTAUTH_SECRET ?? 'secret', { expiresIn: '7d' })
    res.json({ user: payload, token })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message, code: 'VALIDATION_ERROR' })
      return
    }
    throw err
  }
})

router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    res.status(401).json({ error: 'Authentication required', code: 'UNAUTHORIZED' })
    return
  }
  try {
    const payload = jwt.verify(token, process.env.NEXTAUTH_SECRET ?? 'secret')
    res.json(payload)
  } catch {
    res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' })
  }
})

export default router
