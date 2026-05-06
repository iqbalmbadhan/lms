'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'

interface Course {
  id: string
  title: string
  description: string
  estimatedMins: number
  personas: string[]
  status: string
  lessons: { id: string }[]
  enrollments: { progressPct: number; completedAt: string | null }[]
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get<Course[]>('/courses')
      .then(setCourses)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-sora text-2xl font-bold text-gray-900">Courses</h1>
        <p className="text-gray-500 mt-1">Learn AI skills tailored to your role</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="skeleton-title" />
              <div className="skeleton-text" />
              <div className="skeleton h-2 w-full rounded-full mt-4" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📚</p>
          <p className="font-medium text-gray-600">No courses available yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => {
            const enrollment = course.enrollments[0]
            const progress = enrollment?.progressPct ?? 0
            const completed = !!enrollment?.completedAt
            const lessonCount = course.lessons.length

            return (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="block bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-brand-200 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-sora font-semibold text-gray-900">{course.title}</h3>
                      {completed && (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{lessonCount} lessons</span>
                      <span>{course.estimatedMins} min</span>
                    </div>
                  </div>
                  <div className="ml-6 text-right">
                    <p className="text-2xl font-sora font-bold text-brand-700">{progress}%</p>
                    <p className="text-xs text-gray-400 mt-0.5">complete</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-600 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
