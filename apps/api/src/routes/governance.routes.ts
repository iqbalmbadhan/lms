import { Router } from 'express'
import { z } from 'zod'
import { GovernanceStatus } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middleware/auth.middleware'
import { requireModule, requireRole } from '../middleware/rbac.middleware'

const router = Router()
router.use(authMiddleware)
router.use(requireModule('governance'))

router.get('/reviews', async (req, res) => {
  const { status } = req.query
  const reviews = await prisma.governanceReview.findMany({
    where: status ? { status: status as GovernanceStatus } : {},
    include: {
      idea: { select: { id: true, title: true, description: true, status: true } },
      reviewer: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  res.json(reviews)
})

router.post('/reviews', requireRole('GOVERNANCE'), async (req, res) => {
  const schema = z.object({
    ideaId: z.string(),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_REVISION']),
    riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    notes: z.string().optional(),
  })
  try {
    const data = schema.parse(req.body)
    const review = await prisma.governanceReview.create({
      data: {
        ...data,
        reviewerId: req.user!.id,
        reviewedAt: data.status !== 'PENDING' ? new Date() : null,
      },
    })

    if (data.status === 'APPROVED') {
      await prisma.idea.update({ where: { id: data.ideaId }, data: { status: 'APPROVED' } })
    } else if (data.status === 'REJECTED') {
      await prisma.idea.update({ where: { id: data.ideaId }, data: { status: 'REJECTED' } })
    }

    res.status(201).json(review)
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message, code: 'VALIDATION_ERROR' })
      return
    }
    throw err
  }
})

router.get('/policies', async (req, res) => {
  const policies = await prisma.governancePolicy.findMany({
    where: { isActive: true },
    orderBy: { publishedAt: 'desc' },
  })
  res.json(policies)
})

export default router
