import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middleware/auth.middleware'
import { requireModule } from '../middleware/rbac.middleware'
import { searchPrompts } from '../services/search.service'
import { PersonaRole } from '@prisma/client'

const router = Router()
router.use(authMiddleware)
router.use(requireModule('prompts'))

router.get('/', async (req, res) => {
  const { search, category, tag } = req.query
  const userRole = req.user!.role as PersonaRole

  if (search && typeof search === 'string') {
    const results = await searchPrompts(search)
    res.json(results)
    return
  }

  const prompts = await prisma.prompt.findMany({
    where: {
      isPublished: true,
      personas: { has: userRole },
      ...(category ? { category: String(category) } : {}),
      ...(tag ? { tags: { has: String(tag) } } : {}),
    },
    include: {
      savedBy: { where: { userId: req.user!.id }, select: { savedAt: true } },
    },
    orderBy: { useCount: 'desc' },
  })
  res.json(prompts)
})

router.get('/:id', async (req, res) => {
  const prompt = await prisma.prompt.findUnique({
    where: { id: req.params.id },
    include: { savedBy: { where: { userId: req.user!.id } } },
  })
  if (!prompt) {
    res.status(404).json({ error: 'Prompt not found', code: 'NOT_FOUND' })
    return
  }
  res.json(prompt)
})

router.post('/:id/use', async (req, res) => {
  const prompt = await prisma.prompt.update({
    where: { id: req.params.id },
    data: { useCount: { increment: 1 } },
    select: { id: true, useCount: true },
  })
  res.json(prompt)
})

router.post('/:id/save', async (req, res) => {
  await prisma.savedPrompt.upsert({
    where: { userId_promptId: { userId: req.user!.id, promptId: req.params.id } },
    create: { userId: req.user!.id, promptId: req.params.id },
    update: {},
  })
  res.json({ saved: true })
})

router.delete('/:id/save', async (req, res) => {
  await prisma.savedPrompt.deleteMany({
    where: { userId: req.user!.id, promptId: req.params.id },
  })
  res.json({ saved: false })
})

export default router
