import Anthropic from '@anthropic-ai/sdk'
import { AIProvider, StreamOptions, ModelOption } from '../provider.interface'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export const anthropicProvider: AIProvider = {
  name: 'Anthropic Claude',
  defaultModel: 'claude-sonnet-4-5',
  availableModels: [
    {
      id: 'claude-opus-4-5',
      label: 'Claude Opus 4.5',
      contextWindow: 200000,
      description: 'Most capable — best for complex reasoning',
    },
    {
      id: 'claude-sonnet-4-5',
      label: 'Claude Sonnet 4.5',
      contextWindow: 200000,
      description: 'Balanced speed and intelligence',
    },
    {
      id: 'claude-haiku-4-5-20251001',
      label: 'Claude Haiku 4.5',
      contextWindow: 200000,
      description: 'Fastest — best for quick responses',
    },
  ] satisfies ModelOption[],

  async stream({ systemPrompt, messages, model, maxTokens = 1024, onChunk, onDone, onError }) {
    try {
      const stream = client.messages.stream({
        model: model ?? this.defaultModel,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages,
      })

      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          onChunk(event.delta.text)
        }
      }
      onDone()
    } catch (err) {
      onError(err instanceof Error ? err : new Error(String(err)))
    }
  },
}
