import OpenAI from 'openai'
import { AIProvider, ModelOption } from '../provider.interface'

let _client: OpenAI | null = null
function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? 'missing' })
  }
  return _client
}

export const openaiProvider: AIProvider = {
  name: 'OpenAI',
  defaultModel: 'gpt-4o',
  availableModels: [
    {
      id: 'gpt-4o',
      label: 'GPT-4o',
      contextWindow: 128000,
      description: 'Most capable OpenAI model',
    },
    {
      id: 'gpt-4o-mini',
      label: 'GPT-4o Mini',
      contextWindow: 128000,
      description: 'Fast and cost-efficient',
    },
    {
      id: 'o1-mini',
      label: 'o1 Mini',
      contextWindow: 128000,
      description: 'Strong reasoning for complex tasks',
    },
  ] satisfies ModelOption[],

  async stream({ systemPrompt, messages, model, maxTokens = 1024, onChunk, onDone, onError }) {
    try {
      const stream = await getClient().chat.completions.create({
        model: model ?? this.defaultModel,
        max_tokens: maxTokens,
        stream: true,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
      })

      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content
        if (text) onChunk(text)
      }
      onDone()
    } catch (err) {
      onError(err instanceof Error ? err : new Error(String(err)))
    }
  },
}
