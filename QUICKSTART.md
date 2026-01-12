# Quick Start: Using Local AI with /api/generate

## ✅ What's Been Fixed

Your `/api/generate` endpoint now supports:
- ✅ Local AI (OpenAI-compatible) for vocabulary generation
- ✅ Custom base URL configuration via environment variables
- ✅ Automatic fallback to Dictionary API if AI fails
- ✅ Robust error handling
- ✅ Both AI and non-AI modes

## 🚀 Setup (3 Steps)

### Step 1: Configure Your Local AI

Edit `.env` file:

```bash
# Set AI provider to OpenAI
AI_PROVIDER=openai

# Your local AI endpoint URL
OPENAI_BASE_URL=http://localhost:8080/v1

# API key (use any value for local)
OPENAI_API_KEY=local-key

# Model name
OPENAI_MODEL=gpt-3.5-turbo
```

**Common Local AI setups:**

| AI Service | Port | Base URL |
|------------|------|----------|
| LocalAI | 8080 | http://localhost:8080/v1 |
| LM Studio | 1234 | http://localhost:1234/v1 |
| Ollama + LiteLLM | 4000 | http://localhost:4000 |
| text-generation-webui | 5000 | http://localhost:5000/v1 |

### Step 2: Start Your Server

```bash
pnpm dev
```

### Step 3: Test It

```bash
# Quick test
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"action": "vocabulary", "words": ["hello"], "useAI": true}'

# Or use the test script
./test-generate.sh
```

## 📝 API Usage

### Generate Vocabulary with AI

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "action": "vocabulary",
    "words": ["serendipity", "ephemeral", "ubiquitous"],
    "useAI": true
  }'
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "words": [
    {
      "word": "serendipity",
      "phonetic": "/ˌsɛrənˈdɪpɪti/",
      "definitions": [
        "(noun) The occurrence of events by chance in a happy way"
      ],
      "example": "Finding that book was pure serendipity.",
      "synonyms": ["fortune", "luck", "chance"]
    }
  ]
}
```

### Generate Flashcard Deck with AI

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "action": "flashcards",
    "topic": "business",
    "useAI": true
  }'
```

### Use Dictionary API (No AI)

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "action": "vocabulary",
    "words": ["example"],
    "useAI": false
  }'
```

## 🔧 Configuration Examples

### Example 1: LocalAI

```bash
# .env
OPENAI_BASE_URL=http://localhost:8080/v1
OPENAI_API_KEY=not-needed
OPENAI_MODEL=gpt-3.5-turbo
```

### Example 2: LM Studio

```bash
# .env
OPENAI_BASE_URL=http://localhost:1234/v1
OPENAI_API_KEY=lm-studio
OPENAI_MODEL=local-model
```

### Example 3: Standard OpenAI (Cloud)

```bash
# .env
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_API_KEY=sk-your-real-key-here
OPENAI_MODEL=gpt-4o-mini
```

## 🧪 Testing

### 1. Check Configuration

```bash
curl http://localhost:3000/api/ai-test
```

Should return:
```json
{
  "success": true,
  "config": {
    "defaultProvider": "openai",
    "availableProviders": ["openai"],
    "openai": {
      "configured": true,
      "hasCustomUrl": true,
      "customUrl": "http://localhost:8080",
      "model": "gpt-3.5-turbo"
    }
  }
}
```

### 2. Test Single Word

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"action": "vocabulary", "words": ["hello"], "useAI": true}'
```

### 3. Run Full Test Suite

```bash
./test-generate.sh
```

## 🎯 Features

### ✅ Dual Mode Operation
- **AI Mode**: Uses local AI for generation (`useAI: true`)
- **Dictionary Mode**: Uses free dictionary API (`useAI: false`)

### ✅ Automatic Fallback
- If AI fails → Uses dictionary API
- If JSON parsing fails → Uses dictionary API
- If endpoint unreachable → Uses dictionary API

### ✅ Smart Generation
The AI generates:
- IPA pronunciation
- Multiple definitions with part of speech
- Natural example sentences
- Relevant synonyms

### ✅ Database Integration
- Saves all words to database
- Creates flashcard decks
- Updates existing entries (upsert)

## 📊 Flow Diagram

```
User Request (useAI: true)
         ↓
   /api/generate
         ↓
  createAIClientFromEnv()
         ↓
Reads OPENAI_BASE_URL from .env
         ↓
Creates OpenAI client
         ↓
Sends prompt to Local AI
         ↓
    AI Success? 
    ├─ Yes → Parse JSON → Save to DB → Return
    └─ No  → Dictionary API → Save to DB → Return
```

## 🐛 Troubleshooting

### Problem: "Provider openai is not configured"

**Solution:**
```bash
# Check your .env file has:
OPENAI_API_KEY=local-key
OPENAI_BASE_URL=http://localhost:8080/v1
```

### Problem: Connection refused

**Solution:**
1. Make sure your local AI is running
2. Check the correct port
3. Test: `curl http://localhost:8080/v1/models`

### Problem: Invalid JSON from AI

**Solution:**
- The system automatically falls back to dictionary API
- Check your AI model can follow JSON instructions
- Try a different model or provider

### Problem: Slow responses

**Solution:**
```bash
# In app/api/generate/route.ts, line 221:
# Change timeout: await new Promise(r => setTimeout(r, 500))
# To: await new Promise(r => setTimeout(r, 100))
```

## 📁 Files Changed

- ✅ `lib/ai/types.ts` - Added baseUrl support
- ✅ `lib/ai/providers/openai.ts` - Custom URL support
- ✅ `lib/ai/index.ts` - Env variable loading
- ✅ `app/api/generate/route.ts` - AI integration
- ✅ `app/api/ai-test/route.ts` - Test endpoint
- ✅ `.env.example` - Configuration template
- ✅ `test-generate.sh` - Test script

## 🎓 Example Usage in Code

```typescript
// In your frontend or API
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'vocabulary',
    words: ['apple', 'banana', 'cherry'],
    useAI: true // Use local AI
  })
})

const data = await response.json()
console.log(data.words) // Array of word objects
```

## 🔒 Security

- ✅ Local AI = No data sent externally
- ✅ API keys in `.env` (never committed)
- ✅ All data stored locally in SQLite
- ✅ No external API calls when using local AI

## 📚 Next Steps

1. ✅ Start your local AI server
2. ✅ Configure `.env` file
3. ✅ Run `pnpm dev`
4. ✅ Test with `./test-generate.sh`
5. ✅ Use in your app!

## 📖 Documentation

- `LOCAL_AI_USAGE.md` - Detailed usage guide
- `AI_CONFIG.md` - Full configuration reference
- `ARCHITECTURE.md` - System architecture
- `.env.example` - Configuration examples

## 🆘 Need Help?

Check these files:
1. `LOCAL_AI_USAGE.md` - Complete usage guide
2. `AI_CONFIG.md` - Advanced configuration
3. `test-generate.sh` - Working examples

**The system is ready to use!** 🎉
