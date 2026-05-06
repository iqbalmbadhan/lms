import { AIProvider } from './provider.interface'
import { anthropicProvider } from './providers/anthropic.provider'
import { openaiProvider } from './providers/openai.provider'
import { geminiProvider } from './providers/gemini.provider'
import { openrouterProvider } from './providers/openrouter.provider'
import { PersonaRole } from '@prisma/client'
import { Response } from 'express'

export const PROVIDERS: Record<string, AIProvider> = {
  ANTHROPIC: anthropicProvider,
  OPENAI: openaiProvider,
  GEMINI: geminiProvider,
  OPENROUTER: openrouterProvider,
}

export function getProvider(providerKey: string): AIProvider {
  const provider = PROVIDERS[providerKey] ?? PROVIDERS[process.env.DEFAULT_AI_PROVIDER ?? 'ANTHROPIC']
  if (!provider) throw new Error(`Unknown AI provider: ${providerKey}`)
  return provider
}

const PERSONA_SYSTEM_PROMPTS: Record<PersonaRole, string> = {
  EXECUTIVE: `You are an AI business advisor for executive leadership. Focus on strategic value,
    ROI, governance, and risk. Keep responses concise and decision-oriented.
    Always connect AI capabilities to measurable business outcomes.`,
  PRODUCT_OWNER: `You are an AI assistant for product owners. Help with backlog refinement,
    user story generation, prioritization frameworks, and roadmap planning.
    Be specific and use agile/product management terminology.`,
  BUSINESS_ANALYST: `You are an AI assistant for business analysts. Help with requirements gathering,
    process documentation, user story writing, and data analysis.
    Provide structured, detailed responses with examples.`,
  CUSTOMER_SERVICE: `You are an AI assistant for customer service teams. Help optimize responses,
    knowledge base articles, escalation paths, and sentiment analysis.
    Focus on speed, empathy, and resolution quality.`,
  HR: `You are an AI assistant for HR professionals. Help with onboarding workflows,
    policy documentation, workforce planning, and employee engagement.
    Maintain sensitivity and compliance awareness.`,
  FINANCE: `You are an AI assistant for finance teams. Help with forecasting models,
    spend analysis, budget planning, and financial reporting.
    Be precise with numbers and flag assumptions clearly.`,
  LEGAL_SOURCING: `You are an AI assistant for legal and sourcing teams. Help with contract review,
    supplier risk assessment, compliance checklists, and policy drafting.
    Always note that responses are not legal advice.`,
  DEVELOPER: `You are an AI coding assistant. Help with code generation, architecture decisions,
    API design, debugging, and automation scripts.
    Provide working code examples with clear explanations.`,
  GOVERNANCE: `You are an AI governance advisor. Help with AI risk assessment, policy creation,
    audit preparation, ethics reviews, and compliance frameworks.
    Emphasize responsible AI principles and regulatory requirements.`,
}

export async function streamTutorResponse({
  providerKey,
  model,
  role,
  messages,
  courseContext,
  res,
}: {
  providerKey: string
  model?: string
  role: PersonaRole
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  courseContext: string | null
  res: Response
}): Promise<void> {
  const provider = getProvider(providerKey)

  const systemPrompt =
    PERSONA_SYSTEM_PROMPTS[role] +
    (courseContext ? `\n\nCurrent course context: ${courseContext}` : '')

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')

  await provider.stream({
    systemPrompt,
    messages,
    model,
    maxTokens: 1024,
    onChunk: (text) => {
      res.write(`data: ${JSON.stringify({ text, provider: provider.name })}\n\n`)
    },
    onDone: () => {
      res.write('data: [DONE]\n\n')
      res.end()
    },
    onError: (error) => {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`)
      res.end()
    },
  })
}

export function getAllProviders() {
  return Object.entries(PROVIDERS).map(([key, provider]) => ({
    key,
    name: provider.name,
    defaultModel: provider.defaultModel,
    models: provider.availableModels,
  }))
}
