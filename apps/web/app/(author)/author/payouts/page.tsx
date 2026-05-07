'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'

interface Payout {
  id: string
  amount: number
  method: string
  status: string
  createdAt: string
  adminNotes: string | null
}

interface EarningsData {
  pendingBalance: number
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-yellow-600 bg-yellow-50',
  PROCESSING: 'text-blue-600 bg-blue-50',
  COMPLETED: 'text-green-600 bg-green-50',
  REJECTED: 'text-red-600 bg-red-50',
}

export default function AuthorPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [earnings, setEarnings] = useState<EarningsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ amount: '', method: 'paypal', accountDetails: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function load() {
    Promise.all([
      apiClient.get<Payout[]>('/author/payouts'),
      apiClient.get<EarningsData>('/author/earnings'),
    ]).then(([p, e]) => { setPayouts(p); setEarnings(e) }).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  async function requestPayout(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await apiClient.post('/author/payouts', { amount: Number(form.amount), method: form.method, accountDetails: form.accountDetails })
      setForm({ amount: '', method: 'paypal', accountDetails: '' })
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-sora text-2xl font-bold text-gray-900">Payouts</h1>
        <p className="text-gray-500 mt-1">Request withdrawal of your earnings</p>
      </div>

      {/* Request form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-sora font-semibold text-gray-900">Request Payout</h2>
          <div className="text-right">
            <p className="text-xs text-gray-400">Available balance</p>
            <p className="font-sora font-bold text-lg text-green-600">${(earnings?.pendingBalance ?? 0).toFixed(2)}</p>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">{error}</div>}

        <form onSubmit={requestPayout} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input type="number" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} placeholder="10.00" min={10} step={0.01} required className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Method</label>
              <select value={form.method} onChange={(e) => setForm((p) => ({ ...p, method: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                <option value="paypal">PayPal</option>
                <option value="bank">Bank Transfer</option>
                <option value="stripe">Stripe</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Details</label>
            <input type="text" value={form.accountDetails} onChange={(e) => setForm((p) => ({ ...p, accountDetails: e.target.value }))} placeholder={form.method === 'paypal' ? 'PayPal email address' : 'Bank account / routing details'} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <button type="submit" disabled={submitting} className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 font-sora text-sm">
            {submitting ? 'Submitting...' : 'Submit Payout Request'}
          </button>
        </form>
      </div>

      {/* History */}
      <h2 className="font-sora font-semibold text-gray-900 mb-4">Payout History</h2>
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse h-20" />)}
        </div>
      ) : payouts.length === 0 ? (
        <p className="text-gray-400 text-sm">No payout requests yet.</p>
      ) : (
        <div className="space-y-3">
          {payouts.map((payout) => (
            <div key={payout.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-gray-900">${payout.amount.toFixed(2)}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[payout.status]}`}>{payout.status}</span>
                  <span className="text-xs text-gray-400 capitalize">{payout.method}</span>
                </div>
                {payout.adminNotes && <p className="text-xs text-gray-500 mt-1">Note: {payout.adminNotes}</p>}
              </div>
              <p className="text-xs text-gray-400">{new Date(payout.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
