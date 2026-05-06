'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'

interface Lesson {
  id: string
  title: string
  content: string
  order: number
  durationMin: number
  courseId: string
}

interface Course {
  id: string
  title: string
  lessons: { id: string; title: string; order: number }[]
}

export default function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string }
}) {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    Promise.all([
      apiClient.get<Course>(`/courses/${params.courseId}`),
    ]).then(([courseData]) => {
      setCourse(courseData)
      const found = (courseData as Course & { lessons: Lesson[] }).lessons.find(
        (l) => l.id === params.lessonId
      )
      if (found) setLesson(found as unknown as Lesson)
      setLoading(false)
    })
  }, [params.courseId, params.lessonId])

  async function markComplete() {
    setCompleting(true)
    try {
      await apiClient.post(`/courses/${params.courseId}/lessons/${params.lessonId}/complete`, {})
      setCompleted(true)
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-4xl">
        <div className="skeleton-title mb-6 w-2/3" />
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton-text" />)}
        </div>
      </div>
    )
  }

  if (!lesson || !course) return <div className="p-8 text-gray-500">Lesson not found.</div>

  const currentIndex = course.lessons.findIndex((l) => l.id === lesson.id)
  const nextLesson = course.lessons[currentIndex + 1]
  const prevLesson = course.lessons[currentIndex - 1]

  return (
    <div className="flex h-full">
      {/* Lesson sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 overflow-y-auto p-4 flex-shrink-0">
        <Link href={`/courses/${params.courseId}`} className="text-xs text-brand-600 hover:underline mb-3 block">
          ← {course.title}
        </Link>
        <div className="space-y-1">
          {course.lessons.map((l, i) => (
            <Link
              key={l.id}
              href={`/courses/${params.courseId}/lesson/${l.id}`}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                l.id === lesson.id
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-xs text-gray-400 w-5">{i + 1}</span>
              <span className="flex-1 leading-tight">{l.title}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* Lesson content */}
      <div className="flex-1 overflow-y-auto p-8 max-w-3xl">
        <h1 className="font-sora text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
        <p className="text-sm text-gray-400 mb-8">{lesson.durationMin} min read</p>

        <div className="prose prose-gray max-w-none text-sm leading-7 whitespace-pre-wrap">
          {lesson.content}
        </div>

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6">
          {prevLesson ? (
            <Link
              href={`/courses/${params.courseId}/lesson/${prevLesson.id}`}
              className="text-sm text-gray-600 hover:text-brand-700 flex items-center gap-2"
            >
              ← Previous
            </Link>
          ) : <div />}

          {!completed ? (
            <button
              onClick={markComplete}
              disabled={completing}
              className="bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {completing ? 'Saving...' : 'Mark Complete'}
            </button>
          ) : (
            <span className="text-sm text-green-600 font-medium">✓ Completed</span>
          )}

          {nextLesson ? (
            <Link
              href={`/courses/${params.courseId}/lesson/${nextLesson.id}`}
              className="text-sm text-gray-600 hover:text-brand-700 flex items-center gap-2"
            >
              Next →
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  )
}
