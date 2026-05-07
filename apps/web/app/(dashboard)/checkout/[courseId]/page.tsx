'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'

interface Course {
  id: string
  title: string
  description: string
  price: number
  isFree: boolean
  estimatedMins: number
  lessons: { id: string }[]
  author: { name: string } | null
}

interface OwnershipCheck {
  owned: boolean
}

export default function CheckoutPage({ params }: { params: { courseId: string } }) {
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [owned, setOwned] = useState(false)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [method, setMethod] = useState<'stripe' | 'paypal' | 'manual'>('manual')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      apiClient.get<Course>(`/courses/${params.courseId}`),
      apiClient.get<OwnershipCheck>(`/orders/check/${params.courseId}`),
    ]).then(([c, o]) => {
      setCourse(c as Course)
      setOwned(o.owned)
    }).finally(() => setLoading(false))
  }, [params.courseId])

  async function purchase() {
    if (!course) return
    setProcessing(true)
    setError('')
    try {
      if (course.isFree) {
        const order = await apiClient.post<{ id: string }>('/orders', { courseId: course.id, paymentMethod: 'free' })
        await apiClient.post(`/orders/${order.id}/confirm`, {})
        router.push(`/courses/${course.id}`)
        return
      }
      const order = await apiClient.post<{ id: string }>('/orders', { courseId: course.id, paymentMethod: method })
      if (method === 'manual') {
        router.push(`/checkout/pending?orderId=${order.id}`)
      } else {
        router.push(`/checkout/pending?orderId=${order.id}&method=${method}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    )
  }

  if (!course) return <div className="p-8 text-gray-500">Course not found.</div>

  if (owned) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h1 className="font-sora text-xl font-bold text-gray-900 mb-2">Already Enrolled!</h1>
        <p className="text-gray-500 mb-6">You already own this course.</p>
        <Link href={`/courses/${course.id}`} className="bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-800 transition-colors inline-block font-sora">
          Go to Course
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <Link href={`/courses/${course.id}`} className="text-sm text-brand-600 hover:underline mb-6 inline-block">← Back to course</Link>

      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h1 className="font-sora text-xl font-bold text-gray-900 mb-2">Complete your enrollment</h1>

        {/* Course summary */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-900">{course.title}</h3>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
            <span>{course.lessons.length} lessons</span>
            <span>{course.estimatedMins} min</span>
            {course.author && <span>by {course.author.name}</span>}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 mb-6">
          <span className="font-medium text-gray-700">Total</span>
          <span className="font-sora font-bold text-2xl text-gray-900">
            {course.isFree ? 'Free' : `$${course.price.toFixed(2)}`}
          </span>
        </div>

        {/* Payment method (only for paid courses) */}
        {!course.isFree && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Payment Method</p>
            <div className="space-y-2">
              {([
                { value: 'stripe', label: '💳 Credit / Debit Card', desc: 'Stripe — secure card payment' },
                { value: 'paypal', label: '🟡 PayPal', desc: 'Pay with your PayPal account' },
                { value: 'manual', label: '🏦 Bank Transfer', desc: 'Manual — admin confirms after payment' },
              ] as const).map((opt) => (
                <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${method === opt.value ? 'border-brand-400 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" value={opt.value} checked={method === opt.value} onChange={() => setMethod(opt.value)} className="mt-0.5 accent-brand-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                    <p className="text-xs text-gray-400">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">{error}</div>}

        <button
          onClick={purchase}
          disabled={processing}
          className="w-full bg-brand-700 hover:bg-brand-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 font-sora"
        >
          {processing ? 'Processing...' : course.isFree ? 'Enroll for Free' : `Pay $${course.price.toFixed(2)}`}
        </button>

        <p className="text-xs text-gray-400 text-center mt-3">
          {course.isFree ? 'No payment required' : 'Secure checkout. 30-day refund policy.'}
        </p>
      </div>
    </div>
  )
}
