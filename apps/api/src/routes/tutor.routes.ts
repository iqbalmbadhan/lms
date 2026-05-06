import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middleware/auth.middleware'
import { requireModule } from '../middleware/rbac.middleware'
import { streamTutorResponse, getAllProviders } from '../services/ai'
import { PersonaRole } from '@prisma/client'

const router = Router()
router.use(authMiddleware)
router.use(requireModule('tutor'))

router.get('/providers', (req, res) => {
  res.json(getAllProviders())
})

router.get('/sessions', async (req, res) => {
  const sessions = await prisma.tutorSession.findMany({
    where: { userId: req.user!.id },
    orderBy: { updatedAt: 'desc' },
    take: 20,
    select: {
      id: true,
      context: true,
      createdAt: true,
      updatedAt: true,
      messages: { take: 1, orderBy: { createdAt: 'asc' } },
    },
  })
  res.json(sessions)
})

router.post('/sessions', async (req, res) => {
  const { courseId, context } = req.body
  const session = await prisma.tutorSession.create({
    data: { userId: req.user!.id, courseId, context },
  })
  res.json(session)
})

router.post('/sessions/:sessionId/stream', async (req, res) => {
  const { sessionId } = req.params
  const { message, providerKey, model } = req.body

  const session = await prisma.tutorSession.findFirst({
    where: { id: sessionId, userId: req.user!.id },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  })
  if (!session) {
    res.status(404).json({ error: 'Session not found', code: 'NOT_FOUND' })
    return
  }

  await prisma.tutorMessage.create({
    data: { sessionId, role: 'user', content: message },
  })

  const history = session.messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))
  history.push({ role: 'user', content: message })

  const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
  const resolvedProvider = providerKey ?? user?.aiProvider ?? process.env.DEFAULT_AI_PROVIDER ?? 'ANTHROPIC'
  const resolvedModel = model ?? user?.aiModel ?? undefined

  let assistantReply = ''

  const originalWrite = res.write.bind(res)
  res.write = function (chunk: string) {
    try {
      const raw = chunk.replace(/^data: /, '').trim()
      if (raw && raw !== '[DONE]') {
        const parsed = JSON.parse(raw)
        if (parsed.text) assistantReply += parsed.text
      }
    } catch {}
    return originalWrite(chunk)
  } as typeof res.write

  await streamTutorResponse({
    providerKey: resolvedProvider,
    model: resolvedModel,
    role: req.user!.role as PersonaRole,
    messages: history,
    courseContext: session.context,
    res,
  })

  if (assistantReply) {
    await prisma.tutorMessage.create({
      data: { sessionId, role: 'assistant', content: assistantReply },
    })
    await prisma.tutorSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    })
  }
})

router.patch('/preferences', async (req, res) => {
  const { aiProvider, aiModel } = req.body
  const updated = await prisma.user.update({
    where: { id: req.user!.id },
    data: { aiProvider, aiModel },
    select: { aiProvider: true, aiModel: true },
  })
  res.json(updated)
})

export default router
