'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'

interface Lesson {
  id: string
  title: string
  order: number
  durationMin: number
}

interface Course {
  id: string
  title: string
  description: string
  estimatedMins: number
  passingScore: number
  lessons: Lesson[]
  enrollments: { id: string; progressPct: number; completedAt: string | null }[]
}

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    apiClient.get<Course>(`/courses/${params.courseId}`)
      .then(setCourse)
      .finally(() => setLoading(false))
  }, [params.courseId])

  async function enroll() {
    setEnrolling(true)
    try {
      await apiClient.post(`/courses/${params.courseId}/enroll`, {})
      const updated = await apiClient.get<Course>(`/courses/${params.courseId}`)
      setCourse(updated)
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="skeleton-title mb-4 w-1/2" />
        <div className="skeleton-text" />
        <div className="skeleton-text" />
      </div>
    )
  }

  if (!course) return <div className="p-8 text-gray-500">Course not found.</div>

  const enrollment = course.enrollments[0]
  const isEnrolled = !!enrollment

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/courses" className="text-sm text-brand-600 hover:underline mb-6 inline-block">
        ← Back to courses
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
        <h1 className="font-sora text-2xl font-bold text-gray-900 mb-3">{course.title}</h1>
        <p className="text-gray-600 mb-6">{course.description}</p>

        <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
          <span>{course.lessons.length} lessons</span>
          <span>{course.estimatedMins} minutes</span>
          <span>Pass: {course.passingScore}%</span>
        </div>

        {isEnrolled ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-bold text-brand-700">{enrollment.progressPct}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all"
                style={{ width: `${enrollment.progressPct}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={enroll}
            disabled={enrolling}
            className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-50 font-sora"
          >
            {enrolling ? 'Enrolling...' : 'Enroll in Course'}
          </button>
        )}
      </div>

      <h2 className="font-sora font-semibold text-gray-900 mb-4">Course Lessons</h2>
      <div className="space-y-3">
        {course.lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={isEnrolled ? `/courses/${course.id}/lesson/${lesson.id}` : '#'}
            className={`flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 transition-all ${
              isEnrolled
                ? 'hover:border-brand-200 hover:shadow-sm'
                : 'opacity-60 cursor-default'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {lesson.order}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
              <p className="text-xs text-gray-400">{lesson.durationMin} min</p>
            </div>
            {isEnrolled && <span className="text-gray-300">→</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}
