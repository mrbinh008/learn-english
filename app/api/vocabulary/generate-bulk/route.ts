import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { createAIClientFromEnv } from '@/lib/ai'

/**
 * POST /api/vocabulary/generate-bulk
 * Generate vocabulary words in bulk (up to 1000 words per request)
 * 
 * Body:
 * {
 *   category: string - Category/topic
 *   count?: number - Number of words to generate (default: 100, max: 1000)
 *   level?: 'beginner' | 'intermediate' | 'advanced' - Difficulty level
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { category = 'general', count = 100, level = 'intermediate' } = body

        if (count > 1000) {
            return NextResponse.json(
                { error: 'Số lượng tối đa là 1000 từ mỗi lần' },
                { status: 400 }
            )
        }

        console.log(`📚 Generating ${count} words for category: ${category}`)

        const aiClient = createAIClientFromEnv()
        const availableProviders = aiClient.getAvailableProviders()

        if (!availableProviders.includes('openai')) {
            return NextResponse.json(
                { error: 'AI provider not available' },
                { status: 503 }
            )
        }

        // Split into batches of 50 words for better AI performance
        const batchSize = 50
        const batches = Math.ceil(count / batchSize)
        let allWords: any[] = []
        let totalGenerated = 0

        for (let i = 0; i < batches; i++) {
            const wordsInBatch = Math.min(batchSize, count - totalGenerated)
            
            console.log(`📦 Batch ${i + 1}/${batches}: Generating ${wordsInBatch} words...`)

            const prompt = `Bạn là một chuyên gia từ vựng tiếng Anh. Hãy tạo ${wordsInBatch} từ vựng tiếng Anh phổ biến thuộc chủ đề "${category}" với độ khó ${level}.

YÊU CẦU:
- Độ khó ${level}: ${getLevelGuideline(level)}
- Chủ đề: ${getCategoryGuideline(category)}
- Chọn những từ thực tế, hữu ích, thường gặp
- Đa dạng loại từ: noun, verb, adjective, adverb
- Không trùng lặp

Trả về JSON array với format sau:
[
  {
    "word": "example",
    "phonetic": "/ɪɡˈzæmpəl/",
    "vietnamese": "ví dụ, mẫu",
    "partOfSpeech": "noun, verb",
    "definitions": [
      "(noun) một vật, tình huống hoặc hành động được đưa ra để minh họa một quy tắc",
      "(verb) trích dẫn hoặc đưa ra như một ví dụ"
    ],
    "example": "For example, you could use recycled paper.",
    "synonyms": ["instance", "case", "illustration"]
  }
]

Chỉ trả về JSON array hợp lệ, KHÔNG có markdown, KHÔNG có text thêm.`

            try {
                const response = await aiClient.prompt(prompt)
                
                // Parse response
                let jsonStr = response.trim()
                jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '')
                const arrayMatch = jsonStr.match(/\[[\s\S]*\]/)
                
                if (!arrayMatch) {
                    console.error('❌ Invalid AI response in batch', i + 1)
                    continue
                }

                const wordsData = JSON.parse(arrayMatch[0])
                console.log(`✅ Batch ${i + 1}: Parsed ${wordsData.length} words`)
                
                // Save to database
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
                        
                        allWords.push({
                            id: word.id,
                            english: word.english,
                            vietnamese: word.vietnamese,
                            phonetic: word.phonetic
                        })
                        totalGenerated++
                    } catch (dbError) {
                        console.error(`❌ Error saving word:`, dbError)
                    }
                }

                // Small delay between batches to avoid overwhelming the AI
                if (i < batches - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000))
                }
            } catch (batchError) {
                console.error(`❌ Error in batch ${i + 1}:`, batchError)
            }
        }

        console.log(`🎉 Completed: Generated ${totalGenerated} words`)

        return NextResponse.json({
            success: true,
            count: totalGenerated,
            requested: count,
            category,
            words: allWords.slice(0, 20) // Return first 20 as preview
        })

    } catch (error) {
        console.error('❌ Bulk generation error:', error)
        return NextResponse.json(
            {
                error: 'Không thể tạo từ vựng',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

function getLevelGuideline(level: string): string {
    const guidelines: Record<string, string> = {
        beginner: 'Từ cơ bản, đơn giản, thường gặp trong cuộc sống hàng ngày',
        intermediate: 'Từ trung cấp, phổ biến trong giao tiếp và công việc',
        advanced: 'Từ nâng cao, học thuật, chuyên ngành, ít gặp hơn'
    }
    return guidelines[level] || guidelines['intermediate']
}

function getCategoryGuideline(category: string): string {
    const guidelines: Record<string, string> = {
        general: 'Từ vựng tổng quát, đa dạng chủ đề',
        daily: 'Từ vựng giao tiếp hàng ngày, gia đình, bạn bè, hoạt động thường ngày',
        travel: 'Từ vựng du lịch, máy bay, khách sạn, phương tiện, địa điểm',
        business: 'Từ vựng công việc, văn phòng, họp hành, email, thương mại',
        academic: 'Từ vựng học thuật, nghiên cứu, giáo dục, khoa học',
        technology: 'Từ vựng công nghệ, máy tính, internet, phần mềm, AI',
        health: 'Từ vựng y tế, sức khỏe, bệnh viện, thuốc men, thể dục',
        food: 'Từ vựng ẩm thực, món ăn, nguyên liệu, nấu nướng, nhà hàng',
        sports: 'Từ vựng thể thao, bóng đá, bơi lội, tập gym, thi đấu',
        entertainment: 'Từ vựng giải trí, phim ảnh, âm nhạc, trò chơi, sở thích'
    }
    return guidelines[category] || guidelines['general']
}
