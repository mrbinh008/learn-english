import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { createAIClientFromEnv } from '@/lib/ai'

/**
 * POST /api/vocabulary/generate
 * Generate vocabulary words with AI
 * 
 * Body:
 * {
 *   words: string[] - Array of English words to generate
 *   category?: string - Category/topic (default: 'general')
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { words, category = 'general' } = body

        if (!words || !Array.isArray(words) || words.length === 0) {
            return NextResponse.json(
                { error: 'Vui lòng cung cấp danh sách từ vựng' },
                { status: 400 }
            )
        }

        console.log(`📚 Generating ${words.length} vocabulary words with AI...`)

        const aiClient = createAIClientFromEnv()
        const availableProviders = aiClient.getAvailableProviders()

        if (!availableProviders.includes('openai')) {
            return NextResponse.json(
                { error: 'AI provider not available' },
                { status: 503 }
            )
        }

        // Process all words in a single AI request for efficiency
        const prompt = `Bạn là một từ điển Anh-Việt chuyên nghiệp. Hãy cung cấp thông tin chi tiết cho các từ tiếng Anh sau: ${words.join(', ')}

Trả về một JSON array với ĐÚNG format sau cho mỗi từ:
[
  {
    "word": "example",
    "phonetic": "/ɪɡˈzæmpəl/",
    "vietnamese": "ví dụ, mẫu",
    "partOfSpeech": "noun, verb",
    "definitions": [
      "(noun) một vật, tình huống hoặc hành động được đưa ra để minh họa một quy tắc hoặc nguyên tắc chung",
      "(verb) trích dẫn hoặc đưa ra như một ví dụ"
    ],
    "example": "For example, you could use recycled paper to make cards.",
    "synonyms": ["instance", "case", "illustration", "sample"]
  }
]

YÊU CẦU:
- "vietnamese" phải là nghĩa tiếng Việt ngắn gọn (2-4 từ)
- "definitions" là giải thích CHI TIẾT bằng tiếng Việt, có ghi loại từ bằng tiếng Anh trong ngoặc
- Mỗi từ cung cấp 2-3 định nghĩa
- Cung cấp 3-5 từ đồng nghĩa
- Cung cấp 1 câu ví dụ rõ ràng bằng tiếng Anh
- Phonetic phải chính xác theo IPA

Chỉ trả về JSON array hợp lệ, KHÔNG có markdown code blocks, KHÔNG có text thêm.`

        console.log('📤 Sending request to AI...')
        const response = await aiClient.prompt(prompt)
        console.log('📥 Received AI response')

        // Parse AI response
        let jsonStr = response.trim()
        jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '')
        const arrayMatch = jsonStr.match(/\[[\s\S]*\]/)
        
        if (!arrayMatch) {
            throw new Error('Invalid AI response format')
        }

        const wordsData = JSON.parse(arrayMatch[0])
        console.log(`✅ Parsed ${wordsData.length} words from AI`)

        // Save to database
        const savedWords = []
        for (const wordData of wordsData) {
            try {
                const word = await prisma.word.upsert({
                    where: { english: wordData.word.toLowerCase() },
                    create: {
                        english: wordData.word.toLowerCase(),
                        vietnamese: wordData.vietnamese,
                        phonetic: wordData.phonetic,
                        partOfSpeech: wordData.partOfSpeech,
                        definitions: JSON.stringify(wordData.definitions || []),
                        examples: wordData.example ? JSON.stringify([wordData.example]) : null,
                        synonyms: JSON.stringify(wordData.synonyms || []),
                        antonyms: null,
                        audioUrl: null,
                        category
                    },
                    update: {
                        vietnamese: wordData.vietnamese,
                        phonetic: wordData.phonetic,
                        partOfSpeech: wordData.partOfSpeech,
                        definitions: JSON.stringify(wordData.definitions || []),
                        examples: wordData.example ? JSON.stringify([wordData.example]) : null,
                        synonyms: JSON.stringify(wordData.synonyms || []),
                        category
                    }
                })
                savedWords.push(word)
                console.log(`✅ Saved word: ${word.english}`)
            } catch (dbError) {
                console.error(`❌ Error saving word:`, dbError)
            }
        }

        return NextResponse.json({
            success: true,
            count: savedWords.length,
            words: savedWords.map(w => ({
                id: w.id,
                english: w.english,
                vietnamese: w.vietnamese,
                phonetic: w.phonetic,
                definitions: w.definitions ? JSON.parse(w.definitions) : [],
                examples: w.examples ? JSON.parse(w.examples) : [],
                synonyms: w.synonyms ? JSON.parse(w.synonyms) : []
            }))
        })

    } catch (error) {
        console.error('❌ Vocabulary generation error:', error)
        return NextResponse.json(
            {
                error: 'Không thể tạo từ vựng',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
