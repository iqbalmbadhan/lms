'use client'

import { useState, useEffect } from 'react'
import { PersonaConfig } from '@/lib/persona'
import { apiClient } from '@/lib/api-client'

interface Stats {
  totalUsers: number
  totalCourses: number
  totalSolutions: number
  totalEnrollments: number
  completedEnrollments: number
  adoptionRate: number
  pendingIdeas: number
  pendingReviews: number
}

interface Props {
  persona: PersonaConfig
}

export function DashboardClient({ persona }: Props) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (persona.allowedModules.includes('analytics')) {
      apiClient.get<Stats>('/analytics/dashboard')
        .then(setStats)
        .catch(() => setStats(null))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [persona])

  const widgets = persona.dashboardWidgets

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {widgets.includes('roi_summary') && (
        <StatCard
          title="Estimated Annual ROI"
          value={loading ? null : stats ? `$${(stats.totalSolutions * 200000).toLocaleString()}` : 'N/A'}
          subtitle="From deployed AI solutions"
          icon="💰"
          color="bg-purple-50 border-purple-200"
          textColor="text-purple-700"
        />
      )}
      {widgets.includes('adoption_rate') && (
        <StatCard
          title="AI Adoption Rate"
          value={loading ? null : stats ? `${stats.adoptionRate}%` : 'N/A'}
          subtitle="Course completion rate"
          icon="📈"
          color="bg-blue-50 border-blue-200"
          textColor="text-blue-700"
        />
      )}
      {widgets.includes('ai_solutions_count') && (
        <StatCard
          title="AI Solutions Available"
          value={loading ? null : stats ? String(stats.totalSolutions) : 'N/A'}
          subtitle="Active in the catalog"
          icon="⚡"
          color="bg-indigo-50 border-indigo-200"
          textColor="text-indigo-700"
        />
      )}
      {widgets.includes('course_progress') && (
        <StatCard
          title="Active Courses"
          value={loading ? null : stats ? String(stats.totalCourses) : 'N/A'}
          subtitle="Available for your role"
          icon="📚"
          color="bg-green-50 border-green-200"
          textColor="text-green-700"
        />
      )}
      {widgets.includes('pending_ideas') && (
        <StatCard
          title="Ideas Pending Review"
          value={loading ? null : stats ? String(stats.pendingIdeas) : 'N/A'}
          subtitle="Awaiting governance review"
          icon="💡"
          color="bg-yellow-50 border-yellow-200"
          textColor="text-yellow-700"
        />
      )}
      {widgets.includes('governance_queue') && (
        <StatCard
          title="Governance Queue"
          value={loading ? null : stats ? String(stats.pendingReviews) : 'N/A'}
          subtitle="Pending AI system reviews"
          icon="⚖️"
          color="bg-orange-50 border-orange-200"
          textColor="text-orange-700"
        />
      )}
      {widgets.includes('prompt_usage') && (
        <StatCard
          title="Total Enrollments"
          value={loading ? null : stats ? String(stats.totalEnrollments) : 'N/A'}
          subtitle="Platform-wide learning activity"
          icon="🎯"
          color="bg-teal-50 border-teal-200"
          textColor="text-teal-700"
        />
      )}
      {widgets.includes('team_readiness') && (
        <StatCard
          title="Team Members"
          value={loading ? null : stats ? String(stats.totalUsers) : 'N/A'}
          subtitle="Active platform users"
          icon="👥"
          color="bg-pink-50 border-pink-200"
          textColor="text-pink-700"
        />
      )}
    </div>
  )
}

function StatCard({
  title, value, subtitle, icon, color, textColor,
}: {
  title: string
  value: string | null
  subtitle: string
  icon: string
  color: string
  textColor: string
}) {
  return (
    <div className={`bg-white border rounded-2xl p-6 ${color}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {value === null ? (
            <div className="skeleton h-8 w-24 mt-2" />
          ) : (
            <p className={`font-sora text-2xl font-bold mt-1 ${textColor}`}>{value}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  )
}
