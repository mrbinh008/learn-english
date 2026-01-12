import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { createAIClientFromEnv } from '@/lib/ai'

/**
 * POST /api/dictionary/lookup
 * Look up word definition - first check database, then use AI if not found
 * 
 * Body:
 * {
 *   word: string - Word to look up
 *   saveToDb?: boolean - Save to database if found via AI (default: true)
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { word, saveToDb = true } = body

        if (!word || typeof word !== 'string') {
            return NextResponse.json(
                { error: 'Vui lòng cung cấp từ cần tra' },
                { status: 400 }
            )
        }

        const cleanWord = word.toLowerCase().trim()
        console.log(`📖 Looking up word: ${cleanWord}`)

        // Step 1: Check database first
        const existingWord = await prisma.word.findUnique({
            where: { english: cleanWord }
        })

        if (existingWord) {
            console.log(`✅ Found word in database: ${cleanWord}`)
            return NextResponse.json({
                success: true,
                source: 'database',
                word: {
                    english: existingWord.english,
                    vietnamese: existingWord.vietnamese,
                    phonetic: existingWord.phonetic,
                    partOfSpeech: existingWord.partOfSpeech,
                    definitions: existingWord.definitions ? JSON.parse(existingWord.definitions) : [],
                    examples: existingWord.examples ? JSON.parse(existingWord.examples) : [],
                    synonyms: existingWord.synonyms ? JSON.parse(existingWord.synonyms) : [],
                    antonyms: existingWord.antonyms ? JSON.parse(existingWord.antonyms) : []
                }
            })
        }

        // Step 2: Use AI if not in database
        console.log(`🤖 Word not in database, using AI: ${cleanWord}`)
        
        const aiClient = createAIClientFromEnv()
        const availableProviders = aiClient.getAvailableProviders()

        if (!availableProviders.includes('openai')) {
            return NextResponse.json(
                { error: 'AI provider not available and word not found in database' },
                { status: 503 }
            )
        }

        const prompt = `Bạn là một từ điển Anh-Việt chuyên nghiệp. Hãy cung cấp thông tin chi tiết cho từ tiếng Anh: "${cleanWord}"

Trả về JSON với ĐÚNG format sau:
{
  "word": "${cleanWord}",
  "phonetic": "/phonetic/",
  "vietnamese": "nghĩa tiếng Việt ngắn gọn",
  "partOfSpeech": "noun, verb, adj...",
  "definitions": [
    "(noun) giải thích chi tiết bằng tiếng Việt",
    "(verb) giải thích chi tiết bằng tiếng Việt"
  ],
  "example": "Example sentence in English.",
  "synonyms": ["synonym1", "synonym2"],
  "antonyms": ["antonym1", "antonym2"]
}

YÊU CẦU:
- "vietnamese" phải là nghĩa tiếng Việt ngắn gọn (2-4 từ)
- "definitions" là giải thích CHI TIẾT bằng tiếng Việt với loại từ trong ngoặc
- Cung cấp 2-3 định nghĩa
- Phonetic theo IPA chuẩn
- Ít nhất 2-3 từ đồng nghĩa và trái nghĩa (nếu có)

Nếu từ không tồn tại, trả về: {"error": "Word not found"}

Chỉ trả về JSON object hợp lệ, KHÔNG có markdown, KHÔNG có text thêm.`

        const response = await aiClient.prompt(prompt)
        
        // Parse AI response
        let jsonStr = response.trim()
        jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '')
        const objectMatch = jsonStr.match(/\{[\s\S]*\}/)
        
        if (!objectMatch) {
            throw new Error('Invalid AI response format')
        }

        const wordData = JSON.parse(objectMatch[0])

        if (wordData.error) {
            return NextResponse.json(
                { error: 'Không tìm thấy từ này', notFound: true },
                { status: 404 }
            )
        }

        console.log(`✅ AI found word: ${cleanWord}`)

        // Step 3: Save to database if requested
        if (saveToDb) {
            try {
                await prisma.word.create({
                    data: {
                        english: cleanWord,
                        vietnamese: wordData.vietnamese,
                        phonetic: wordData.phonetic,
                        partOfSpeech: wordData.partOfSpeech,
                        definitions: JSON.stringify(wordData.definitions || []),
                        examples: wordData.example ? JSON.stringify([wordData.example]) : null,
                        synonyms: JSON.stringify(wordData.synonyms || []),
                        antonyms: JSON.stringify(wordData.antonyms || []),
                        audioUrl: null,
                        category: 'general'
                    }
                })
                console.log(`💾 Saved word to database: ${cleanWord}`)
            } catch (dbError) {
                console.error('Error saving to database:', dbError)
                // Continue even if save fails
            }
        }

        return NextResponse.json({
            success: true,
            source: 'ai',
            word: {
                english: wordData.word,
                vietnamese: wordData.vietnamese,
                phonetic: wordData.phonetic,
                partOfSpeech: wordData.partOfSpeech,
                definitions: wordData.definitions || [],
                examples: wordData.example ? [wordData.example] : [],
                synonyms: wordData.synonyms || [],
                antonyms: wordData.antonyms || []
            }
        })

    } catch (error) {
        console.error('❌ Dictionary lookup error:', error)
        return NextResponse.json(
            {
                error: 'Không thể tra từ',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
