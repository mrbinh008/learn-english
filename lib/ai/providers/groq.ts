import Groq from 'groq-sdk'
import type { AIProviderInterface, AIMessage, AIResponse, AIProviderConfig } from '@/lib/ai/types'
import { DEFAULT_MODELS } from '@/lib/ai/types'

export const groqProvider: AIProviderInterface = {
    name: 'groq',

    async chat(messages: AIMessage[], config: AIProviderConfig): Promise<AIResponse> {
        const groq = new Groq({
            apiKey: config.apiKey
        })

        const response = await groq.chat.completions.create({
            model: config.model || DEFAULT_MODELS.groq,
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }))
        })

        return {
            content: response.choices[0]?.message?.content || '',
            provider: 'groq',
            model: config.model || DEFAULT_MODELS.groq,
            usage: {
                promptTokens: response.usage?.prompt_tokens,
                completionTokens: response.usage?.completion_tokens,
                totalTokens: response.usage?.total_tokens
            }
        }
    },

    isConfigured(config: AIProviderConfig): boolean {
        return !!config.apiKey && config.apiKey.startsWith('gsk_')
    }
}
