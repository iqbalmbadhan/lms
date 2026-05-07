import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.systemRole !== 'SUPER_ADMIN') redirect('/dashboard')

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-gray-900 flex flex-col h-full border-r border-gray-800">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <p className="font-sora text-white font-semibold text-sm">Super Admin</p>
              <p className="text-gray-500 text-xs">Platform Control</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { href: '/admin', label: 'Dashboard', icon: '◇' },
            { href: '/admin/users', label: 'Users', icon: '👥' },
            { href: '/admin/authors', label: 'Author Applications', icon: '✍️' },
            { href: '/admin/courses', label: 'Course Approvals', icon: '📚' },
            { href: '/admin/revenue', label: 'Revenue', icon: '💰' },
            { href: '/admin/payouts', label: 'Payouts', icon: '💸' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
            >
              <span className="w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-800">
          <Link href="/dashboard" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to main app
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 flex-shrink-0">
          <p className="text-white font-sora font-semibold">Admin Panel</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">
              {session.user.name?.[0] ?? 'A'}
            </div>
            <p className="text-sm text-gray-400">{session.user.name}</p>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-950 text-white">
          {children}
        </main>
      </div>
    </div>
  )
}
