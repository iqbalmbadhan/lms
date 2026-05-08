import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()
router.use(authMiddleware)

// Get my orders
router.get('/', async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
    include: { course: { select: { id: true, title: true, thumbnail: true } } },
    orderBy: { createdAt: 'desc' },
  })
  res.json(orders)
})

// Check if user owns a course
router.get('/check/:courseId', async (req, res) => {
  const order = await prisma.order.findFirst({
    where: { userId: req.user!.id, courseId: req.params.courseId, status: 'COMPLETED' },
  })
  res.json({ owned: !!order })
})

// Create order (manual/bank payment — marks as pending)
router.post('/', async (req, res) => {
  const { courseId, paymentMethod } = req.body
  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) {
    res.status(404).json({ error: 'Course not found', code: 'NOT_FOUND' })
    return
  }

  // Check already purchased
  const existing = await prisma.order.findFirst({
    where: { userId: req.user!.id, courseId, status: 'COMPLETED' },
  })
  if (existing) {
    res.status(409).json({ error: 'Already purchased', code: 'ALREADY_PURCHASED' })
    return
  }

  if (course.isFree) {
    // Auto-complete for free courses
    const order = await prisma.order.create({
      data: { userId: req.user!.id, courseId, amount: 0, paymentMethod: 'free', status: 'COMPLETED' },
    })
    // Auto-enroll
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: req.user!.id, courseId } },
      create: { userId: req.user!.id, courseId },
      update: {},
    })
    res.status(201).json(order)
    return
  }

  const order = await prisma.order.create({
    data: {
      userId: req.user!.id,
      courseId,
      amount: course.price,
      paymentMethod: paymentMethod ?? 'manual',
      status: 'PENDING',
    },
  })
  res.status(201).json(order)
})

// Confirm manual payment (admin confirms, or webhook confirms)
router.post('/:orderId/confirm', async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.orderId },
    include: { course: true },
  })
  if (!order) {
    res.status(404).json({ error: 'Order not found', code: 'NOT_FOUND' })
    return
  }
  if (order.status === 'COMPLETED') {
    res.status(409).json({ error: 'Already completed', code: 'ALREADY_COMPLETED' })
    return
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({ where: { id: order.id }, data: { status: 'COMPLETED' } })

    // Enroll user
    await tx.enrollment.upsert({
      where: { userId_courseId: { userId: order.userId, courseId: order.courseId } },
      create: { userId: order.userId, courseId: order.courseId },
      update: {},
    })

    // Record earnings if course has an author
    if (order.course.authorId && order.amount > 0) {
      const authorPct = order.course.revenueSharePct / 100
      const authorAmount = order.amount * authorPct
      const platformAmount = order.amount - authorAmount

      await tx.authorEarning.create({
        data: {
          authorId: order.course.authorId,
          orderId: order.id,
          courseId: order.courseId,
          grossAmount: order.amount,
          authorAmount,
          platformAmount,
        },
      })

      await tx.authorProfile.update({
        where: { userId: order.course.authorId },
        data: { totalEarnings: { increment: authorAmount } },
      })
    }
  })

  res.json({ confirmed: true })
})

export default router
