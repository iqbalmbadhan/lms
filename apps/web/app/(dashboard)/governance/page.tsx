'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'

interface Review {
  id: string
  status: string
  riskLevel: string
  notes: string | null
  reviewedAt: string | null
  createdAt: string
  idea: { id: string; title: string; description: string; status: string }
  reviewer: { name: string }
}

interface Policy {
  id: string
  title: string
  content: string
  version: string
  publishedAt: string
}

const RISK_COLORS: Record<string, string> = {
  LOW: 'text-green-600 bg-green-50',
  MEDIUM: 'text-yellow-600 bg-yellow-50',
  HIGH: 'text-orange-600 bg-orange-50',
  CRITICAL: 'text-red-600 bg-red-50',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-gray-600 bg-gray-50',
  APPROVED: 'text-green-600 bg-green-50',
  REJECTED: 'text-red-600 bg-red-50',
  NEEDS_REVISION: 'text-yellow-600 bg-yellow-50',
}

export default function GovernancePage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'reviews' | 'policies'>('reviews')
  const [activePolicy, setActivePolicy] = useState<Policy | null>(null)

  useEffect(() => {
    Promise.all([
      apiClient.get<Review[]>('/governance/reviews'),
      apiClient.get<Policy[]>('/governance/policies'),
    ])
      .then(([r, p]) => { setReviews(r); setPolicies(p) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-sora text-2xl font-bold text-gray-900">Governance Hub</h1>
        <p className="text-gray-500 mt-1">AI review queue, risk assessments, and policies</p>
      </div>

      <div className="flex gap-4 mb-6">
        {(['reviews', 'policies'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-brand-700 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab === 'reviews' ? 'Review Queue' : 'Policies'}
          </button>
        ))}
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
      ) : activeTab === 'reviews' ? (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">⚖️</p>
              <p className="font-medium text-gray-600">No reviews yet</p>
            </div>
          ) : reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-sora font-semibold text-gray-900">{review.idea.title}</h3>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${RISK_COLORS[review.riskLevel]}`}>
                    {review.riskLevel} Risk
                  </span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[review.status]}`}>
                    {review.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{review.idea.description}</p>
              {review.notes && (
                <div className="bg-gray-50 rounded-xl p-3 mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Reviewer Notes</p>
                  <p className="text-sm text-gray-700">{review.notes}</p>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-3">
                By {review.reviewer.name} · {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-6">
          <div className="w-72 space-y-3">
            {policies.map((policy) => (
              <button
                key={policy.id}
                onClick={() => setActivePolicy(policy)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  activePolicy?.id === policy.id
                    ? 'bg-brand-50 border-brand-200'
                    : 'bg-white border-gray-200 hover:border-brand-200'
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">{policy.title}</p>
                <p className="text-xs text-gray-400 mt-1">v{policy.version} · {new Date(policy.publishedAt).toLocaleDateString()}</p>
              </button>
            ))}
          </div>
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 overflow-y-auto max-h-screen">
            {activePolicy ? (
              <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-7 font-ibm">{activePolicy.content}</pre>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p>Select a policy to view</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
