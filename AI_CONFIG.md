# AI Configuration Guide

This guide explains how to configure AI connections with custom paths using OpenAI provider.

## Overview

The AI system supports multiple providers including OpenAI with customizable base URLs. This allows you to:
- Use OpenAI-compatible APIs (LocalAI, LiteLLM, etc.)
- Connect to Azure OpenAI services
- Use proxy endpoints
- Point to custom OpenAI-compatible servers

## Configuration

### Environment Variables

Set these variables in your `.env` file:

```bash
# Required: OpenAI API Key
OPENAI_API_KEY=sk-your-api-key-here

# Optional: Custom Base URL (defaults to https://api.openai.com/v1)
OPENAI_BASE_URL=https://your-custom-endpoint.com/v1

# Optional: Custom Model (defaults to gpt-4o-mini)
OPENAI_MODEL=gpt-4-turbo
```

### Examples

#### 1. Standard OpenAI (Default)
```bash
OPENAI_API_KEY=sk-abc123...
# No OPENAI_BASE_URL needed - uses default
```

#### 2. Azure OpenAI
```bash
OPENAI_API_KEY=your-azure-key
OPENAI_BASE_URL=https://your-resource.openai.azure.com/openai/deployments/your-deployment
OPENAI_MODEL=gpt-4
```

#### 3. LocalAI
```bash
OPENAI_API_KEY=not-needed
OPENAI_BASE_URL=http://localhost:8080/v1
OPENAI_MODEL=gpt-3.5-turbo
```

#### 4. LiteLLM Proxy
```bash
OPENAI_API_KEY=sk-your-litellm-key
OPENAI_BASE_URL=http://localhost:4000
OPENAI_MODEL=gpt-4
```

#### 5. Custom OpenAI-Compatible API
```bash
OPENAI_API_KEY=your-api-key
OPENAI_BASE_URL=https://api.your-service.com/v1
OPENAI_MODEL=your-model-name
```

## Programmatic Configuration

You can also configure the AI client programmatically:

```typescript
import { AIClient } from '@/lib/ai'

// Create client with custom OpenAI config
const client = new AIClient({
  provider: 'openai',
  openai: {
    apiKey: 'your-api-key',
    baseUrl: 'https://your-custom-endpoint.com/v1',
    model: 'gpt-4-turbo'
  }
})

// Use the client
const response = await client.prompt('Hello, how are you?')
console.log(response)
```

## Usage in API Routes

### Example: Using in Next.js API Route

```typescript
import { createAIClientFromEnv } from '@/lib/ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    // Create AI client from environment variables
    const aiClient = createAIClientFromEnv()
    
    // Send message and get response
    const response = await aiClient.prompt(message)
    
    return NextResponse.json({ 
      success: true, 
      response 
    })
  } catch (error) {
    console.error('AI Error:', error)
    return NextResponse.json(
      { error: 'Failed to process AI request' }, 
      { status: 500 }
    )
  }
}
```

## Switching Providers

To switch between different AI providers, update the `AI_PROVIDER` environment variable:

```bash
# Use OpenAI
AI_PROVIDER=openai

# Use Google Gemini (default)
AI_PROVIDER=gemini

# Use Claude
AI_PROVIDER=claude

# Use Groq
AI_PROVIDER=groq

# Use Cloudflare Workers AI
AI_PROVIDER=cloudflare
```

## Testing Your Configuration

You can test your AI configuration by:

1. Setting up your `.env` file with the desired configuration
2. Starting your development server: `pnpm dev`
3. Making a test API call to `/api/generate` or any endpoint that uses the AI client

## Troubleshooting

### Common Issues

1. **"Provider openai is not configured"**
   - Ensure `OPENAI_API_KEY` is set in your `.env` file
   - For OpenAI, the key must start with `sk-`

2. **Connection Errors**
   - Verify your `OPENAI_BASE_URL` is correct and accessible
   - Check if your custom endpoint requires additional headers or authentication

3. **Model Not Found**
   - Ensure the model specified in `OPENAI_MODEL` is available on your endpoint
   - Different providers support different model names

4. **CORS Issues**
   - If using a local endpoint, ensure it allows CORS from your Next.js app
   - Check your custom endpoint's CORS configuration

## Security Notes

- Never commit your `.env` file to version control
- Use `.env.local` for local development secrets
- In production, use proper secret management (Vercel Environment Variables, AWS Secrets Manager, etc.)
- Rotate API keys regularly
- Use environment-specific keys for development, staging, and production

## Advanced Configuration

### Multiple OpenAI Endpoints

You can create multiple AI clients with different configurations:

```typescript
const openaiClient = new AIClient({
  provider: 'openai',
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
    baseUrl: 'https://api.openai.com/v1'
  }
})

const azureClient = new AIClient({
  provider: 'openai',
  openai: {
    apiKey: process.env.AZURE_OPENAI_KEY!,
    baseUrl: process.env.AZURE_OPENAI_ENDPOINT!,
    model: 'gpt-4'
  }
})

// Use different clients for different purposes
const standardResponse = await openaiClient.prompt('General query')
const azureResponse = await azureClient.prompt('Enterprise query')
```

### Runtime Provider Switching

```typescript
const client = createAIClientFromEnv()

// Override provider at runtime
const openaiResponse = await client.chat(messages, 'openai')
const geminiResponse = await client.chat(messages, 'gemini')
```

## Support

For more information, refer to:
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [LiteLLM Documentation](https://docs.litellm.ai/)
- [LocalAI Documentation](https://localai.io/)
