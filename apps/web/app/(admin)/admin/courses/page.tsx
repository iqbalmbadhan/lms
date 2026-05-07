'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'

interface PendingCourse {
  id: string
  title: string
  description: string
  price: number
  isFree: boolean
  revenueSharePct: number
  createdAt: string
  author: { name: string; email: string } | null
  lessons: { id: string }[]
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<PendingCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [splits, setSplits] = useState<Record<string, number>>({})
  const [processing, setProcessing] = useState<string | null>(null)

  function load() {
    apiClient.get<PendingCourse[]>('/admin/courses/pending').then((data) => {
      setCourses(data)
      const initial: Record<string, number> = {}
      data.forEach((c) => { initial[c.id] = c.revenueSharePct })
      setSplits(initial)
    }).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  async function approve(courseId: string) {
    setProcessing(courseId)
    await apiClient.patch(`/admin/courses/${courseId}/revenue`, { revenueSharePct: splits[courseId] })
    await apiClient.post(`/admin/courses/${courseId}/approve`, {})
    load()
    setProcessing(null)
  }

  async function reject(courseId: string) {
    setProcessing(courseId)
    await apiClient.post(`/admin/courses/${courseId}/reject`, {})
    load()
    setProcessing(null)
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-sora text-2xl font-bold text-white">Course Approvals</h1>
        <p className="text-gray-400 mt-1">Review and set revenue splits before publishing</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse h-40" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">✅</p>
          <p className="font-medium text-gray-400">No courses pending approval</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-sora font-semibold text-white">{course.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{course.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>By {course.author?.name ?? 'Unknown'}</span>
                    <span>{course.lessons?.length ?? 0} lessons</span>
                    <span className={course.isFree ? 'text-green-400' : 'text-yellow-400'}>
                      {course.isFree ? 'Free' : `$${course.price}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Revenue Split Setter */}
              {!course.isFree && (
                <div className="bg-gray-800 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-wide">Revenue Split</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Author gets</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={50}
                          max={90}
                          step={5}
                          value={splits[course.id] ?? 70}
                          onChange={(e) => setSplits((prev) => ({ ...prev, [course.id]: Number(e.target.value) }))}
                          className="flex-1 accent-purple-500"
                        />
                        <span className="text-purple-400 font-bold text-lg w-12 text-right">
                          {splits[course.id] ?? 70}%
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Platform gets</p>
                      <p className="text-emerald-400 font-bold text-lg">
                        {100 - (splits[course.id] ?? 70)}%
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    On a ${course.price} sale: Author earns ${((course.price * (splits[course.id] ?? 70)) / 100).toFixed(2)}, Platform earns ${((course.price * (100 - (splits[course.id] ?? 70))) / 100).toFixed(2)}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => reject(course.id)}
                  disabled={processing === course.id}
                  className="px-4 py-2 bg-red-900 hover:bg-red-800 text-red-300 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => approve(course.id)}
                  disabled={processing === course.id}
                  className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  {processing === course.id ? 'Approving...' : 'Approve & Publish'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
