'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'

export default function ApplyAuthorPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({ bio: '', expertise: '', website: '', paypalEmail: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await apiClient.post('/author/apply', {
        bio: form.bio,
        expertise: form.expertise.split(',').map((s) => s.trim()).filter(Boolean),
        website: form.website || undefined,
        paypalEmail: form.paypalEmail || undefined,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="font-sora text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h1>
        <p className="text-gray-600 mb-6">Your author application is under review. We&apos;ll notify you once approved — usually within 24-48 hours.</p>
        <button onClick={() => router.push('/dashboard')} className="bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-800 transition-colors font-sora">
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✍️</span>
        </div>
        <h1 className="font-sora text-2xl font-bold text-gray-900">Become an Author</h1>
        <p className="text-gray-500 mt-2">Create and sell courses on AI Business Academy. Share your expertise and earn.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-6">{error}</div>}

      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio <span className="text-gray-400 font-normal">(min 50 characters)</span></label>
            <textarea value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} placeholder="Tell us about your professional background, experience, and why you want to teach AI skills..." required minLength={50} rows={5} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            <p className="text-xs text-gray-400 mt-1">{form.bio.length}/50 chars minimum</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Expertise <span className="text-gray-400 font-normal">(comma-separated)</span></label>
            <input type="text" value={form.expertise} onChange={(e) => setForm((p) => ({ ...p, expertise: e.target.value }))} placeholder="e.g., AI Strategy, Machine Learning, Product Management, Finance" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website / LinkedIn <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="url" value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} placeholder="https://yourwebsite.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PayPal Email <span className="text-gray-400 font-normal">(for payouts, optional now)</span></label>
            <input type="email" value={form.paypalEmail} onChange={(e) => setForm((p) => ({ ...p, paypalEmail: e.target.value }))} placeholder="paypal@yourmail.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-brand-700 hover:bg-brand-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 font-sora">
            {loading ? 'Submitting Application...' : 'Submit Author Application'}
          </button>
        </form>
      </div>
    </div>
  )
}
