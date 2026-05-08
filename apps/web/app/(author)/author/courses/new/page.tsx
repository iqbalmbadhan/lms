'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'

export default function NewCoursePage() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', description: '', price: 0, isFree: true, estimatedMins: 60 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(field: string, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const course = await apiClient.post<{ id: string }>('/author/courses', form)
      router.push(`/author/courses/${course.id}/edit`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/author" className="text-sm text-brand-600 hover:underline mb-6 inline-block">← Author Dashboard</Link>
      <h1 className="font-sora text-2xl font-bold text-gray-900 mb-2">Create New Course</h1>
      <p className="text-gray-500 mb-8">Fill in the basics — you can add lessons after creating the course</p>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-6">{error}</div>}

      <form onSubmit={submit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
          <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g., AI for Finance Professionals" required minLength={5} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="What will students learn?" required minLength={20} rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration (minutes)</label>
          <input type="number" value={form.estimatedMins} onChange={(e) => update('estimatedMins', Number(e.target.value))} min={5} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>

        <div className="bg-gray-50 rounded-2xl p-5">
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <input type="checkbox" checked={form.isFree} onChange={(e) => update('isFree', e.target.checked)} className="w-4 h-4 accent-brand-600" />
            <span className="font-medium text-gray-900">This is a free course</span>
          </label>
          {!form.isFree && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input type="number" value={form.price} onChange={(e) => update('price', Number(e.target.value))} min={1} step={0.01} className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Admin will set the final revenue split before publishing</p>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-brand-700 hover:bg-brand-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 font-sora">
          {loading ? 'Creating...' : 'Create Course & Add Lessons'}
        </button>
      </form>
    </div>
  )
}
