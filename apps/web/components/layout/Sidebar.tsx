'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PersonaConfig } from '@/lib/persona'

interface NavItem {
  href: string
  label: string
  icon: string
  module: string
}

const ALL_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: '◇', module: 'dashboard' },
  { href: '/catalog', label: 'AI Solutions', icon: '⬡', module: 'catalog' },
  { href: '/courses', label: 'Courses', icon: '□', module: 'courses' },
  { href: '/prompts', label: 'Prompt Library', icon: '≡', module: 'prompts' },
  { href: '/tutor', label: 'AI Tutor', icon: '◎', module: 'tutor' },
  { href: '/ideas', label: 'Idea Studio', icon: '◈', module: 'ideas' },
  { href: '/governance', label: 'Governance', icon: '⊡', module: 'governance' },
  { href: '/analytics', label: 'Analytics', icon: '▤', module: 'analytics' },
]

interface Props {
  persona: PersonaConfig
}

export function Sidebar({ persona }: Props) {
  const pathname = usePathname()

  const navItems = ALL_NAV.filter(
    (item) =>
      item.module === 'dashboard' ||
      persona.allowedModules.includes(item.module as Parameters<typeof persona.allowedModules.includes>[0])
  )

  return (
    <aside className="w-64 bg-brand-900 flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-brand-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <p className="font-sora text-white font-semibold text-sm leading-tight">AI Academy</p>
            <p className="text-brand-400 text-xs">Business Solutions</p>
          </div>
        </div>
      </div>

      {/* Persona badge */}
      <div className="px-4 py-4 border-b border-brand-800">
        <div
          className="rounded-xl px-3 py-2.5"
          style={{ backgroundColor: `${persona.color}20`, borderLeft: `3px solid ${persona.color}` }}
        >
          <p className="text-xs font-medium" style={{ color: persona.color }}>
            {persona.label}
          </p>
          <p className="text-brand-400 text-xs mt-0.5">{persona.description}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-700 text-white'
                  : 'text-brand-300 hover:bg-brand-800 hover:text-white'
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-brand-800">
        <p className="text-brand-500 text-xs text-center">
          AI Business Academy v1.0
        </p>
      </div>
    </aside>
  )
}
