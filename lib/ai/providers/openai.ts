import OpenAI from 'openai'
import type { AIProviderInterface, AIMessage, AIResponse, AIProviderConfig } from '@/lib/ai/types'
import { DEFAULT_MODELS } from '@/lib/ai/types'

export const openaiProvider: AIProviderInterface = {
    name: 'openai',

    async chat(messages: AIMessage[], config: AIProviderConfig): Promise<AIResponse> {
        try {
            // Log configuration for debugging
            console.log('🔧 OpenAI Provider Configuration:', {
                hasApiKey: !!config.apiKey,
                apiKeyPrefix: config.apiKey?.substring(0, 10) + '...',
                baseUrl: config.baseUrl || 'https://api.openai.com/v1 (default)',
                model: config.model || DEFAULT_MODELS.openai
            })

            // Create OpenAI client with optional custom base URL
            const openai = new OpenAI({
                apiKey: config.apiKey,
                ...(config.baseUrl && { baseURL: config.baseUrl })
            })

            console.log('📤 Sending request to OpenAI API...')
            console.log('📝 Messages:', JSON.stringify(messages, null, 2))

            const response = await openai.chat.completions.create({
                model: config.model || DEFAULT_MODELS.openai,
                messages: messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                }))
            })

            console.log('✅ Received response from OpenAI API')
            console.log('📊 Response:', {
                hasContent: !!response.choices[0]?.message?.content,
                contentLength: response.choices[0]?.message?.content?.length || 0,
                usage: response.usage
            })

            return {
                content: response.choices[0]?.message?.content || '',
                provider: 'openai',
                model: config.model || DEFAULT_MODELS.openai,
                usage: {
                    promptTokens: response.usage?.prompt_tokens,
                    completionTokens: response.usage?.completion_tokens,
                    totalTokens: response.usage?.total_tokens
                }
            }
        } catch (error) {
            console.error('❌ OpenAI Provider Error:', error)
            if (error instanceof Error) {
                console.error('❌ Error Message:', error.message)
                console.error('❌ Error Stack:', error.stack)
            }
            // Log more details if it's an API error
            if (error && typeof error === 'object' && 'response' in error) {
                const apiError = error as any
                console.error('❌ API Error Response:', {
                    status: apiError.response?.status,
                    statusText: apiError.response?.statusText,
                    data: apiError.response?.data
                })
            }
            throw error
        }
    },

    isConfigured(config: AIProviderConfig): boolean {
        // For local APIs, we don't require sk- prefix
        const isConfigured = !!config.apiKey
        console.log('🔍 OpenAI Provider isConfigured:', {
            hasApiKey: !!config.apiKey,
            apiKey: config.apiKey?.substring(0, 10) + '...',
            baseUrl: config.baseUrl,
            isConfigured
        })
        return isConfigured
    }
}
