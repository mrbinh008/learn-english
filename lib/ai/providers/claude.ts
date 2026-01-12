import Anthropic from '@anthropic-ai/sdk'
import type { AIProviderInterface, AIMessage, AIResponse, AIProviderConfig } from '@/lib/ai/types'
import { DEFAULT_MODELS } from '@/lib/ai/types'

export const claudeProvider: AIProviderInterface = {
    name: 'claude',

    async chat(messages: AIMessage[], config: AIProviderConfig): Promise<AIResponse> {
        const anthropic = new Anthropic({
            apiKey: config.apiKey
        })

        // Extract system message if present
        const systemMessage = messages.find(m => m.role === 'system')
        const chatMessages = messages
            .filter(m => m.role !== 'system')
            .map(msg => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content
            }))

        const response = await anthropic.messages.create({
            model: config.model || DEFAULT_MODELS.claude,
            max_tokens: 4096,
            system: systemMessage?.content,
            messages: chatMessages
        })

        const textContent = response.content.find(c => c.type === 'text')

        return {
            content: textContent?.type === 'text' ? textContent.text : '',
            provider: 'claude',
            model: config.model || DEFAULT_MODELS.claude,
            usage: {
                promptTokens: response.usage.input_tokens,
                completionTokens: response.usage.output_tokens,
                totalTokens: response.usage.input_tokens + response.usage.output_tokens
            }
        }
    },

    isConfigured(config: AIProviderConfig): boolean {
        return !!config.apiKey && config.apiKey.startsWith('sk-ant-')
    }
}
