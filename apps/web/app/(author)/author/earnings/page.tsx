'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'

interface Earning {
  id: string
  grossAmount: number
  authorAmount: number
  platformAmount: number
  isPaidOut: boolean
  createdAt: string
  order: { createdAt: string; user: { name: string } }
}

interface EarningsData {
  earnings: Earning[]
  pendingBalance: number
  totalEarnings: number
}

export default function AuthorEarningsPage() {
  const [data, setData] = useState<EarningsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get<EarningsData>('/author/earnings').then(setData).finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-sora text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-500 mt-1">Your course revenue breakdown</p>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Available Balance', value: data ? `$${data.pendingBalance.toFixed(2)}` : '...', color: 'text-green-600', note: 'Ready to withdraw' },
          { label: 'All-time Earnings', value: data ? `$${data.totalEarnings.toFixed(2)}` : '...', color: 'text-brand-700', note: 'Total paid out' },
          { label: 'Total Transactions', value: data ? String(data.earnings.length) : '...', color: 'text-gray-900', note: 'Course sales' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className={`font-sora text-2xl font-bold mt-1 ${card.color}`}>{loading ? '...' : card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.note}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-sora font-semibold text-gray-900">Transaction History</h2>
          <a href="/author/payouts" className="text-sm text-brand-600 hover:underline">Request payout →</a>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Student</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Gross Sale</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Your Earnings</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Platform Fee</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? [...Array(5)].map((_, i) => (
              <tr key={i}>{[...Array(6)].map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}</tr>
            )) : data?.earnings.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-900">{e.order.user.name}</td>
                <td className="px-6 py-4 text-gray-600">${e.grossAmount.toFixed(2)}</td>
                <td className="px-6 py-4 text-green-600 font-semibold">${e.authorAmount.toFixed(2)}</td>
                <td className="px-6 py-4 text-gray-400">${e.platformAmount.toFixed(2)}</td>
                <td className="px-6 py-4 text-gray-400">{new Date(e.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${e.isPaidOut ? 'text-gray-500 bg-gray-100' : 'text-green-600 bg-green-50'}`}>
                    {e.isPaidOut ? 'Paid out' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
