'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'

interface Application {
  id: string
  bio: string | null
  expertise: string[]
  website: string | null
  appliedAt: string
  user: { id: string; name: string; email: string; createdAt: string }
}

export default function AdminAuthorsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  function load() {
    apiClient.get<Application[]>('/admin/author-applications').then(setApplications).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  async function approve(userId: string) {
    setProcessing(userId)
    await apiClient.post(`/admin/author-applications/${userId}/approve`, {})
    load()
    setProcessing(null)
  }

  async function reject(userId: string) {
    setProcessing(userId)
    await apiClient.post(`/admin/author-applications/${userId}/reject`, {})
    load()
    setProcessing(null)
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-sora text-2xl font-bold text-white">Author Applications</h1>
        <p className="text-gray-400 mt-1">{applications.length} pending review</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse">
              <div className="h-5 bg-gray-700 rounded w-1/3 mb-3" />
              <div className="h-4 bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">✅</p>
          <p className="font-medium text-gray-400">No pending applications</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-sora font-semibold text-white text-lg">{app.user.name}</h3>
                  <p className="text-gray-400 text-sm">{app.user.email}</p>
                  <p className="text-gray-600 text-xs mt-1">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => reject(app.user.id)}
                    disabled={processing === app.user.id}
                    className="px-4 py-2 bg-red-900 hover:bg-red-800 text-red-300 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => approve(app.user.id)}
                    disabled={processing === app.user.id}
                    className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    {processing === app.user.id ? 'Processing...' : 'Approve'}
                  </button>
                </div>
              </div>

              {app.bio && (
                <div className="bg-gray-800 rounded-xl p-4 mb-3">
                  <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Bio</p>
                  <p className="text-sm text-gray-300">{app.bio}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {app.expertise.map((skill) => (
                  <span key={skill} className="text-xs bg-purple-950 text-purple-300 px-2.5 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
