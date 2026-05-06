import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authMiddleware } from '../middleware/auth.middleware'
import { requireModule } from '../middleware/rbac.middleware'
import { PersonaRole } from '@prisma/client'

const router = Router()
router.use(authMiddleware)
router.use(requireModule('courses'))

router.get('/', async (req, res) => {
  const userRole = req.user!.role as PersonaRole
  const courses = await prisma.course.findMany({
    where: {
      status: 'PUBLISHED',
      personas: { has: userRole },
    },
    include: {
      lessons: { select: { id: true }, orderBy: { order: 'asc' } },
      enrollments: { where: { userId: req.user!.id }, select: { progressPct: true, completedAt: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  res.json(courses)
})

router.get('/:courseId', async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.courseId },
    include: {
      lessons: { orderBy: { order: 'asc' } },
      enrollments: { where: { userId: req.user!.id } },
    },
  })
  if (!course) {
    res.status(404).json({ error: 'Course not found', code: 'NOT_FOUND' })
    return
  }
  res.json(course)
})

router.post('/:courseId/enroll', async (req, res) => {
  const enrollment = await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: req.user!.id, courseId: req.params.courseId } },
    create: { userId: req.user!.id, courseId: req.params.courseId },
    update: {},
  })
  res.json(enrollment)
})

router.post('/:courseId/lessons/:lessonId/complete', async (req, res) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: req.user!.id, courseId: req.params.courseId } },
  })
  if (!enrollment) {
    res.status(400).json({ error: 'Not enrolled in this course', code: 'NOT_ENROLLED' })
    return
  }

  await prisma.lessonProgress.upsert({
    where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId: req.params.lessonId } },
    create: { enrollmentId: enrollment.id, lessonId: req.params.lessonId },
    update: {},
  })

  const course = await prisma.course.findUnique({
    where: { id: req.params.courseId },
    include: { lessons: { select: { id: true } } },
  })
  const completed = await prisma.lessonProgress.count({ where: { enrollmentId: enrollment.id } })
  const total = course?.lessons.length ?? 1
  const progressPct = Math.round((completed / total) * 100)

  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      progressPct,
      completedAt: progressPct === 100 ? new Date() : null,
    },
  })

  res.json({ progressPct, completed, total })
})

export default router
