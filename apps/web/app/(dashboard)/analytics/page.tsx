'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'

interface AnalyticsData {
  totalUsers: number
  totalCourses: number
  totalSolutions: number
  totalEnrollments: number
  completedEnrollments: number
  adoptionRate: number
  pendingIdeas: number
  pendingReviews: number
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get<AnalyticsData>('/analytics/dashboard')
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  const cards = data ? [
    { label: 'Total Users', value: data.totalUsers, icon: '👥', color: 'text-blue-600' },
    { label: 'Active Courses', value: data.totalCourses, icon: '📚', color: 'text-green-600' },
    { label: 'AI Solutions', value: data.totalSolutions, icon: '⚡', color: 'text-purple-600' },
    { label: 'Total Enrollments', value: data.totalEnrollments, icon: '🎓', color: 'text-indigo-600' },
    { label: 'Completions', value: data.completedEnrollments, icon: '✅', color: 'text-emerald-600' },
    { label: 'Adoption Rate', value: `${data.adoptionRate}%`, icon: '📈', color: 'text-brand-600' },
    { label: 'Pending Ideas', value: data.pendingIdeas, icon: '💡', color: 'text-yellow-600' },
    { label: 'Pending Reviews', value: data.pendingReviews, icon: '⚖️', color: 'text-orange-600' },
  ] : []

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-sora text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Platform-wide adoption and engagement metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading
          ? [...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="skeleton h-6 w-6 rounded mb-4" />
                <div className="skeleton-title w-1/2" />
                <div className="skeleton h-8 w-3/4 mt-2" />
              </div>
            ))
          : cards.map((card) => (
              <div key={card.label} className="bg-white rounded-2xl border border-gray-200 p-6">
                <span className="text-2xl">{card.icon}</span>
                <p className="text-sm text-gray-500 mt-3">{card.label}</p>
                <p className={`font-sora text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
              </div>
            ))}
      </div>
    </div>
  )
}
