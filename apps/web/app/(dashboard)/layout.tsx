import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopNav } from '@/components/layout/TopNav'
import { getPersonaConfig } from '@/lib/persona'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  const persona = getPersonaConfig(session.user.role as Parameters<typeof getPersonaConfig>[0])

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar persona={persona} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav user={session.user} persona={persona} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
