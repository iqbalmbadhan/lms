'use client'

import { useState, useEffect } from 'react'

const PROVIDERS = [
  {
    key: 'ANTHROPIC',
    name: 'Anthropic Claude',
    models: [
      { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5 (Recommended)' },
      { id: 'claude-opus-4-5', label: 'Claude Opus 4.5' },
      { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 (Fastest)' },
    ],
  },
  {
    key: 'OPENAI',
    name: 'OpenAI',
    models: [
      { id: 'gpt-4o', label: 'GPT-4o (Recommended)' },
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini (Fastest)' },
      { id: 'o1-mini', label: 'o1 Mini (Reasoning)' },
    ],
  },
  {
    key: 'GEMINI',
    name: 'Google Gemini',
    models: [
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Recommended)' },
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
      { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Fastest)' },
    ],
  },
  {
    key: 'OPENROUTER',
    name: 'OpenRouter',
    models: [
      { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B (Recommended)' },
      { id: 'deepseek/deepseek-r1', label: 'DeepSeek R1 (Reasoning)' },
      { id: 'mistralai/mistral-large', label: 'Mistral Large' },
      { id: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash via OR' },
      { id: 'qwen/qwen-2.5-72b-instruct', label: 'Qwen 2.5 72B' },
    ],
  },
]

export default function AdminSettingsPage() {
  const [provider, setProvider] = useState('ANTHROPIC')
  const [model, setModel] = useState('claude-sonnet-4-5')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  const currentProvider = PROVIDERS.find((p) => p.key === provider)

  useEffect(() => {
    fetch('/api/admin/settings/ai', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.provider) setProvider(data.provider)
        if (data.model) setModel(data.model)
      })
      .finally(() => setLoading(false))
  }, [])

  function handleProviderChange(key: string) {
    setProvider(key)
    const p = PROVIDERS.find((x) => x.key === key)
    setModel(p?.models[0]?.id ?? '')
    setSaved(false)
  }

  async function save() {
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/settings/ai', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ provider, model }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 bg-gray-800 rounded animate-pulse mb-8" />
        <div className="h-64 bg-gray-800 rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-sora text-2xl font-bold text-white">AI Tutor Settings</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Choose which AI model powers the tutor for all users. Users cannot see or change this.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
        {/* Provider */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">AI Provider</label>
          <div className="grid grid-cols-2 gap-3">
            {PROVIDERS.map((p) => (
              <button
                key={p.key}
                onClick={() => handleProviderChange(p.key)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  provider === p.key
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                <p className="font-medium text-sm">{p.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.models.length} models</p>
              </button>
            ))}
          </div>
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Model</label>
          <div className="space-y-2">
            {currentProvider?.models.map((m) => (
              <button
                key={m.id}
                onClick={() => { setModel(m.id); setSaved(false) }}
                className={`w-full p-3.5 rounded-xl border text-left transition-all text-sm ${
                  model === m.id
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active preview */}
        <div className="bg-gray-800 rounded-xl p-4 text-xs text-gray-400">
          <span className="text-gray-500">Active config: </span>
          <span className="text-white font-mono">{provider} / {model}</span>
        </div>

        {/* Save */}
        <button
          onClick={save}
          disabled={saving}
          className={`w-full py-3 rounded-xl font-medium text-sm font-sora transition-all ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50'
          }`}
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <p className="text-xs text-gray-600 mt-4">
        Changes take effect immediately for all new tutor sessions. Make sure the corresponding API key is set in your environment variables.
      </p>
    </div>
  )
}
