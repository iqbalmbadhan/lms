import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middleware/auth.middleware'
import { requireModule } from '../middleware/rbac.middleware'

const router = Router()
router.use(authMiddleware)
router.use(requireModule('analytics'))

router.get('/dashboard', async (req, res) => {
  const [
    totalUsers,
    totalCourses,
    totalSolutions,
    totalEnrollments,
    completedEnrollments,
    pendingIdeas,
    pendingReviews,
  ] = await Promise.all([
    prisma.user.count({ where: { isActive: true } }),
    prisma.course.count({ where: { status: 'PUBLISHED' } }),
    prisma.solution.count({ where: { isActive: true } }),
    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { completedAt: { not: null } } }),
    prisma.idea.count({ where: { status: 'SUBMITTED' } }),
    prisma.governanceReview.count({ where: { status: 'PENDING' } }),
  ])

  const adoptionRate = totalEnrollments > 0
    ? Math.round((completedEnrollments / totalEnrollments) * 100)
    : 0

  res.json({
    totalUsers,
    totalCourses,
    totalSolutions,
    totalEnrollments,
    completedEnrollments,
    adoptionRate,
    pendingIdeas,
    pendingReviews,
  })
})

router.get('/roi', async (req, res) => {
  const metrics = await prisma.rOIMetric.findMany({
    orderBy: { recordedAt: 'desc' },
    take: 50,
  })
  res.json(metrics)
})

export default router
