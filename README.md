# Learn English - AI-Powered English Learning Platform

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7.2.0-2D3748?style=flat-square&logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-3.x-003B57?style=flat-square&logo=sqlite)

A comprehensive, AI-powered English learning platform built with Next.js, featuring interactive reading passages, intelligent flashcards, vocabulary management, and grammar exercises - all designed specifically for Vietnamese learners.

## 🌟 Features

### 📚 **AI-Generated Reading Passages**
- Generate custom reading passages on any topic with AI
- Automatic vocabulary highlighting with hover tooltips
- Integrated Vietnamese translations
- Interactive comprehension quizzes with detailed explanations
- Text-to-Speech (TTS) for pronunciation practice
- Click-to-define dictionary sidebar

### 🧠 **Smart Flashcards**
- **AI-Powered Deck Generation**: Create flashcard decks on any topic with 15 AI-generated vocabulary words
- **Spaced Repetition Algorithm**: Optimize learning with intelligent review scheduling
- **Interactive Study Mode**: Flip cards, mark as known/unknown
- **Progress Tracking**: Monitor learning statistics and performance
- **Keyboard Shortcuts**: Navigate efficiently (Space, Arrow keys, 1/2)
- **Predefined Topics**: Quick-start with Business, Technology, Travel, Daily, Food topics

### 📖 **Dictionary & Vocabulary**
- **Smart Word Lookup**: Select any word to get instant definitions
- **Auto-Save to Database**: Build your personal vocabulary automatically
- **AI-Enhanced Definitions**: Get Vietnamese meanings, phonetics, examples, synonyms, and antonyms
- **Pronunciation Audio**: Listen to correct pronunciation
- **Vocabulary Management**: Browse, search, and organize your saved words

### ✍️ **Grammar Exercises**
- Curated grammar lessons and exercises
- Interactive practice with instant feedback
- Progress tracking across different grammar topics

### 🎯 **Smart Content Creation**
- AI generates contextually relevant content
- Customizable difficulty levels (Beginner, Intermediate, Advanced)
- Topic-based content organization
- Multi-format support (reading, flashcards, vocabulary)

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.1 (App Router)
- **UI Library**: React 19.2.3
- **Language**: TypeScript 5.x
- **Styling**: Custom CSS + Tailwind CSS 4
- **Icons**: Lucide React
- **State Management**: Zustand 5.0.9

### Backend
- **Database**: SQLite with Prisma ORM 7.2.0
- **Database Adapter**: Better-SQLite3
- **API Routes**: Next.js API Routes

### AI Integration
- **OpenAI**: GPT models for content generation
- **Anthropic Claude**: Alternative AI provider
- **Google Gemini**: Additional AI capabilities
- **Groq**: High-speed AI inference
- **Multi-Provider Support**: Automatic fallback and provider switching

### Other Tools
- **TTS**: Browser Speech Synthesis API
- **Dictionary API**: Free Dictionary API integration

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or pnpm
- Local AI endpoint (optional) or API keys for AI providers

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/learn-english.git
cd learn-english
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# AI Providers (at least one required)
OPENAI_API_KEY=your_openai_key
OPENAI_API_BASE=http://127.0.0.1:8045/v1  # For local AI endpoint

# Optional: Additional AI providers
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_key
GROQ_API_KEY=your_groq_key
```

4. **Initialize the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
learn-english/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── decks/               # Flashcard deck APIs
│   │   ├── dictionary/          # Word lookup API
│   │   ├── generate/            # AI content generation
│   │   ├── reading/             # Reading passage APIs
│   │   ├── translate/           # Translation API
│   │   └── vocabulary/          # Vocabulary management
│   ├── create/                   # Content creation page
│   ├── dictionary/              # Dictionary browser
│   ├── flashcards/              # Flashcard study system
│   ├── grammar/                 # Grammar exercises
│   ├── reading/                 # Reading passages
│   ├── review/                  # Spaced repetition review
│   └── vocabulary/              # Vocabulary management
├── components/                   # Reusable React components
│   ├── Layout.tsx               # Main layout wrapper
│   └── TTSButton.tsx            # Text-to-Speech button
├── lib/                         # Utility libraries
│   ├── ai.ts                    # AI client management
│   └── db.ts                    # Prisma database client
├── prisma/                      # Database schema and migrations
│   └── schema.prisma            # Database models
├── scripts/                     # Utility scripts
│   └── cleanup-duplicate-decks.ts
└── public/                      # Static assets
```

## 🎮 Usage

### Creating AI-Generated Reading Passages

1. Navigate to `/create`
2. Click on "Reading Passage" tab
3. Enter your desired topic (e.g., "Climate Change", "Technology")
4. Select difficulty level (Beginner, Intermediate, Advanced)
5. Choose category
6. Click "Tạo bài đọc" (Generate)
7. AI will create:
   - A contextual reading passage
   - 10-15 important vocabulary words with definitions
   - 6 comprehension questions with explanations

### Generating AI Flashcard Decks

**Method 1: Custom Topic (Recommended)**
1. Go to `/flashcards`
2. Click "Tạo bằng AI" (Create with AI)
3. Enter any topic (e.g., "Environment", "Music", "Sports")
4. AI generates 15 relevant vocabulary words with:
   - Vietnamese translations
   - Phonetic transcriptions
   - Example sentences
   - Definitions

**Method 2: Quick Topics**
1. Go to `/flashcards`
2. Click one of the quick-sync buttons:
   - Hàng ngày (Daily)
   - Kinh doanh (Business)
   - Du lịch (Travel)
   - Công nghệ (Technology)
   - Ẩm thực (Food)

### Studying Flashcards

1. Select a deck from `/flashcards`
2. Click "Học ngay" (Study Now)
3. Use keyboard shortcuts:
   - `Space` - Flip card
   - `←/→` - Navigate cards
   - `1` - Mark as "Don't know"
   - `2` - Mark as "Know"
4. Track your progress and completion rate

### Using the Dictionary

**While Reading:**
1. Select any word in a reading passage
2. Definition appears automatically in the sidebar
3. Word is auto-saved to your vocabulary

**Standalone Dictionary:**
1. Navigate to `/dictionary`
2. Search for any English word
3. Get Vietnamese meaning, phonetics, examples, synonyms

## 🗄️ Database Schema

### Models

**Word**
- Stores vocabulary with Vietnamese meanings
- Includes phonetics, definitions, examples, synonyms, antonyms
- Auto-cached from AI and Dictionary API

**ReadingPassage**
- AI-generated reading content
- Embedded vocabulary list (JSON)
- Comprehension questions (JSON)
- Translations

**Deck**
- Flashcard deck container
- Tracks card count and metadata

**Flashcard**
- Individual vocabulary cards
- Spaced repetition metadata (easeFactor, interval, nextReview)
- Linked to parent Deck

**GrammarTopic**
- Grammar lesson categories
- Exercises and explanations

## 🤖 AI Integration

### Supported AI Providers

1. **OpenAI** (Primary)
   - GPT-3.5/GPT-4 models
   - Local endpoint support (e.g., LM Studio, Ollama)

2. **Anthropic Claude** (Fallback)
   - Claude-3 models
   - High-quality content generation

3. **Google Gemini** (Alternative)
   - Gemini Pro models
   - Multimodal capabilities

4. **Groq** (Fast inference)
   - Llama models
   - Ultra-low latency

### AI Client Features

- **Auto-Fallback**: Automatically switches providers if one fails
- **Prompt Optimization**: Context-aware prompts for Vietnamese learners
- **JSON Parsing**: Robust parsing of AI responses
- **Error Handling**: Graceful degradation to Dictionary API

### Example AI Usage

```typescript
// Generate vocabulary with AI
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'flashcards',
    topic: 'environment',
    useAI: true
  })
})
```

## 📊 Key Features Explained

### Vocabulary Highlighting

When viewing reading passages:
- Important vocabulary words are highlighted with a yellow gradient underline
- Hover over highlighted words to see:
  - Vietnamese translation
  - English definition
  - Example sentence
- Supports multi-word phrases (e.g., "climate change", "wake up")

### Duplicate Prevention

- Flashcard decks are checked before creation
- If a deck with the same name exists, the existing deck is returned
- Prevents database clutter and duplicate content

### Text-to-Speech

- Click speaker icons to hear pronunciation
- Uses browser's Speech Synthesis API
- Supports both US and UK English accents

## 🔧 Maintenance & Scripts

### Database Cleanup

Remove duplicate flashcard decks:
```bash
npx tsx scripts/cleanup-duplicate-decks.ts
```

### Reset Database

```bash
rm dev.db
npx prisma db push
```

### Regenerate Prisma Client

After schema changes:
```bash
npx prisma generate
```

## 🎨 UI/UX Highlights

- **Responsive Design**: Works on desktop and mobile devices
- **Clean Interface**: Minimalist design focused on content
- **Vietnamese UI**: All interface text in Vietnamese for easy navigation
- **Keyboard Navigation**: Efficient shortcuts throughout the app
- **Loading States**: Clear feedback during AI generation
- **Progress Tracking**: Visual progress bars and statistics

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite database path | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes* |
| `OPENAI_API_BASE` | Local AI endpoint URL | No |
| `ANTHROPIC_API_KEY` | Claude API key | No |
| `GOOGLE_API_KEY` | Gemini API key | No |
| `GROQ_API_KEY` | Groq API key | No |

*At least one AI provider API key is required

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
vercel deploy
```

**Note**: Configure environment variables in your hosting platform.

## 📝 API Documentation

### Generate Reading Passage

```http
POST /api/reading/generate
Content-Type: application/json

{
  "topic": "Climate Change",
  "level": "intermediate",
  "category": "environment"
}
```

### Create Flashcard Deck with AI

```http
POST /api/generate
Content-Type: application/json

{
  "action": "flashcards",
  "topic": "music",
  "useAI": true
}
```

### Lookup Word

```http
POST /api/dictionary/lookup
Content-Type: application/json

{
  "word": "environment",
  "saveToDb": true
}
```

### Get All Decks

```http
GET /api/decks
```

### Get Specific Deck

```http
GET /api/decks/{deckId}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Binh Nguyen**

## 🙏 Acknowledgments

- OpenAI for GPT models
- Free Dictionary API for word definitions
- Next.js team for the amazing framework
- Prisma for the excellent ORM
- Vietnamese English learners community for inspiration

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [your-email@example.com]

---

**Built with ❤️ for Vietnamese English learners**
