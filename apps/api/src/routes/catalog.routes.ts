import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middleware/auth.middleware'
import { requireModule } from '../middleware/rbac.middleware'
import { searchSolutions } from '../services/search.service'
import { PersonaRole } from '@prisma/client'

const router = Router()
router.use(authMiddleware)
router.use(requireModule('catalog'))

router.get('/', async (req, res) => {
  const { search, category, persona } = req.query
  const userRole = req.user!.role as PersonaRole

  if (search && typeof search === 'string') {
    const results = await searchSolutions(search)
    res.json(results)
    return
  }

  const solutions = await prisma.solution.findMany({
    where: {
      isActive: true,
      ...(category ? { category: String(category) } : {}),
      personas: { has: persona ? (persona as PersonaRole) : userRole },
    },
    orderBy: { createdAt: 'desc' },
  })
  res.json(solutions)
})

router.get('/:id', async (req, res) => {
  const solution = await prisma.solution.findUnique({ where: { id: req.params.id } })
  if (!solution) {
    res.status(404).json({ error: 'Solution not found', code: 'NOT_FOUND' })
    return
  }
  res.json(solution)
})

export default router
