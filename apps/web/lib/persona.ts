export type PersonaRole =
  | 'EXECUTIVE'
  | 'PRODUCT_OWNER'
  | 'BUSINESS_ANALYST'
  | 'CUSTOMER_SERVICE'
  | 'HR'
  | 'FINANCE'
  | 'LEGAL_SOURCING'
  | 'DEVELOPER'
  | 'GOVERNANCE'

export type Module =
  | 'catalog'
  | 'courses'
  | 'prompts'
  | 'ideas'
  | 'governance'
  | 'tutor'
  | 'analytics'
  | 'admin'

export type Widget =
  | 'roi_summary'
  | 'adoption_rate'
  | 'course_progress'
  | 'pending_ideas'
  | 'governance_queue'
  | 'ai_solutions_count'
  | 'prompt_usage'
  | 'team_readiness'

export interface PersonaConfig {
  role: PersonaRole
  label: string
  description: string
  color: string
  allowedModules: Module[]
  dashboardWidgets: Widget[]
}

export const PERSONA_CONFIG: Record<PersonaRole, PersonaConfig> = {
  EXECUTIVE: {
    role: 'EXECUTIVE',
    label: 'Executive Leadership',
    description: 'Strategic oversight, ROI, and governance',
    color: '#7C3AED',
    allowedModules: ['catalog', 'analytics', 'governance', 'ideas'],
    dashboardWidgets: ['roi_summary', 'adoption_rate', 'ai_solutions_count', 'pending_ideas'],
  },
  PRODUCT_OWNER: {
    role: 'PRODUCT_OWNER',
    label: 'Product Owner',
    description: 'Backlog intelligence, roadmap prioritization',
    color: '#2563EB',
    allowedModules: ['catalog', 'courses', 'ideas', 'prompts', 'tutor'],
    dashboardWidgets: ['course_progress', 'pending_ideas', 'prompt_usage', 'ai_solutions_count'],
  },
  BUSINESS_ANALYST: {
    role: 'BUSINESS_ANALYST',
    label: 'Business Analyst',
    description: 'Requirements prompts, story generation',
    color: '#0891B2',
    allowedModules: ['prompts', 'courses', 'catalog', 'tutor', 'ideas'],
    dashboardWidgets: ['course_progress', 'prompt_usage', 'ai_solutions_count'],
  },
  CUSTOMER_SERVICE: {
    role: 'CUSTOMER_SERVICE',
    label: 'Customer Service',
    description: 'Agent Assist, knowledge optimization',
    color: '#16A34A',
    allowedModules: ['prompts', 'courses', 'catalog', 'tutor'],
    dashboardWidgets: ['course_progress', 'prompt_usage', 'team_readiness'],
  },
  HR: {
    role: 'HR',
    label: 'Human Resources',
    description: 'Onboarding, workforce readiness',
    color: '#D97706',
    allowedModules: ['courses', 'catalog', 'prompts', 'tutor', 'ideas'],
    dashboardWidgets: ['team_readiness', 'course_progress', 'adoption_rate'],
  },
  FINANCE: {
    role: 'FINANCE',
    label: 'Finance',
    description: 'Forecasting, spend intelligence',
    color: '#DC2626',
    allowedModules: ['catalog', 'courses', 'prompts', 'analytics', 'tutor'],
    dashboardWidgets: ['roi_summary', 'adoption_rate', 'prompt_usage'],
  },
  LEGAL_SOURCING: {
    role: 'LEGAL_SOURCING',
    label: 'Legal & Sourcing',
    description: 'Contract intelligence, supplier risk',
    color: '#7C3AED',
    allowedModules: ['catalog', 'courses', 'prompts', 'governance', 'tutor'],
    dashboardWidgets: ['governance_queue', 'prompt_usage', 'ai_solutions_count'],
  },
  DEVELOPER: {
    role: 'DEVELOPER',
    label: 'Developer',
    description: 'App Engine, automation, API guidance',
    color: '#0F172A',
    allowedModules: ['catalog', 'courses', 'prompts', 'tutor', 'ideas'],
    dashboardWidgets: ['course_progress', 'prompt_usage', 'ai_solutions_count'],
  },
  GOVERNANCE: {
    role: 'GOVERNANCE',
    label: 'Governance Team',
    description: 'Responsible AI controls, audits, approvals',
    color: '#B45309',
    allowedModules: ['governance', 'analytics', 'catalog', 'courses', 'ideas'],
    dashboardWidgets: ['governance_queue', 'pending_ideas', 'adoption_rate', 'roi_summary'],
  },
}

export function getPersonaConfig(role: PersonaRole): PersonaConfig {
  return PERSONA_CONFIG[role]
}

export function canAccess(role: PersonaRole, module: Module): boolean {
  return PERSONA_CONFIG[role]?.allowedModules.includes(module) ?? false
}
