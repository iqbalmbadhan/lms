'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'

interface AdminStats {
  totalUsers: number
  totalAuthors: number
  pendingAuthors: number
  totalCourses: number
  pendingCourses: number
  totalOrders: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get<AdminStats>('/admin/stats').then(setStats).finally(() => setLoading(false))
  }, [])

  const cards = stats ? [
    { label: 'Total Learners', value: stats.totalUsers, icon: '👥', color: 'text-blue-400', bg: 'bg-blue-950 border-blue-800' },
    { label: 'Active Authors', value: stats.totalAuthors, icon: '✍️', color: 'text-purple-400', bg: 'bg-purple-950 border-purple-800' },
    { label: 'Pending Applications', value: stats.pendingAuthors, icon: '⏳', color: 'text-yellow-400', bg: 'bg-yellow-950 border-yellow-800', alert: stats.pendingAuthors > 0 },
    { label: 'Total Courses', value: stats.totalCourses, icon: '📚', color: 'text-green-400', bg: 'bg-green-950 border-green-800' },
    { label: 'Pending Approval', value: stats.pendingCourses, icon: '🔍', color: 'text-orange-400', bg: 'bg-orange-950 border-orange-800', alert: stats.pendingCourses > 0 },
    { label: 'Total Orders', value: stats.totalOrders, icon: '🛒', color: 'text-teal-400', bg: 'bg-teal-950 border-teal-800' },
    { label: 'Platform Revenue', value: `$${(stats.totalRevenue ?? 0).toFixed(2)}`, icon: '💰', color: 'text-emerald-400', bg: 'bg-emerald-950 border-emerald-800' },
  ] : []

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-sora text-2xl font-bold text-white">Platform Overview</h1>
        <p className="text-gray-400 mt-1">Real-time metrics across the entire LMS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {loading
          ? [...Array(7)].map((_, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-3" />
                <div className="h-8 bg-gray-700 rounded w-3/4" />
              </div>
            ))
          : cards.map((card) => (
              <div key={card.label} className={`border rounded-2xl p-6 ${card.bg} ${card.alert ? 'ring-2 ring-yellow-500' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{card.label}</p>
                    <p className={`font-sora text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                  </div>
                  <span className="text-2xl">{card.icon}</span>
                </div>
                {card.alert && (
                  <p className="text-xs text-yellow-400 mt-2 font-medium">⚠ Requires attention</p>
                )}
              </div>
            ))}
      </div>
    </div>
  )
}
