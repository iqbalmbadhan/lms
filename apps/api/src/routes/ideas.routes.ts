import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middleware/auth.middleware'
import { requireModule } from '../middleware/rbac.middleware'

const router = Router()
router.use(authMiddleware)
router.use(requireModule('ideas'))

const createIdeaSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  businessCase: z.string().min(20),
  estimatedValue: z.string().optional(),
  personas: z.array(z.enum([
    'EXECUTIVE', 'PRODUCT_OWNER', 'BUSINESS_ANALYST', 'CUSTOMER_SERVICE',
    'HR', 'FINANCE', 'LEGAL_SOURCING', 'DEVELOPER', 'GOVERNANCE',
  ])).optional(),
})

router.get('/', async (req, res) => {
  const { status } = req.query
  const ideas = await prisma.idea.findMany({
    where: {
      ...(status ? { status: status as string } : {}),
    },
    include: {
      submittedBy: { select: { id: true, name: true, avatar: true, role: true } },
      reviews: { select: { status: true, riskLevel: true, reviewedAt: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  res.json(ideas)
})

router.get('/:id', async (req, res) => {
  const idea = await prisma.idea.findUnique({
    where: { id: req.params.id },
    include: {
      submittedBy: { select: { id: true, name: true, avatar: true, role: true } },
      reviews: {
        include: {
          reviewer: { select: { id: true, name: true, avatar: true } },
        },
      },
    },
  })
  if (!idea) {
    res.status(404).json({ error: 'Idea not found', code: 'NOT_FOUND' })
    return
  }
  res.json(idea)
})

router.post('/', async (req, res) => {
  try {
    const data = createIdeaSchema.parse(req.body)
    const idea = await prisma.idea.create({
      data: {
        ...data,
        personas: data.personas ?? [],
        submittedById: req.user!.id,
      },
    })
    res.status(201).json(idea)
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message, code: 'VALIDATION_ERROR' })
      return
    }
    throw err
  }
})

export default router
