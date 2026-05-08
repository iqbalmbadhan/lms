'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PendingContent() {
  const params = useSearchParams()
  const orderId = params.get('orderId')
  const method = params.get('method') ?? 'manual'

  return (
    <div className="p-8 max-w-lg mx-auto text-center">
      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">⏳</span>
      </div>
      <h1 className="font-sora text-2xl font-bold text-gray-900 mb-3">Order Pending</h1>
      <p className="text-gray-600 mb-2">
        Your order <code className="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono">{orderId?.slice(0, 8)}...</code> has been created.
      </p>
      <p className="text-gray-500 text-sm mb-8">
        {method === 'manual'
          ? 'Please complete your bank transfer and contact us with proof of payment. Your course will be activated within 24 hours.'
          : 'Please complete your payment. Your course will be activated automatically once confirmed.'}
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8 text-left">
        <p className="text-sm font-semibold text-blue-800 mb-2">Bank Transfer Details</p>
        <div className="space-y-1 text-sm text-blue-700">
          <p>Account Name: AI Business Academy</p>
          <p>Reference: {orderId}</p>
          <p className="text-xs text-blue-500 mt-2">Include your Order ID as the payment reference</p>
        </div>
      </div>
      <Link href="/dashboard" className="bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-800 transition-colors inline-block font-sora">
        Back to Dashboard
      </Link>
    </div>
  )
}

export default function PendingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading...</div>}>
      <PendingContent />
    </Suspense>
  )
}
