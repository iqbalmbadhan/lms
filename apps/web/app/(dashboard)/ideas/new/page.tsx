'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'

export default function NewIdeaPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    description: '',
    businessCase: '',
    estimatedValue: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await apiClient.post('/ideas', form)
      router.push('/ideas')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/ideas" className="text-sm text-brand-600 hover:underline mb-6 inline-block">
        ← Back to ideas
      </Link>

      <h1 className="font-sora text-2xl font-bold text-gray-900 mb-2">Submit an AI Idea</h1>
      <p className="text-gray-500 mb-8">Share your AI transformation idea for review and approval</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Idea Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g., AI-Powered Contract Review System"
            required
            minLength={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Describe the AI solution you want to implement..."
            required
            minLength={20}
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Case</label>
          <textarea
            value={form.businessCase}
            onChange={(e) => update('businessCase', e.target.value)}
            placeholder="Explain the business problem this solves, the opportunity size, and why AI is the right approach..."
            required
            minLength={20}
            rows={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Business Value <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={form.estimatedValue}
            onChange={(e) => update('estimatedValue', e.target.value)}
            placeholder="e.g., $200,000 annual savings, 40% efficiency gain"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-700 hover:bg-brand-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 font-sora"
        >
          {loading ? 'Submitting...' : 'Submit Idea'}
        </button>
      </form>
    </div>
  )
}
