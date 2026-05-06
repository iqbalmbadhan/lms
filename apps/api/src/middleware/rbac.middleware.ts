import { Request, Response, NextFunction } from 'express'
import { PersonaRole } from '@prisma/client'

type Module = 'catalog' | 'courses' | 'prompts' | 'ideas' | 'governance' | 'tutor' | 'analytics' | 'admin'

const MODULE_ACCESS: Record<PersonaRole, Module[]> = {
  EXECUTIVE: ['catalog', 'analytics', 'governance', 'ideas'],
  PRODUCT_OWNER: ['catalog', 'courses', 'ideas', 'prompts', 'tutor'],
  BUSINESS_ANALYST: ['prompts', 'courses', 'catalog', 'tutor', 'ideas'],
  CUSTOMER_SERVICE: ['prompts', 'courses', 'catalog', 'tutor'],
  HR: ['courses', 'catalog', 'prompts', 'tutor', 'ideas'],
  FINANCE: ['catalog', 'courses', 'prompts', 'analytics', 'tutor'],
  LEGAL_SOURCING: ['catalog', 'courses', 'prompts', 'governance', 'tutor'],
  DEVELOPER: ['catalog', 'courses', 'prompts', 'tutor', 'ideas'],
  GOVERNANCE: ['governance', 'analytics', 'catalog', 'courses', 'ideas'],
}

export function requireRole(...roles: PersonaRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role as PersonaRole
    if (!userRole || !roles.includes(userRole)) {
      res.status(403).json({ error: 'Insufficient permissions', code: 'FORBIDDEN' })
      return
    }
    next()
  }
}

export function requireModule(module: Module) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role as PersonaRole
    if (!userRole || !MODULE_ACCESS[userRole]?.includes(module)) {
      res.status(403).json({
        error: `Access to ${module} module is not allowed for your role`,
        code: 'MODULE_ACCESS_DENIED',
      })
      return
    }
    next()
  }
}
