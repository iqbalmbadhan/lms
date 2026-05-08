import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AuthorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.systemRole !== 'AUTHOR' && session.user.systemRole !== 'SUPER_ADMIN') {
    redirect('/apply-author')
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-64 bg-brand-900 flex flex-col h-full">
        <div className="h-16 flex items-center px-6 border-b border-brand-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✍️</span>
            <div>
              <p className="font-sora text-white font-semibold text-sm">Author Studio</p>
              <p className="text-brand-400 text-xs">Course Creator</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { href: '/author', label: 'Dashboard', icon: '◇' },
            { href: '/author/courses', label: 'My Courses', icon: '📚' },
            { href: '/author/courses/new', label: 'Create Course', icon: '＋' },
            { href: '/author/earnings', label: 'Earnings', icon: '💰' },
            { href: '/author/payouts', label: 'Payouts', icon: '💸' },
            { href: '/author/profile', label: 'Profile', icon: '👤' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-300 hover:bg-brand-800 hover:text-white transition-all"
            >
              <span className="w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-brand-800">
          <Link href="/dashboard" className="text-xs text-brand-500 hover:text-brand-300 transition-colors">
            ← Back to learning
          </Link>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <p className="font-sora font-semibold text-gray-900">Author Studio</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-white text-sm font-bold">
              {session.user.name?.[0] ?? 'A'}
            </div>
            <p className="text-sm text-gray-600">{session.user.name}</p>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
