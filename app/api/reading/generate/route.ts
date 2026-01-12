import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { createAIClientFromEnv } from '@/lib/ai'

/**
 * POST /api/reading/generate
 * Generate reading passage with AI
 * 
 * Body:
 * {
 *   topic: string - Topic for the reading passage
 *   level: 'beginner' | 'intermediate' | 'advanced' - Difficulty level
 *   category: string - Category (news, story, science, technology, business, etc.)
 *   wordCount?: number - Approximate word count (default: 200 for beginner, 400 for intermediate, 600 for advanced)
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { topic, level = 'intermediate', category = 'general', wordCount } = body

        if (!topic) {
            return NextResponse.json(
                { error: 'Vui lòng cung cấp chủ đề bài đọc' },
                { status: 400 }
            )
        }

        // Set default word count based on level
        const defaultWordCounts: Record<string, number> = {
            beginner: 200,
            intermediate: 400,
            advanced: 600
        }
        const targetWordCount = wordCount || defaultWordCounts[level] || 400

        console.log(`📖 Generating reading passage: ${topic} (${level}, ${targetWordCount} words)`)

        const aiClient = createAIClientFromEnv()
        const availableProviders = aiClient.getAvailableProviders()

        if (!availableProviders.includes('openai')) {
            return NextResponse.json(
                { error: 'AI provider not available' },
                { status: 503 }
            )
        }

        // Level-specific guidelines
        const levelGuidelines = {
            beginner: 'Sử dụng từ vựng đơn giản, câu ngắn, thì hiện tại đơn chủ yếu. Tránh cấu trúc phức tạp.',
            intermediate: 'Sử dụng từ vựng phong phú hơn, câu dài hơn, nhiều thì khác nhau. Có thể dùng mệnh đề quan hệ đơn giản.',
            advanced: 'Sử dụng từ vựng học thuật, câu phức tạp với nhiều mệnh đề, cấu trúc ngữ pháp nâng cao, thành ngữ.'
        }

        const prompt = `Bạn là một giáo viên tiếng Anh chuyên nghiệp. Hãy tạo một bài đọc tiếng Anh về chủ đề: "${topic}"

YÊU CẦU:
- Độ khó: ${level}
- Thể loại: ${category}
- Số từ: khoảng ${targetWordCount} từ
- Hướng dẫn: ${levelGuidelines[level as keyof typeof levelGuidelines]}

Trả về JSON với ĐÚNG format sau:
{
  "title": "An Interesting Title",
  "titleVi": "Tiêu đề tiếng Việt",
  "content": "Full passage content in English...",
  "summary": "Brief summary in English (2-3 sentences)",
  "summaryVi": "Tóm tắt ngắn bằng tiếng Việt (2-3 câu)",
  "vocabulary": [
    {
      "word": "exercise",
      "vietnamese": "tập thể dục",
      "definition": "physical activity to stay healthy",
      "example": "Morning exercise is very helpful."
    }
  ],
  "questions": [
    {
      "question": "What is the main idea of the passage?",
      "questionVi": "Ý chính của bài đọc là gì?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "optionsVi": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
      "answer": "Option A",
      "explanation": "Explanation in English",
      "explanationVi": "Giải thích bằng tiếng Việt"
    }
  ]
}

YÊU CẦU CHI TIẾT:
- Nội dung (content) phải thú vị, phù hợp độ khó, có cấu trúc rõ ràng (intro, body, conclusion)
- VOCABULARY: Chọn 10-15 từ/cụm từ QUAN TRỌNG nhất trong bài:
  + Các từ khó hoặc học thuật
  + Cụm từ (phrasal verbs, idioms, collocations)
  + Từ quan trọng cho chủ đề
  + Mỗi từ phải có: word (chính xác như trong bài), vietnamese (nghĩa), definition (định nghĩa ngắn tiếng Anh), example (ví dụ từ bài hoặc tương tự)
- Tạo 5-7 câu hỏi đọc hiểu đa dạng:
  + Main idea (ý chính)
  + Detail questions (chi tiết cụ thể)
  + Inference (suy luận)
  + Vocabulary in context (từ vựng trong ngữ cảnh)
- Mỗi câu hỏi có 4 lựa chọn
- Cả tiếng Anh và tiếng Việt đều phải chính xác
- Giải thích phải rõ ràng, giúp người học hiểu tại sao

Chỉ trả về JSON object hợp lệ, KHÔNG có markdown code blocks, KHÔNG có text thêm.`

        console.log('📤 Sending request to AI...')
        const response = await aiClient.prompt(prompt)
        console.log('📥 Received AI response')

        // Parse AI response
        let jsonStr = response.trim()
        jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '')
        const objectMatch = jsonStr.match(/\{[\s\S]*\}/)
        
        if (!objectMatch) {
            throw new Error('Invalid AI response format')
        }

        const passageData = JSON.parse(objectMatch[0])
        console.log(`✅ Parsed reading passage: ${passageData.title}`)

        // Save to database
        const passage = await prisma.readingPassage.create({
            data: {
                title: passageData.title,
                titleVi: passageData.titleVi,
                content: passageData.content,
                level,
                category,
                questions: JSON.stringify(passageData.questions || []),
                vocabulary: JSON.stringify(passageData.vocabulary || []),
                summary: passageData.summary,
                summaryVi: passageData.summaryVi
            }
        })

        console.log(`✅ Saved reading passage: ${passage.id}`)

        return NextResponse.json({
            success: true,
            passage: {
                id: passage.id,
                title: passage.title,
                titleVi: passage.titleVi,
                content: passage.content,
                level: passage.level,
                category: passage.category,
                summary: passage.summary,
                summaryVi: passage.summaryVi,
                questions: JSON.parse(passage.questions),
                wordCount: passage.content.split(/\s+/).length,
                readTime: Math.ceil(passage.content.split(/\s+/).length / 200) // 200 words per minute
            }
        })

    } catch (error) {
        console.error('❌ Reading passage generation error:', error)
        return NextResponse.json(
            {
                error: 'Không thể tạo bài đọc',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
