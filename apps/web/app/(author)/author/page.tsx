'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'

interface AuthorCourse {
  id: string
  title: string
  price: number
  isFree: boolean
  isApproved: boolean
  status: string
  lessons: { id: string }[]
  enrollments: { id: string }[]
  orders: { amount: number }[]
}

interface EarningsData {
  pendingBalance: number
  totalEarnings: number
}

export default function AuthorDashboard() {
  const [courses, setCourses] = useState<AuthorCourse[]>([])
  const [earnings, setEarnings] = useState<EarningsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiClient.get<AuthorCourse[]>('/author/courses'),
      apiClient.get<EarningsData>('/author/earnings'),
    ]).then(([c, e]) => { setCourses(c); setEarnings(e) }).finally(() => setLoading(false))
  }, [])

  const totalStudents = courses.reduce((sum, c) => sum + c.enrollments.length, 0)
  const totalRevenue = courses.reduce((sum, c) => sum + c.orders.reduce((s, o) => s + o.amount, 0), 0)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-sora text-2xl font-bold text-gray-900">Author Dashboard</h1>
        <p className="text-gray-500 mt-1">Your courses, students, and earnings</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Courses', value: courses.length, icon: '📚', color: 'text-brand-700' },
          { label: 'Total Students', value: totalStudents, icon: '👥', color: 'text-blue-700' },
          { label: 'Pending Balance', value: loading ? '...' : `$${(earnings?.pendingBalance ?? 0).toFixed(2)}`, icon: '💰', color: 'text-green-700' },
          { label: 'All-time Earnings', value: loading ? '...' : `$${(earnings?.totalEarnings ?? 0).toFixed(2)}`, icon: '📈', color: 'text-purple-700' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className={`font-sora text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
              </div>
              <span className="text-2xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sora font-semibold text-gray-900">My Courses</h2>
        <Link href="/author/courses/new" className="bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
          + New Course
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse h-24" />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-200">
          <p className="text-3xl mb-2">📚</p>
          <p className="font-medium text-gray-600">No courses yet</p>
          <Link href="/author/courses/new" className="text-brand-600 text-sm hover:underline mt-1 inline-block">Create your first course →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${course.isApproved ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'}`}>
                    {course.isApproved ? 'Published' : course.status === 'PUBLISHED' ? 'Pending Review' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {course.lessons.length} lessons · {course.enrollments.length} students · {course.isFree ? 'Free' : `$${course.price}`}
                </p>
              </div>
              <Link href={`/author/courses/${course.id}/edit`} className="text-sm text-brand-600 hover:underline">Edit</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
