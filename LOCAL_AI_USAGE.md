# Using Local AI with /api/generate

This guide shows how to use the `/api/generate` endpoint with your local AI API.

## Configuration

### 1. Set up your local AI endpoint

Add to your `.env` file:

```bash
# Use OpenAI provider
AI_PROVIDER=openai

# Your local API endpoint
OPENAI_BASE_URL=http://localhost:8080/v1

# API key (use any value for local APIs that don't require auth)
OPENAI_API_KEY=local-key

# Model name (depends on your local setup)
OPENAI_MODEL=gpt-3.5-turbo
```

### 2. Common Local AI Setups

#### LocalAI
```bash
OPENAI_BASE_URL=http://localhost:8080/v1
OPENAI_API_KEY=not-needed
OPENAI_MODEL=gpt-3.5-turbo
```

#### LM Studio
```bash
OPENAI_BASE_URL=http://localhost:1234/v1
OPENAI_API_KEY=lm-studio
OPENAI_MODEL=local-model
```

#### Ollama (with LiteLLM proxy)
```bash
OPENAI_BASE_URL=http://localhost:4000
OPENAI_API_KEY=anything
OPENAI_MODEL=llama3
```

## API Usage

### Generate Vocabulary with AI

The endpoint will now use your local AI to generate word definitions, examples, and synonyms.

**Request:**
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
        "(noun) The occurrence of events by chance in a happy way",
        "(noun) A fortunate coincidence"
      ],
      "example": "Finding that book was pure serendipity.",
      "synonyms": ["fortune", "luck", "chance"]
    }
  ]
}
```

### Generate Flashcard Deck with AI

**Request:**
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "action": "flashcards",
    "topic": "business",
    "useAI": true
  }'
```

**Response:**
```json
{
  "success": true,
  "deck": {
    "id": 1,
    "name": "Business",
    "cardCount": 8
  }
}
```

### Use Dictionary API (Fallback)

If you want to use the dictionary API instead of AI:

**Request:**
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "action": "vocabulary",
    "words": ["example"],
    "useAI": false
  }'
```

## Features

### ✅ AI-Powered Generation
- Uses your local AI to generate definitions
- Creates natural examples
- Suggests relevant synonyms
- Provides IPA pronunciation

### ✅ Automatic Fallback
- If AI fails, automatically falls back to dictionary API
- If AI response is invalid, uses dictionary data
- Robust error handling

### ✅ Database Storage
- Saves all vocabulary to database
- Creates flashcard decks
- Supports upsert (update or insert)

## How It Works

### 1. AI Generation Flow

```
User Request
    ↓
/api/generate endpoint
    ↓
createAIClientFromEnv()
    ↓
Loads OPENAI_BASE_URL from .env
    ↓
Creates OpenAI client with custom baseURL
    ↓
Sends prompt to local AI
    ↓
Parses JSON response
    ↓
Saves to database
    ↓
Returns results
```

### 2. Fallback Mechanism

```
AI Request
    ↓
AI Fails? → Use Dictionary API
    ↓
Parse Error? → Use Dictionary API
    ↓
Invalid Response? → Use Dictionary API
```

## AI Prompt Format

The system sends this prompt to your local AI:

```
Provide information about the English word "serendipity" in the following JSON format:
{
  "word": "serendipity",
  "phonetic": "IPA pronunciation",
  "definitions": ["definition 1 with part of speech", "definition 2 with part of speech"],
  "example": "an example sentence using the word",
  "synonyms": ["synonym1", "synonym2", "synonym3"]
}

Return ONLY valid JSON, no additional text.
```

### Expected AI Response

```json
{
  "word": "serendipity",
  "phonetic": "/ˌsɛrənˈdɪpɪti/",
  "definitions": [
    "(noun) The occurrence of events by chance in a happy way",
    "(noun) A fortunate coincidence"
  ],
  "example": "Finding that book was pure serendipity.",
  "synonyms": ["fortune", "luck", "chance", "coincidence", "accident"]
}
```

## Testing Your Setup

### 1. Test Configuration
```bash
curl http://localhost:3000/api/ai-test
```

Should return your AI configuration status.

### 2. Test Single Word
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "action": "vocabulary",
    "words": ["hello"],
    "useAI": true
  }'
```

### 3. Test Multiple Words
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "action": "vocabulary",
    "words": ["apple", "banana", "cherry"],
    "useAI": true
  }'
```

### 4. Test Flashcard Generation
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "action": "flashcards",
    "topic": "technology",
    "useAI": true
  }'
```

## Troubleshooting

### Issue: "Provider openai is not configured"

**Solution:** Check your `.env` file:
```bash
OPENAI_API_KEY=local-key  # Must be set
OPENAI_BASE_URL=http://localhost:8080/v1
```

### Issue: Connection refused

**Solution:** 
1. Verify your local AI is running
2. Check the port number matches your setup
3. Test with: `curl http://localhost:8080/v1/models`

### Issue: Invalid JSON response

**Solution:**
- The system will automatically fall back to dictionary API
- Check your AI model's response format
- Ensure your model can follow JSON instructions

### Issue: Slow responses

**Solution:**
- Increase rate limit in code (currently 500ms)
- Use a faster local model
- Reduce batch size

## Advanced Configuration

### Rate Limiting

Modify the rate limit in `app/api/generate/route.ts`:

```typescript
// Rate limit
await new Promise(r => setTimeout(r, 500)) // Change 500 to your desired ms
```

### Custom Prompts

Customize the AI prompt in `fetchAndSaveVocabularyWithAI`:

```typescript
const prompt = `Your custom prompt here for word: ${word}`
```

### Batch Processing

Process multiple words in parallel (requires editing code):

```typescript
const results = await Promise.all(
  words.map(word => processWord(word))
)
```

## Performance Tips

1. **Use a fast local model** - Smaller models respond faster
2. **Batch requests** - Process multiple words at once
3. **Cache results** - The database stores all words for reuse
4. **Adjust timeout** - Increase for slower models
5. **Use GPU acceleration** - Significantly faster inference

## Security Notes

- Local AI runs on your machine - no data sent externally
- API keys are stored in `.env` (never commit)
- Database stores all generated content locally
- No external API calls when using local AI

## Next Steps

1. Set up your local AI server
2. Configure `.env` with your endpoint
3. Test with `/api/ai-test`
4. Generate vocabulary with `/api/generate`
5. Build flashcard decks for learning

For more information, see:
- `AI_CONFIG.md` - Complete AI configuration guide
- `ARCHITECTURE.md` - System architecture
- `.env.example` - Configuration template
