import { NextRequest, NextResponse } from 'next/server'
import { createAIClientFromEnv } from '@/lib/ai'

/**
 * Test API Route for AI with Custom Path
 * 
 * This endpoint demonstrates using OpenAI with custom base URLs.
 * 
 * POST /api/ai-test
 * Body: { message: string, provider?: string }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { message, provider } = body

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            )
        }

        // Create AI client from environment variables
        // This will automatically use OPENAI_BASE_URL if set
        const aiClient = createAIClientFromEnv()

        // Get available providers
        const availableProviders = aiClient.getAvailableProviders()

        // Send message and get response
        const response = await aiClient.chat(
            [
                {
                    role: 'system',
                    content: 'You are a helpful English learning assistant. Provide clear and concise responses.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            provider as any // Optional provider override
        )

        return NextResponse.json({
            success: true,
            response: response.content,
            metadata: {
                provider: response.provider,
                model: response.model,
                usage: response.usage,
                availableProviders
            }
        })
    } catch (error) {
        console.error('AI Test Error:', error)

        const errorMessage = error instanceof Error ? error.message : 'Unknown error'

        // Provide helpful error messages
        let userMessage = 'Failed to process AI request'
        if (errorMessage.includes('not configured')) {
            userMessage = 'AI provider is not configured. Please check your environment variables.'
        } else if (errorMessage.includes('404')) {
            userMessage = 'API endpoint not found. Check your OPENAI_BASE_URL configuration.'
        } else if (errorMessage.includes('401')) {
            userMessage = 'Authentication failed. Check your API key.'
        }

        return NextResponse.json(
            {
                error: userMessage,
                details: errorMessage
            },
            { status: 500 }
        )
    }
}

/**
 * GET endpoint to check AI configuration status
 */
export async function GET() {
    try {
        const aiClient = createAIClientFromEnv()
        const availableProviders = aiClient.getAvailableProviders()

        // Get configuration info (without exposing sensitive data)
        const config = {
            defaultProvider: process.env.AI_PROVIDER || 'gemini',
            availableProviders,
            openai: {
                configured: availableProviders.includes('openai'),
                hasCustomUrl: !!process.env.OPENAI_BASE_URL,
                customUrl: process.env.OPENAI_BASE_URL
                    ? process.env.OPENAI_BASE_URL.replace(/\/v1$/, '') // Hide full URL for security
                    : undefined,
                model: process.env.OPENAI_MODEL || 'gpt-4o-mini (default)'
            }
        }

        return NextResponse.json({
            success: true,
            config
        })
    } catch (error) {
        console.error('Config check error:', error)
        return NextResponse.json(
            { error: 'Failed to check configuration' },
            { status: 500 }
        )
    }
}
