'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'

interface Solution {
  id: string
  title: string
  description: string
  businessValue: string
  personas: string[]
  category: string
  tags: string[]
  complexity: number
}

export default function CatalogPage() {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const params = search ? `?search=${encodeURIComponent(search)}` : ''
    apiClient.get<Solution[]>(`/catalog${params}`)
      .then(setSolutions)
      .finally(() => setLoading(false))
  }, [search])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-sora text-2xl font-bold text-gray-900">AI Solution Catalog</h1>
        <p className="text-gray-500 mt-1">Discover AI solutions tailored to your role</p>
      </div>

      <div className="mb-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search solutions by name, category, or tag..."
          className="w-full max-w-lg border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="skeleton-title" />
              <div className="skeleton-text" />
              <div className="skeleton-text" />
              <div className="skeleton h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : solutions.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium text-gray-600">No solutions found</p>
          <p className="text-sm mt-1">Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {solutions.map((sol) => (
            <SolutionCard key={sol.id} solution={sol} />
          ))}
        </div>
      )}
    </div>
  )
}

function SolutionCard({ solution }: { solution: Solution }) {
  const complexityLabels = ['', 'Starter', 'Easy', 'Moderate', 'Advanced', 'Expert']
  const complexityColors = ['', 'text-green-600 bg-green-50', 'text-blue-600 bg-blue-50', 'text-yellow-600 bg-yellow-50', 'text-orange-600 bg-orange-50', 'text-red-600 bg-red-50']

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-brand-200 transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
          {solution.category}
        </span>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${complexityColors[solution.complexity]}`}>
          {complexityLabels[solution.complexity]}
        </span>
      </div>

      <h3 className="font-sora font-semibold text-gray-900 mb-2 group-hover:text-brand-700 transition-colors">
        {solution.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{solution.description}</p>

      <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-4">
        <p className="text-xs font-medium text-green-700 mb-1">Business Value</p>
        <p className="text-xs text-green-600 line-clamp-2">{solution.businessValue}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {solution.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
