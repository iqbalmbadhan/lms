import { prisma } from '../lib/prisma'

export async function searchSolutions(query: string, limit = 10) {
  return prisma.solution.findMany({
    where: {
      isActive: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
      ],
    },
    take: limit,
  })
}

export async function searchPrompts(query: string, limit = 10) {
  return prisma.prompt.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
      ],
    },
    take: limit,
  })
}
