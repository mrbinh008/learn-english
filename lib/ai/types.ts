// AI Provider Types and Unified Interface

export type AIProvider = 'gemini' | 'openai' | 'claude' | 'groq' | 'cloudflare'

export interface AIMessage {
    role: 'user' | 'assistant' | 'system'
    content: string
}

export interface AIResponse {
    content: string
    provider: AIProvider
    model: string
    usage?: {
        promptTokens?: number
        completionTokens?: number
        totalTokens?: number
    }
}

export interface AIProviderConfig {
    apiKey: string
    model?: string
    baseUrl?: string // Custom API base URL (e.g., for proxies, custom endpoints)
    accountId?: string // For Cloudflare
}

export interface AIProviderInterface {
    name: AIProvider
    chat(messages: AIMessage[], config: AIProviderConfig): Promise<AIResponse>
    isConfigured(config: AIProviderConfig): boolean
}

// Default models for each provider
export const DEFAULT_MODELS: Record<AIProvider, string> = {
    gemini: 'gemini-2.0-flash',
    openai: 'gpt-4o-mini',
    claude: 'claude-3-5-sonnet-20241022',
    groq: 'llama-3.3-70b-versatile',
    cloudflare: '@cf/meta/llama-3.1-8b-instruct'
}

// Provider display names (Vietnamese)
export const PROVIDER_NAMES: Record<AIProvider, { name: string; description: string }> = {
    gemini: {
        name: 'Google Gemini',
        description: 'Miễn phí, đa năng, hỗ trợ tiếng Việt tốt'
    },
    openai: {
        name: 'OpenAI (ChatGPT)',
        description: 'Mạnh nhất, trả phí'
    },
    claude: {
        name: 'Anthropic Claude',
        description: 'An toàn, văn bản dài'
    },
    groq: {
        name: 'Groq',
        description: 'Cực nhanh, miễn phí, Llama/Mixtral'
    },
    cloudflare: {
        name: 'Cloudflare Workers AI',
        description: 'Miễn phí 10k req/ngày'
    }
}
