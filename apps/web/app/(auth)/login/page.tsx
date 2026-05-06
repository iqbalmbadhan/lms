'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password. Try exec@aidemo.com / Demo@2025')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-accent-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur rounded-2xl mb-4">
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="font-sora text-3xl font-bold text-white">AI Business Academy</h1>
          <p className="text-brand-200 mt-2">Sign in to your learning portal</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="font-sora text-xl font-semibold text-gray-900 mb-6">Welcome back</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-700 hover:bg-brand-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sora"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              Demo accounts — password: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">Demo@2025</code>
            </p>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[
                ['exec@aidemo.com', 'Executive'],
                ['po@aidemo.com', 'Product Owner'],
                ['dev@aidemo.com', 'Developer'],
                ['hr@aidemo.com', 'HR'],
                ['gov@aidemo.com', 'Governance'],
                ['cs@aidemo.com', 'Cust. Service'],
              ].map(([email, label]) => (
                <button
                  key={email}
                  onClick={() => { setEmail(email); setPassword('Demo@2025') }}
                  className="text-xs bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-200 rounded-lg px-2 py-1.5 text-gray-600 hover:text-brand-700 transition-all text-left"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-center text-gray-500 mt-6">
            No account?{' '}
            <Link href="/register" className="text-brand-600 hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
