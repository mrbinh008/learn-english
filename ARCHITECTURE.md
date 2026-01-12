# AI Configuration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Application                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   API Routes                          │   │
│  │         (app/api/generate/route.ts, etc.)            │   │
│  └────────────────────────┬─────────────────────────────┘   │
│                           │                                   │
│                           ▼                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              AI Client (lib/ai/index.ts)             │   │
│  │                                                       │   │
│  │  createAIClientFromEnv()                             │   │
│  │    ├─ Reads environment variables                    │   │
│  │    ├─ OPENAI_API_KEY                                 │   │
│  │    ├─ OPENAI_BASE_URL (optional)                     │   │
│  │    └─ OPENAI_MODEL (optional)                        │   │
│  └────────────────────────┬─────────────────────────────┘   │
│                           │                                   │
│                           ▼                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Provider Registry (lib/ai/index.ts)          │   │
│  │                                                       │   │
│  │  Providers:                                          │   │
│  │    ├─ gemini                                         │   │
│  │    ├─ openai ◄── Custom Path Support                │   │
│  │    ├─ claude                                         │   │
│  │    ├─ groq                                           │   │
│  │    └─ cloudflare                                     │   │
│  └────────────────────────┬─────────────────────────────┘   │
│                           │                                   │
│                           ▼                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      OpenAI Provider (lib/ai/providers/openai.ts)    │   │
│  │                                                       │   │
│  │  new OpenAI({                                        │   │
│  │    apiKey: config.apiKey,                            │   │
│  │    baseURL: config.baseUrl // ◄── Custom Path       │   │
│  │  })                                                   │   │
│  └────────────────────────┬─────────────────────────────┘   │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────────┐
        │         External API Endpoint           │
        │                                          │
        │  • Standard OpenAI API                  │
        │    api.openai.com/v1                    │
        │                                          │
        │  • Azure OpenAI                         │
        │    your-resource.openai.azure.com       │
        │                                          │
        │  • LocalAI                              │
        │    localhost:8080/v1                    │
        │                                          │
        │  • LiteLLM Proxy                        │
        │    localhost:4000                        │
        │                                          │
        │  • Any OpenAI-compatible API            │
        │    your-custom-endpoint.com/v1          │
        └────────────────────────────────────────┘
```

## Configuration Flow

### 1. Environment Variables (.env)
```
OPENAI_API_KEY=sk-your-key
OPENAI_BASE_URL=https://custom-endpoint.com/v1  ◄── Custom Path
OPENAI_MODEL=gpt-4-turbo
```

### 2. Client Creation
```typescript
createAIClientFromEnv()
  ↓
Reads .env variables
  ↓
Creates AIClient with config
```

### 3. Request Processing
```typescript
client.prompt("Hello")
  ↓
Selects provider (openai)
  ↓
Gets provider config
  ↓
openaiProvider.chat()
  ↓
new OpenAI({ baseURL: customUrl })
  ↓
Makes HTTP request to custom endpoint
```

## Key Features

### 🔧 Flexible Configuration
- Environment variables
- Programmatic configuration
- Runtime provider switching

### 🔌 Multiple Endpoint Support
- Standard OpenAI
- Azure OpenAI
- Self-hosted solutions (LocalAI)
- Proxy services (LiteLLM)
- Custom implementations

### 🔒 Secure by Default
- API keys in environment variables
- No hardcoded credentials
- Supports different keys per environment

### 🎯 Easy Integration
```typescript
// Simple
const client = createAIClientFromEnv()
const response = await client.prompt("Hello")

// Advanced
const client = new AIClient({
  provider: 'openai',
  openai: {
    apiKey: 'key',
    baseUrl: 'custom-url',
    model: 'custom-model'
  }
})
```

## Provider Interface

All providers implement the same interface:

```typescript
interface AIProviderInterface {
  name: AIProvider
  chat(messages: AIMessage[], config: AIProviderConfig): Promise<AIResponse>
  isConfigured(config: AIProviderConfig): boolean
}
```

This ensures consistent behavior across all providers, including custom endpoints.

## Configuration Options

### AIProviderConfig
```typescript
{
  apiKey: string        // Required: Your API key
  model?: string        // Optional: Model name
  baseUrl?: string      // Optional: Custom endpoint ◄── NEW
  accountId?: string    // Optional: For Cloudflare
}
```

## Usage Examples

### Standard OpenAI
```typescript
openai: {
  apiKey: 'sk-...',
  // baseUrl not needed, uses default
}
```

### Custom Endpoint
```typescript
openai: {
  apiKey: 'your-key',
  baseUrl: 'https://custom.com/v1',  // ◄── Custom
  model: 'custom-model'
}
```

### Azure OpenAI
```typescript
openai: {
  apiKey: 'azure-key',
  baseUrl: 'https://resource.openai.azure.com/openai/deployments/name',
  model: 'gpt-4'
}
```

## Benefits

✅ **Flexibility**: Use any OpenAI-compatible API
✅ **Security**: Keep credentials in environment variables
✅ **Development**: Test locally with LocalAI
✅ **Cost Control**: Use different endpoints per environment
✅ **Compliance**: Host in specific regions (Azure)
✅ **Performance**: Use faster proxies or edge deployments

## Testing

Test your configuration:

```bash
# Check status
GET /api/ai-test

# Send message
POST /api/ai-test
{
  "message": "Hello!"
}
```

Response includes:
- AI response content
- Provider used
- Model used
- Token usage
- Available providers
