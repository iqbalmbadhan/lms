export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface StreamOptions {
  systemPrompt: string
  messages: ChatMessage[]
  model?: string
  maxTokens?: number
  onChunk: (text: string) => void
  onDone: () => void
  onError: (error: Error) => void
}

export interface AIProvider {
  name: string
  defaultModel: string
  availableModels: ModelOption[]
  stream(options: StreamOptions): Promise<void>
}

export interface ModelOption {
  id: string
  label: string
  contextWindow: number
  description: string
}
