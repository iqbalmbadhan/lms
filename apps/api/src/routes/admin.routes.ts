import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middleware/auth.middleware'
import { SystemRole } from '@prisma/client'

const router = Router()
router.use(authMiddleware)
router.use((req, res, next) => {
  if (req.user?.systemRole !== 'SUPER_ADMIN') {
    res.status(403).json({ error: 'Super admin access required', code: 'FORBIDDEN' })
    return
  }
  next()
})

// Dashboard stats
router.get('/stats', async (req, res) => {
  const [totalUsers, totalAuthors, pendingAuthors, totalCourses, pendingCourses, totalOrders, totalRevenue] = await Promise.all([
    prisma.user.count({ where: { systemRole: 'LEARNER' } }),
    prisma.user.count({ where: { systemRole: 'AUTHOR' } }),
    prisma.authorProfile.count({ where: { isApproved: false } }),
    prisma.course.count(),
    prisma.course.count({ where: { isApproved: false, isFree: false } }),
    prisma.order.count({ where: { status: 'COMPLETED' } }),
    prisma.order.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
  ])
  res.json({
    totalUsers,
    totalAuthors,
    pendingAuthors,
    totalCourses,
    pendingCourses,
    totalOrders,
    totalRevenue: totalRevenue._sum.amount ?? 0,
  })
})

// Users management
router.get('/users', async (req, res) => {
  const { systemRole, search } = req.query
  const users = await prisma.user.findMany({
    where: {
      ...(systemRole ? { systemRole: systemRole as SystemRole } : {}),
      ...(search ? { OR: [{ name: { contains: String(search), mode: 'insensitive' } }, { email: { contains: String(search), mode: 'insensitive' } }] } : {}),
    },
    include: { authorProfile: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  res.json(users)
})

router.patch('/users/:id', async (req, res) => {
  const { isActive, systemRole } = req.body
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { ...(isActive !== undefined ? { isActive } : {}), ...(systemRole ? { systemRole } : {}) },
  })
  res.json(user)
})

// Author approval
router.get('/author-applications', async (req, res) => {
  const applications = await prisma.authorProfile.findMany({
    where: { isApproved: false },
    include: { user: { select: { id: true, name: true, email: true, createdAt: true } } },
    orderBy: { appliedAt: 'desc' },
  })
  res.json(applications)
})

router.post('/author-applications/:userId/approve', async (req, res) => {
  await prisma.$transaction([
    prisma.authorProfile.update({
      where: { userId: req.params.userId },
      data: { isApproved: true, approvedAt: new Date(), approvedById: req.user!.id },
    }),
    prisma.user.update({
      where: { id: req.params.userId },
      data: { systemRole: 'AUTHOR' },
    }),
  ])
  res.json({ approved: true })
})

router.post('/author-applications/:userId/reject', async (req, res) => {
  await prisma.authorProfile.delete({ where: { userId: req.params.userId } })
  res.json({ rejected: true })
})

// Course approval
router.get('/courses/pending', async (req, res) => {
  const courses = await prisma.course.findMany({
    where: { isApproved: false },
    include: { author: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  })
  res.json(courses)
})

router.post('/courses/:courseId/approve', async (req, res) => {
  const course = await prisma.course.update({
    where: { id: req.params.courseId },
    data: { isApproved: true, status: 'PUBLISHED' },
  })
  res.json(course)
})

router.post('/courses/:courseId/reject', async (req, res) => {
  const course = await prisma.course.update({
    where: { id: req.params.courseId },
    data: { status: 'ARCHIVED' },
  })
  res.json(course)
})

// Revenue split — set per course
router.patch('/courses/:courseId/revenue', async (req, res) => {
  const { revenueSharePct, price, isFree } = req.body
  const course = await prisma.course.update({
    where: { id: req.params.courseId },
    data: {
      ...(revenueSharePct !== undefined ? { revenueSharePct } : {}),
      ...(price !== undefined ? { price } : {}),
      ...(isFree !== undefined ? { isFree } : {}),
    },
    select: { id: true, title: true, price: true, isFree: true, revenueSharePct: true },
  })
  res.json(course)
})

// Revenue overview
router.get('/revenue', async (req, res) => {
  const [orders, platformTotal, authorTotal] = await Promise.all([
    prisma.order.findMany({
      where: { status: 'COMPLETED' },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true, author: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.authorEarning.aggregate({ _sum: { platformAmount: true } }),
    prisma.authorEarning.aggregate({ _sum: { authorAmount: true } }),
  ])
  res.json({
    orders,
    platformRevenue: platformTotal._sum.platformAmount ?? 0,
    authorRevenue: authorTotal._sum.authorAmount ?? 0,
  })
})

// Payout management
router.get('/payouts', async (req, res) => {
  const { status } = req.query
  const payouts = await prisma.payoutRequest.findMany({
    where: status ? { status: status as string } as Record<string, unknown> : {},
    include: { author: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  })
  res.json(payouts)
})

router.patch('/payouts/:id', async (req, res) => {
  const { status, adminNotes } = req.body
  const payout = await prisma.payoutRequest.update({
    where: { id: req.params.id },
    data: {
      status,
      adminNotes,
      processedAt: status === 'COMPLETED' || status === 'REJECTED' ? new Date() : null,
    },
  })

  if (status === 'COMPLETED') {
    const payoutRecord = await prisma.payoutRequest.findUnique({ where: { id: req.params.id } })
    if (payoutRecord) {
      await prisma.authorEarning.updateMany({
        where: { authorId: payoutRecord.authorId, isPaidOut: false },
        data: { isPaidOut: true },
      })
      await prisma.authorProfile.update({
        where: { userId: payoutRecord.authorId },
        data: { totalEarnings: { increment: 0 } },
      })
    }
  }

  res.json(payout)
})

export default router
