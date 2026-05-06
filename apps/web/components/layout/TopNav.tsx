'use client'

import { signOut } from 'next-auth/react'
import { PersonaConfig } from '@/lib/persona'

interface Props {
  user: { name?: string | null; email?: string | null; image?: string | null }
  persona: PersonaConfig
}

export function TopNav({ user, persona }: Props) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="font-sora text-lg font-semibold text-gray-900 leading-tight">
          AI Business Solutions Academy
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            style={{ backgroundColor: persona.color }}
          >
            {user.name?.[0] ?? 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900 leading-tight">{user.name}</p>
            <p className="text-xs text-gray-500">{persona.label}</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
