// Unified AI Client - Main Entry Point
import { geminiProvider } from '@/lib/ai/providers/gemini'
import { openaiProvider } from '@/lib/ai/providers/openai'
import { claudeProvider } from '@/lib/ai/providers/claude'
import { groqProvider } from '@/lib/ai/providers/groq'
import { cloudflareProvider } from '@/lib/ai/providers/cloudflare'
import type {
    AIProvider,
    AIMessage,
    AIResponse,
    AIProviderConfig,
    AIProviderInterface
} from '@/lib/ai/types'
import { PROVIDER_NAMES, DEFAULT_MODELS } from '@/lib/ai/types'

// Provider registry
const providers: Record<AIProvider, AIProviderInterface> = {
    gemini: geminiProvider,
    openai: openaiProvider,
    claude: claudeProvider,
    groq: groqProvider,
    cloudflare: cloudflareProvider
}

export interface AIClientConfig {
    provider: AIProvider
    gemini?: AIProviderConfig
    openai?: AIProviderConfig
    claude?: AIProviderConfig
    groq?: AIProviderConfig
    cloudflare?: AIProviderConfig
}

export class AIClient {
    private config: AIClientConfig

    constructor(config: AIClientConfig) {
        this.config = config
    }

    async chat(messages: AIMessage[], providerOverride?: AIProvider): Promise<AIResponse> {
        const provider = providerOverride || this.config.provider
        const providerImpl = providers[provider]
        const providerConfig = this.getProviderConfig(provider)

        console.log('🔧 AIClient.chat() called:', {
            provider,
            hasProviderImpl: !!providerImpl,
            hasProviderConfig: !!providerConfig,
            messageCount: messages.length
        })

        if (!providerConfig) {
            console.error(`❌ Provider ${provider} is not configured`)
            throw new Error(`Provider ${provider} is not configured`)
        }

        if (!providerImpl.isConfigured(providerConfig)) {
            console.error(`❌ Provider ${provider} is not properly configured`)
            console.error('Config details:', {
                hasApiKey: !!providerConfig.apiKey,
                hasBaseUrl: !!providerConfig.baseUrl,
                baseUrl: providerConfig.baseUrl,
                hasModel: !!providerConfig.model,
                model: providerConfig.model
            })
            throw new Error(`Provider ${provider} is not properly configured`)
        }

        console.log('✅ Provider configured, calling chat...')
        return providerImpl.chat(messages, providerConfig)
    }

    private getProviderConfig(provider: AIProvider): AIProviderConfig | undefined {
        return this.config[provider]
    }

    // Helper method for simple prompts
    async prompt(text: string, systemPrompt?: string): Promise<string> {
        const messages: AIMessage[] = []

        if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt })
        }

        messages.push({ role: 'user', content: text })

        const response = await this.chat(messages)
        return response.content
    }

    // Get available (configured) providers
    getAvailableProviders(): AIProvider[] {
        return (Object.keys(providers) as AIProvider[]).filter(p => {
            const config = this.getProviderConfig(p)
            return config && providers[p].isConfigured(config)
        })
    }

    // Update config
    updateConfig(newConfig: Partial<AIClientConfig>) {
        this.config = { ...this.config, ...newConfig }
    }
}

// Export types and utilities
export type {
    AIProvider,
    AIMessage,
    AIResponse,
    AIProviderConfig
} from '@/lib/ai/types'

export { PROVIDER_NAMES, DEFAULT_MODELS } from '@/lib/ai/types'

// Create a default client from environment variables
export function createAIClientFromEnv(): AIClient {
    console.log('🔧 Creating AI client from environment variables...')
    console.log('Environment check:', {
        AI_PROVIDER: process.env.AI_PROVIDER || 'gemini (default)',
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Not set',
        OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || 'Not set (will use default)',
        OPENAI_MODEL: process.env.OPENAI_MODEL || 'Not set (will use default)'
    })

    return new AIClient({
        provider: (process.env.AI_PROVIDER as AIProvider) || 'gemini',
        gemini: {
            apiKey: process.env.GEMINI_API_KEY || ''
        },
        openai: {
            apiKey: process.env.OPENAI_API_KEY || '',
            baseUrl: process.env.OPENAI_BASE_URL, // Support custom base URL from env
            model: process.env.OPENAI_MODEL
        },
        claude: {
            apiKey: process.env.ANTHROPIC_API_KEY || ''
        },
        groq: {
            apiKey: process.env.GROQ_API_KEY || ''
        },
        cloudflare: {
            apiKey: process.env.CLOUDFLARE_API_KEY || '',
            accountId: process.env.CLOUDFLARE_ACCOUNT_ID || ''
        }
    })
}
