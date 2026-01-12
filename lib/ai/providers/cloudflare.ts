import type { AIProviderInterface, AIMessage, AIResponse, AIProviderConfig } from '@/lib/ai/types'
import { DEFAULT_MODELS } from '@/lib/ai/types'

export const cloudflareProvider: AIProviderInterface = {
    name: 'cloudflare',

    async chat(messages: AIMessage[], config: AIProviderConfig): Promise<AIResponse> {
        if (!config.accountId) {
            throw new Error('Cloudflare Account ID is required')
        }

        const model = config.model || DEFAULT_MODELS.cloudflare
        const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/ai/run/${model}`

        // Convert messages to Cloudflare format
        const formattedMessages = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }))

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: formattedMessages
            })
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Cloudflare AI error: ${error}`)
        }

        const data = await response.json()

        return {
            content: data.result?.response || '',
            provider: 'cloudflare',
            model: model
        }
    },

    isConfigured(config: AIProviderConfig): boolean {
        return !!config.apiKey && !!config.accountId
    }
}
