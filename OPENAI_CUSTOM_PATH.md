# OpenAI Custom Path Configuration

This implementation adds support for custom base URLs to the OpenAI provider, allowing you to use:
- Azure OpenAI
- LocalAI
- LiteLLM Proxy
- Any OpenAI-compatible API endpoint

## What Was Changed

### 1. Updated Type Definition (`lib/ai/types.ts`)
- Enhanced `AIProviderConfig` to support `baseUrl` for all providers
- Added comment clarifying it works for proxies and custom endpoints

### 2. Enhanced OpenAI Provider (`lib/ai/providers/openai.ts`)
- Modified to accept optional `baseUrl` parameter
- Passes custom base URL to OpenAI SDK if provided
- Falls back to default OpenAI endpoint if not specified

### 3. Updated Client Factory (`lib/ai/index.ts`)
- Added support for `OPENAI_BASE_URL` environment variable
- Added support for `OPENAI_MODEL` environment variable
- Automatically loads these from `.env` file

### 4. Created Documentation
- `.env.example` - Template with all configuration options
- `AI_CONFIG.md` - Comprehensive guide with examples
- `lib/ai/examples.ts` - Practical code examples
- `app/api/ai-test/route.ts` - Test endpoint for validation

## Quick Start

### 1. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Standard OpenAI
OPENAI_API_KEY=sk-your-key-here

# OR with custom endpoint
OPENAI_API_KEY=your-key-here
OPENAI_BASE_URL=https://your-custom-endpoint.com/v1
OPENAI_MODEL=your-model-name
```

### 2. Use in Your Code

```typescript
import { createAIClientFromEnv } from '@/lib/ai'

// Automatically uses custom URL if configured
const client = createAIClientFromEnv()
const response = await client.prompt('Hello!')
```

### 3. Test Your Configuration

Start your dev server and test the endpoint:

```bash
pnpm dev

# Check configuration
curl http://localhost:3000/api/ai-test

# Test a prompt
curl -X POST http://localhost:3000/api/ai-test \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

## Common Use Cases

### Azure OpenAI
```bash
OPENAI_API_KEY=your-azure-key
OPENAI_BASE_URL=https://your-resource.openai.azure.com/openai/deployments/your-deployment
OPENAI_MODEL=gpt-4
```

### LocalAI
```bash
OPENAI_API_KEY=not-needed
OPENAI_BASE_URL=http://localhost:8080/v1
OPENAI_MODEL=gpt-3.5-turbo
```

### LiteLLM Proxy
```bash
OPENAI_API_KEY=sk-your-litellm-key
OPENAI_BASE_URL=http://localhost:4000
OPENAI_MODEL=gpt-4
```

## Files Created/Modified

- ✅ `lib/ai/types.ts` - Updated interface
- ✅ `lib/ai/providers/openai.ts` - Added baseUrl support
- ✅ `lib/ai/index.ts` - Added env variable loading
- ✅ `.env.example` - Configuration template
- ✅ `AI_CONFIG.md` - Comprehensive documentation
- ✅ `lib/ai/examples.ts` - Code examples
- ✅ `app/api/ai-test/route.ts` - Test endpoint
- ✅ `OPENAI_CUSTOM_PATH.md` - This file

## Testing

The implementation is backward compatible. If you don't set `OPENAI_BASE_URL`, it will use the standard OpenAI endpoint.

Test with the included test endpoint:
```bash
# GET - Check configuration
curl http://localhost:3000/api/ai-test

# POST - Send a message
curl -X POST http://localhost:3000/api/ai-test \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the capital of Vietnam?"}'
```

## Additional Resources

- See `AI_CONFIG.md` for detailed configuration guide
- See `lib/ai/examples.ts` for practical code examples
- Check `.env.example` for all available options

## Support

If you encounter issues:
1. Verify your `.env` file is properly configured
2. Check that your custom endpoint is accessible
3. Ensure your API key is valid
4. Review the error messages in the test endpoint response
