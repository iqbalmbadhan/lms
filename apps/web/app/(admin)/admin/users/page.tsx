'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'

interface User {
  id: string
  name: string
  email: string
  role: string
  systemRole: string
  isActive: boolean
  createdAt: string
  authorProfile: { isApproved: boolean } | null
}

const SYSTEM_ROLE_COLORS: Record<string, string> = {
  LEARNER: 'text-blue-400 bg-blue-950',
  AUTHOR: 'text-purple-400 bg-purple-950',
  SUPER_ADMIN: 'text-red-400 bg-red-950',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')

  function load() {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filter) params.set('systemRole', filter)
    apiClient.get<User[]>(`/admin/users?${params}`).then(setUsers).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [search, filter])

  async function toggleActive(user: User) {
    await apiClient.patch(`/admin/users/${user.id}`, { isActive: !user.isActive })
    load()
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-sora text-2xl font-bold text-white">Users</h1>
        <p className="text-gray-400 mt-1">Manage all platform users</p>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 max-w-sm bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Roles</option>
          <option value="LEARNER">Learners</option>
          <option value="AUTHOR">Authors</option>
          <option value="SUPER_ADMIN">Admins</option>
        </select>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800">
            <tr>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Name</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Email</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">System Role</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Joined</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Status</th>
              <th className="text-right px-6 py-3 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading
              ? [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-800 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-gray-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${SYSTEM_ROLE_COLORS[user.systemRole]}`}>
                        {user.systemRole}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${user.isActive ? 'text-green-400 bg-green-950' : 'text-red-400 bg-red-950'}`}>
                        {user.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleActive(user)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${user.isActive ? 'bg-red-900 hover:bg-red-800 text-red-300' : 'bg-green-900 hover:bg-green-800 text-green-300'}`}
                      >
                        {user.isActive ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
