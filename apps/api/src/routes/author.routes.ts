import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()
router.use(authMiddleware)

// Apply to become author
router.post('/apply', async (req, res) => {
  const schema = z.object({
    bio: z.string().min(50),
    expertise: z.array(z.string()).min(1),
    website: z.string().url().optional(),
    paypalEmail: z.string().email().optional(),
    bankDetails: z.string().optional(),
  })
  try {
    const data = schema.parse(req.body)
    const existing = await prisma.authorProfile.findUnique({ where: { userId: req.user!.id } })
    if (existing) {
      res.status(409).json({ error: 'Application already submitted', code: 'ALREADY_APPLIED' })
      return
    }
    const profile = await prisma.authorProfile.create({
      data: { ...data, userId: req.user!.id },
    })
    res.status(201).json(profile)
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message, code: 'VALIDATION_ERROR' })
      return
    }
    throw err
  }
})

// Author-only middleware
router.use((req, res, next) => {
  if (req.user?.systemRole !== 'AUTHOR' && req.user?.systemRole !== 'SUPER_ADMIN') {
    res.status(403).json({ error: 'Author access required', code: 'FORBIDDEN' })
    return
  }
  next()
})

// My courses
router.get('/courses', async (req, res) => {
  const courses = await prisma.course.findMany({
    where: { authorId: req.user!.id },
    include: {
      lessons: { select: { id: true } },
      enrollments: { select: { id: true } },
      orders: { where: { status: 'COMPLETED' }, select: { amount: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  res.json(courses)
})

// Create course
router.post('/courses', async (req, res) => {
  const schema = z.object({
    title: z.string().min(5),
    description: z.string().min(20),
    price: z.number().min(0).default(0),
    isFree: z.boolean().default(true),
    estimatedMins: z.number().default(30),
    personas: z.array(z.string()).default([]),
  })
  try {
    const data = schema.parse(req.body)
    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        isFree: data.isFree,
        estimatedMins: data.estimatedMins,
        personas: data.personas as Parameters<typeof prisma.course.create>[0]['data']['personas'],
        authorId: req.user!.id,
        status: 'DRAFT',
        isApproved: false,
      },
    })
    res.status(201).json(course)
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message, code: 'VALIDATION_ERROR' })
      return
    }
    throw err
  }
})

// Update course
router.patch('/courses/:courseId', async (req, res) => {
  const course = await prisma.course.findFirst({
    where: { id: req.params.courseId, authorId: req.user!.id },
  })
  if (!course) {
    res.status(404).json({ error: 'Course not found', code: 'NOT_FOUND' })
    return
  }
  const { title, description, price, isFree, estimatedMins } = req.body
  const updated = await prisma.course.update({
    where: { id: req.params.courseId },
    data: { title, description, price, isFree, estimatedMins, isApproved: false, status: 'DRAFT' },
  })
  res.json(updated)
})

// Add lesson to course
router.post('/courses/:courseId/lessons', async (req, res) => {
  const schema = z.object({
    title: z.string().min(3),
    content: z.string().min(10),
    order: z.number(),
    durationMin: z.number().default(10),
    videoUrl: z.string().url().optional(),
  })
  try {
    const data = schema.parse(req.body)
    const lesson = await prisma.lesson.create({
      data: { ...data, courseId: req.params.courseId },
    })
    res.status(201).json(lesson)
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message, code: 'VALIDATION_ERROR' })
      return
    }
    throw err
  }
})

// Submit course for approval
router.post('/courses/:courseId/submit', async (req, res) => {
  const course = await prisma.course.findFirst({
    where: { id: req.params.courseId, authorId: req.user!.id },
    include: { lessons: { select: { id: true } } },
  })
  if (!course) {
    res.status(404).json({ error: 'Course not found', code: 'NOT_FOUND' })
    return
  }
  if (course.lessons.length === 0) {
    res.status(400).json({ error: 'Add at least one lesson before submitting', code: 'NO_LESSONS' })
    return
  }
  const updated = await prisma.course.update({
    where: { id: req.params.courseId },
    data: { status: 'PUBLISHED' },
  })
  res.json(updated)
})

// Earnings dashboard
router.get('/earnings', async (req, res) => {
  const [earnings, pendingPayout, profile] = await Promise.all([
    prisma.authorEarning.findMany({
      where: { authorId: req.user!.id },
      include: { order: { select: { createdAt: true, user: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.authorEarning.aggregate({
      where: { authorId: req.user!.id, isPaidOut: false },
      _sum: { authorAmount: true },
    }),
    prisma.authorProfile.findUnique({ where: { userId: req.user!.id } }),
  ])
  res.json({
    earnings,
    pendingBalance: pendingPayout._sum.authorAmount ?? 0,
    totalEarnings: profile?.totalEarnings ?? 0,
  })
})

// Request payout
router.post('/payouts', async (req, res) => {
  const schema = z.object({
    amount: z.number().min(10),
    method: z.enum(['paypal', 'bank', 'stripe']),
    accountDetails: z.string().optional(),
  })
  try {
    const data = schema.parse(req.body)
    const pending = await prisma.authorEarning.aggregate({
      where: { authorId: req.user!.id, isPaidOut: false },
      _sum: { authorAmount: true },
    })
    const available = pending._sum.authorAmount ?? 0
    if (data.amount > available) {
      res.status(400).json({ error: `Insufficient balance. Available: $${available.toFixed(2)}`, code: 'INSUFFICIENT_BALANCE' })
      return
    }
    const payout = await prisma.payoutRequest.create({
      data: { ...data, authorId: req.user!.id },
    })
    res.status(201).json(payout)
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message, code: 'VALIDATION_ERROR' })
      return
    }
    throw err
  }
})

router.get('/payouts', async (req, res) => {
  const payouts = await prisma.payoutRequest.findMany({
    where: { authorId: req.user!.id },
    orderBy: { createdAt: 'desc' },
  })
  res.json(payouts)
})

// Author profile
router.get('/profile', async (req, res) => {
  const profile = await prisma.authorProfile.findUnique({ where: { userId: req.user!.id } })
  res.json(profile)
})

router.patch('/profile', async (req, res) => {
  const { bio, expertise, website, paypalEmail, bankDetails } = req.body
  const profile = await prisma.authorProfile.update({
    where: { userId: req.user!.id },
    data: { bio, expertise, website, paypalEmail, bankDetails },
  })
  res.json(profile)
})

export default router
