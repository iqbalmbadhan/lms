'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'

interface Idea {
  id: string
  title: string
  description: string
  estimatedValue: string | null
  status: string
  createdAt: string
  submittedBy: { name: string; role: string }
  reviews: { status: string; riskLevel: string }[]
}

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: 'bg-blue-50 text-blue-700 border-blue-200',
  UNDER_REVIEW: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  APPROVED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
  IN_PROGRESS: 'bg-purple-50 text-purple-700 border-purple-200',
  DEPLOYED: 'bg-gray-50 text-gray-700 border-gray-200',
}

const STATUS_LABELS: Record<string, string> = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  IN_PROGRESS: 'In Progress',
  DEPLOYED: 'Deployed',
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get<Idea[]>('/ideas')
      .then(setIdeas)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-sora text-2xl font-bold text-gray-900">Idea Studio</h1>
          <p className="text-gray-500 mt-1">Submit and track AI transformation ideas</p>
        </div>
        <Link
          href="/ideas/new"
          className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors font-sora text-sm"
        >
          + Submit Idea
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="skeleton-title" />
              <div className="skeleton-text" />
            </div>
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">💡</p>
          <p className="font-medium text-gray-600">No ideas yet</p>
          <p className="text-sm mt-1">Submit your first AI transformation idea</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <div key={idea.id} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-sora font-semibold text-gray-900">{idea.title}</h3>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_COLORS[idea.status]}`}>
                      {STATUS_LABELS[idea.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{idea.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>By {idea.submittedBy.name}</span>
                    <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                    {idea.estimatedValue && <span className="text-green-600 font-medium">{idea.estimatedValue}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
