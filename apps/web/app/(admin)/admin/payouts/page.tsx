'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'

interface Payout {
  id: string
  amount: number
  method: string
  status: string
  accountDetails: string | null
  notes: string | null
  adminNotes: string | null
  createdAt: string
  author: { name: string; email: string }
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-yellow-400 bg-yellow-950',
  PROCESSING: 'text-blue-400 bg-blue-950',
  COMPLETED: 'text-green-400 bg-green-950',
  REJECTED: 'text-red-400 bg-red-950',
}

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  function load() {
    const params = filter ? `?status=${filter}` : ''
    apiClient.get<Payout[]>(`/admin/payouts${params}`).then(setPayouts).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [filter])

  async function updateStatus(id: string, status: string, adminNotes?: string) {
    setProcessing(id)
    await apiClient.patch(`/admin/payouts/${id}`, { status, adminNotes: adminNotes ?? '' })
    load()
    setProcessing(null)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-sora text-2xl font-bold text-white">Payout Requests</h1>
          <p className="text-gray-400 mt-1">Process author withdrawal requests</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse h-32" />)}
        </div>
      ) : payouts.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">💸</p>
          <p className="font-medium text-gray-400">No payout requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payouts.map((payout) => (
            <div key={payout.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-sora font-semibold text-white">{payout.author.name}</h3>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[payout.status]}`}>
                      {payout.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-0.5">{payout.author.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-sora font-bold text-2xl text-white">${payout.amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 capitalize">{payout.method}</p>
                </div>
              </div>

              {payout.accountDetails && (
                <div className="bg-gray-800 rounded-xl px-4 py-2 text-sm text-gray-300 mb-3 font-mono">
                  {payout.accountDetails}
                </div>
              )}

              <p className="text-xs text-gray-500 mb-3">{new Date(payout.createdAt).toLocaleDateString()}</p>

              {payout.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(payout.id, 'REJECTED')}
                    disabled={processing === payout.id}
                    className="px-4 py-2 bg-red-900 hover:bg-red-800 text-red-300 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => updateStatus(payout.id, 'PROCESSING')}
                    disabled={processing === payout.id}
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-blue-300 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    Mark Processing
                  </button>
                  <button
                    onClick={() => updateStatus(payout.id, 'COMPLETED')}
                    disabled={processing === payout.id}
                    className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    {processing === payout.id ? '...' : 'Mark Paid ✓'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
