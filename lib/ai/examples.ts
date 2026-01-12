/**
 * Example: Using OpenAI with Custom Base URL
 * 
 * This example demonstrates how to use the AI client with custom endpoints
 * such as Azure OpenAI, LocalAI, LiteLLM, or any OpenAI-compatible API.
 */

import { AIClient } from '@/lib/ai'

// Example 1: Using Azure OpenAI
async function exampleAzureOpenAI() {
    const client = new AIClient({
        provider: 'openai',
        openai: {
            apiKey: process.env.AZURE_OPENAI_KEY || '',
            baseUrl: 'https://your-resource.openai.azure.com/openai/deployments/your-deployment',
            model: 'gpt-4'
        }
    })

    const response = await client.prompt(
        'Translate this to Vietnamese: Hello, how are you?'
    )
    console.log('Azure OpenAI Response:', response)
}

// Example 2: Using LocalAI (running locally)
async function exampleLocalAI() {
    const client = new AIClient({
        provider: 'openai',
        openai: {
            apiKey: 'not-needed', // LocalAI doesn't require API key
            baseUrl: 'http://localhost:8080/v1',
            model: 'gpt-3.5-turbo'
        }
    })

    const response = await client.prompt(
        'What is the capital of Vietnam?'
    )
    console.log('LocalAI Response:', response)
}

// Example 3: Using LiteLLM Proxy
async function exampleLiteLLM() {
    const client = new AIClient({
        provider: 'openai',
        openai: {
            apiKey: process.env.LITELLM_KEY || '',
            baseUrl: 'http://localhost:4000',
            model: 'gpt-4'
        }
    })

    const messages = [
        { role: 'system' as const, content: 'You are a helpful English teacher.' },
        { role: 'user' as const, content: 'Explain the difference between "affect" and "effect".' }
    ]

    const response = await client.chat(messages)
    console.log('LiteLLM Response:', response.content)
}

// Example 4: Using Standard OpenAI (from environment)
async function exampleFromEnvironment() {
    // This will use environment variables:
    // - OPENAI_API_KEY
    // - OPENAI_BASE_URL (optional)
    // - OPENAI_MODEL (optional)
    const { createAIClientFromEnv } = await import('@/lib/ai')
    const client = createAIClientFromEnv()

    const response = await client.prompt(
        'Generate a simple English sentence about learning.',
        'You are an English learning assistant.'
    )
    console.log('Environment-based Response:', response)
}

// Example 5: Switching between multiple endpoints
async function exampleMultipleEndpoints() {
    // Production OpenAI
    const productionClient = new AIClient({
        provider: 'openai',
        openai: {
            apiKey: process.env.OPENAI_API_KEY || '',
            model: 'gpt-4o-mini'
        }
    })

    // Development LocalAI
    const devClient = new AIClient({
        provider: 'openai',
        openai: {
            apiKey: 'dev',
            baseUrl: 'http://localhost:8080/v1',
            model: 'local-model'
        }
    })

    // Use different clients based on environment
    const isDevelopment = process.env.NODE_ENV === 'development'
    const client = isDevelopment ? devClient : productionClient

    const response = await client.prompt('Test message')
    console.log('Response:', response)
}

// Example 6: Advanced chat with context
async function exampleAdvancedChat() {
    const client = new AIClient({
        provider: 'openai',
        openai: {
            apiKey: process.env.OPENAI_API_KEY || '',
            baseUrl: process.env.OPENAI_BASE_URL, // Optional custom URL
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
        }
    })

    const messages = [
        {
            role: 'system' as const,
            content: 'You are an English vocabulary expert. Provide clear, concise definitions.'
        },
        {
            role: 'user' as const,
            content: 'Define the word "serendipity"'
        },
        {
            role: 'assistant' as const,
            content: 'Serendipity means finding something good or useful by chance, when you are not specifically looking for it.'
        },
        {
            role: 'user' as const,
            content: 'Can you give me a sentence using it?'
        }
    ]

    const response = await client.chat(messages)
    console.log('Advanced Chat Response:', response.content)
}

// Example 7: Error handling
async function exampleWithErrorHandling() {
    try {
        const client = new AIClient({
            provider: 'openai',
            openai: {
                apiKey: process.env.OPENAI_API_KEY || '',
                baseUrl: process.env.OPENAI_BASE_URL,
                model: process.env.OPENAI_MODEL
            }
        })

        const response = await client.prompt('Test prompt')
        console.log('Success:', response)

    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('not configured')) {
                console.error('Configuration Error: Please set OPENAI_API_KEY in your .env file')
            } else if (error.message.includes('404')) {
                console.error('Endpoint Error: Check your OPENAI_BASE_URL')
            } else if (error.message.includes('401')) {
                console.error('Authentication Error: Invalid API key')
            } else {
                console.error('AI Error:', error.message)
            }
        }
    }
}

// Example 8: Checking available providers
async function exampleCheckAvailability() {
    const { createAIClientFromEnv } = await import('@/lib/ai')
    const client = createAIClientFromEnv()

    const available = client.getAvailableProviders()
    console.log('Available providers:', available)

    if (available.includes('openai')) {
        console.log('OpenAI is configured and ready to use')
    } else {
        console.log('OpenAI is not configured. Set OPENAI_API_KEY in .env')
    }
}

// Run examples
export async function runExamples() {
    console.log('=== AI Custom Path Examples ===\n')

    // Uncomment the examples you want to test
    // await exampleFromEnvironment()
    // await exampleAdvancedChat()
    // await exampleWithErrorHandling()
    // await exampleCheckAvailability()

    // For Azure/LocalAI/LiteLLM examples, configure the respective services first
    // await exampleAzureOpenAI()
    // await exampleLocalAI()
    // await exampleLiteLLM()
}

// Export for use in API routes
export {
    exampleFromEnvironment,
    exampleAzureOpenAI,
    exampleLocalAI,
    exampleLiteLLM,
    exampleMultipleEndpoints,
    exampleAdvancedChat,
    exampleWithErrorHandling,
    exampleCheckAvailability
}
