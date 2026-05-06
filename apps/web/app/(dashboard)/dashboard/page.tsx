import { auth } from '@/lib/auth'
import { getPersonaConfig } from '@/lib/persona'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) return null

  const persona = getPersonaConfig(session.user.role as Parameters<typeof getPersonaConfig>[0])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-sora text-2xl font-bold text-gray-900">
          Welcome back, {session.user.name?.split(' ')[0]}
        </h1>
        <p className="text-gray-500 mt-1">
          {persona.label} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <DashboardClient persona={persona} />
    </div>
  )
}
