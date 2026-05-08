'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { apiClient } from '@/lib/api-client'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function TutorPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    apiClient.post<{ id: string }>('/tutor/sessions', {}).then((s) => setSessionId(s.id))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || isStreaming || !sessionId) return
    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsStreaming(true)
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    const res = await fetch(`/api/tutor/sessions/${sessionId}/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
      credentials: 'include',
    })

    if (!res.body) { setIsStreaming(false); return }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = decoder.decode(value).split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.replace('data: ', '').trim()
          if (raw === '[DONE]') { setIsStreaming(false); break }
          try {
            const { text, error } = JSON.parse(raw)
            if (error) { setIsStreaming(false); break }
            if (text) {
              setMessages((prev) => {
                const updated = [...prev]
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: updated[updated.length - 1].content + text,
                }
                return updated
              })
            }
          } catch {}
        }
      }
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center mt-16 text-gray-400">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">◎</span>
            </div>
            <p className="font-sora font-semibold text-gray-700 text-lg">
              Hello, {session?.user?.name?.split(' ')[0]}
            </p>
            <p className="text-sm mt-2 max-w-sm mx-auto">
              Ask me anything about AI solutions, your courses, or how to apply AI in your role. I&apos;m tailored to your persona.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[72%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-700 text-white rounded-br-sm'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.role === 'assistant' && isStreaming && i === messages.length - 1 && (
                <span className="inline-block w-0.5 h-4 bg-gray-400 animate-pulse ml-0.5 align-middle" />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
            }}
            placeholder="Ask your AI tutor anything... (Enter to send, Shift+Enter for new line)"
            rows={2}
            disabled={isStreaming}
            className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={isStreaming || !input.trim()}
            className="px-5 py-3 bg-brand-700 text-white text-sm font-medium rounded-xl hover:bg-brand-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-sora"
          >
            {isStreaming ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
