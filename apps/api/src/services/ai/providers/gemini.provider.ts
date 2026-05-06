import { GoogleGenerativeAI } from '@google/generative-ai'
import { AIProvider, StreamOptions, ModelOption } from '../provider.interface'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

export const geminiProvider: AIProvider = {
  name: 'Google Gemini',
  defaultModel: 'gemini-2.0-flash',
  availableModels: [
    {
      id: 'gemini-2.0-flash',
      label: 'Gemini 2.0 Flash',
      contextWindow: 1000000,
      description: 'Fast with 1M token context window',
    },
    {
      id: 'gemini-1.5-pro',
      label: 'Gemini 1.5 Pro',
      contextWindow: 2000000,
      description: 'Most capable Gemini — 2M context',
    },
    {
      id: 'gemini-1.5-flash',
      label: 'Gemini 1.5 Flash',
      contextWindow: 1000000,
      description: 'Lightweight and efficient',
    },
  ] satisfies ModelOption[],

  async stream({ systemPrompt, messages, model, onChunk, onDone, onError }) {
    try {
      const geminiModel = genAI.getGenerativeModel({
        model: model ?? this.defaultModel,
        systemInstruction: systemPrompt,
      })

      const history = messages.slice(0, -1).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))

      const lastMessage = messages[messages.length - 1].content

      const chat = geminiModel.startChat({ history })
      const result = await chat.sendMessageStream(lastMessage)

      for await (const chunk of result.stream) {
        const text = chunk.text()
        if (text) onChunk(text)
      }
      onDone()
    } catch (err) {
      onError(err instanceof Error ? err : new Error(String(err)))
    }
  },
}
