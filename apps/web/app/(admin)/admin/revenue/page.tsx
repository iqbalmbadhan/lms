'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'

interface RevenueData {
  orders: {
    id: string
    amount: number
    createdAt: string
    user: { name: string; email: string }
    course: { title: string; author: { name: string } | null }
  }[]
  platformRevenue: number
  authorRevenue: number
}

export default function AdminRevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get<RevenueData>('/admin/revenue').then(setData).finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-sora text-2xl font-bold text-white">Revenue Overview</h1>
        <p className="text-gray-400 mt-1">Platform-wide sales and earnings breakdown</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Total Gross Revenue', value: data ? `$${(data.platformRevenue + data.authorRevenue).toFixed(2)}` : '—', color: 'text-white' },
          { label: 'Platform Earnings', value: data ? `$${data.platformRevenue.toFixed(2)}` : '—', color: 'text-emerald-400' },
          { label: 'Author Payouts (due)', value: data ? `$${data.authorRevenue.toFixed(2)}` : '—', color: 'text-purple-400' },
        ].map((card) => (
          <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-sm text-gray-400">{card.label}</p>
            <p className={`font-sora text-2xl font-bold mt-1 ${card.color}`}>{loading ? '...' : card.value}</p>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="font-sora font-semibold text-white">Recent Transactions</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-800">
            <tr>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Buyer</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Course</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Author</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Amount</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading
              ? [...Array(5)].map((_, i) => (
                  <tr key={i}>{[...Array(5)].map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-800 rounded animate-pulse" /></td>)}</tr>
                ))
              : data?.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-white">{order.user.name}</td>
                    <td className="px-6 py-4 text-gray-300">{order.course.title}</td>
                    <td className="px-6 py-4 text-gray-400">{order.course.author?.name ?? '—'}</td>
                    <td className="px-6 py-4 text-emerald-400 font-semibold">${order.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
