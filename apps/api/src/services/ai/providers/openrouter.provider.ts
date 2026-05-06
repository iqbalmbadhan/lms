import OpenAI from 'openai'
import { AIProvider, StreamOptions, ModelOption } from '../provider.interface'

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://yourdomain.com',
    'X-Title': 'AI Business LMS',
  },
})

export const openrouterProvider: AIProvider = {
  name: 'OpenRouter',
  defaultModel: 'meta-llama/llama-3.3-70b-instruct',
  availableModels: [
    {
      id: 'meta-llama/llama-3.3-70b-instruct',
      label: 'Llama 3.3 70B',
      contextWindow: 128000,
      description: 'Meta — open source, strong all-rounder',
    },
    {
      id: 'google/gemini-2.0-flash-001',
      label: 'Gemini 2.0 Flash (via OR)',
      contextWindow: 1000000,
      description: 'Google via OpenRouter',
    },
    {
      id: 'deepseek/deepseek-r1',
      label: 'DeepSeek R1',
      contextWindow: 64000,
      description: 'Strong reasoning at low cost',
    },
    {
      id: 'mistralai/mistral-large',
      label: 'Mistral Large',
      contextWindow: 128000,
      description: 'Mistral — fast European model',
    },
    {
      id: 'qwen/qwen-2.5-72b-instruct',
      label: 'Qwen 2.5 72B',
      contextWindow: 128000,
      description: 'Alibaba — strong multilingual',
    },
  ] satisfies ModelOption[],

  async stream({ systemPrompt, messages, model, maxTokens = 1024, onChunk, onDone, onError }) {
    try {
      const stream = await client.chat.completions.create({
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
