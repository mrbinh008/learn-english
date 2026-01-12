import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIProviderInterface, AIMessage, AIResponse, AIProviderConfig } from '@/lib/ai/types'
import { DEFAULT_MODELS } from '@/lib/ai/types'

export const geminiProvider: AIProviderInterface = {
    name: 'gemini',

    async chat(messages: AIMessage[], config: AIProviderConfig): Promise<AIResponse> {
        const genAI = new GoogleGenerativeAI(config.apiKey)
        const model = genAI.getGenerativeModel({
            model: config.model || DEFAULT_MODELS.gemini
        })

        // Convert messages to Gemini format
        const history = messages.slice(0, -1).map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }))

        const chat = model.startChat({ history })
        const lastMessage = messages[messages.length - 1]

        const result = await chat.sendMessage(lastMessage.content)
        const response = await result.response

        return {
            content: response.text(),
            provider: 'gemini',
            model: config.model || DEFAULT_MODELS.gemini,
            usage: {
                promptTokens: response.usageMetadata?.promptTokenCount,
                completionTokens: response.usageMetadata?.candidatesTokenCount,
                totalTokens: response.usageMetadata?.totalTokenCount
            }
        }
    },

    isConfigured(config: AIProviderConfig): boolean {
        return !!config.apiKey && config.apiKey.length > 0
    }
}
