'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'

interface Prompt {
  id: string
  title: string
  description: string
  content: string
  personas: string[]
  tags: string[]
  category: string
  useCount: number
  savedBy: { savedAt: string }[]
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const params = search ? `?search=${encodeURIComponent(search)}` : ''
    apiClient.get<Prompt[]>(`/prompts${params}`)
      .then(setPrompts)
      .finally(() => setLoading(false))
  }, [search])

  async function copyPrompt(prompt: Prompt) {
    await navigator.clipboard.writeText(prompt.content)
    await apiClient.post(`/prompts/${prompt.id}/use`, {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function toggleSave(prompt: Prompt) {
    const isSaved = prompt.savedBy.length > 0
    if (isSaved) {
      await apiClient.delete(`/prompts/${prompt.id}/save`)
    } else {
      await apiClient.post(`/prompts/${prompt.id}/save`, {})
    }
    setPrompts((prev) =>
      prev.map((p) =>
        p.id === prompt.id
          ? { ...p, savedBy: isSaved ? [] : [{ savedAt: new Date().toISOString() }] }
          : p
      )
    )
    if (activePrompt?.id === prompt.id) {
      setActivePrompt((prev) =>
        prev ? { ...prev, savedBy: isSaved ? [] : [{ savedAt: new Date().toISOString() }] } : prev
      )
    }
  }

  return (
    <div className="flex h-full">
      {/* Prompt list */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="font-sora font-bold text-gray-900 mb-3">Prompt Library</h1>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-3 rounded-xl border border-gray-100">
                  <div className="skeleton-title" />
                  <div className="skeleton-text" />
                </div>
              ))}
            </div>
          ) : (
            prompts.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => setActivePrompt(prompt)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  activePrompt?.id === prompt.id ? 'bg-brand-50 border-l-2 border-l-brand-600' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900 leading-tight">{prompt.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{prompt.description}</p>
                  </div>
                  {prompt.savedBy.length > 0 && (
                    <span className="text-yellow-400 flex-shrink-0 text-base">★</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                    {prompt.category}
                  </span>
                  <span className="text-xs text-gray-400">{prompt.useCount} uses</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Prompt detail */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activePrompt ? (
          <div>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-sora text-xl font-bold text-gray-900">{activePrompt.title}</h2>
                <p className="text-gray-500 mt-1">{activePrompt.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <button
                  onClick={() => toggleSave(activePrompt)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${
                    activePrompt.savedBy.length > 0
                      ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {activePrompt.savedBy.length > 0 ? '★ Saved' : '☆ Save'}
                </button>
                <button
                  onClick={() => copyPrompt(activePrompt)}
                  className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  {copied ? '✓ Copied!' : 'Copy Prompt'}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {activePrompt.tags.map((tag) => (
                <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="bg-gray-900 rounded-2xl p-6">
              <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Prompt Template</p>
              <pre className="text-sm text-gray-100 whitespace-pre-wrap font-mono leading-relaxed">
                {activePrompt.content}
              </pre>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-5xl mb-4">≡</p>
              <p className="font-medium text-gray-600">Select a prompt to view</p>
              <p className="text-sm mt-1">Browse and copy AI prompts tailored to your role</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
