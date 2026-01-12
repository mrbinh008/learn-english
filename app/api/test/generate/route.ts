import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { createAIClientFromEnv } from '@/lib/ai'

/**
 * POST /api/test/generate
 * Generate a test with AI
 * 
 * Body:
 * {
 *   name: string - Test name
 *   type: 'vocabulary' | 'grammar' | 'reading' | 'mixed' - Test type
 *   topic?: string - Specific topic (optional)
 *   level?: 'beginner' | 'intermediate' | 'advanced' - Difficulty level
 *   questionCount?: number - Number of questions (default: 20)
 *   timeLimit?: number - Time limit in minutes (optional)
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            name,
            type = 'mixed',
            topic,
            level = 'intermediate',
            questionCount = 20,
            timeLimit
        } = body

        if (!name) {
            return NextResponse.json(
                { error: 'Vui lòng cung cấp tên bài test' },
                { status: 400 }
            )
        }

        console.log(`📝 Generating test: ${name} (${type}, ${level}, ${questionCount} questions)`)

        const aiClient = createAIClientFromEnv()
        const availableProviders = aiClient.getAvailableProviders()

        if (!availableProviders.includes('openai')) {
            return NextResponse.json(
                { error: 'AI provider not available' },
                { status: 503 }
            )
        }

        // Type-specific guidelines
        const typeGuidelines: Record<string, string> = {
            vocabulary: 'Câu hỏi về nghĩa từ, từ đồng nghĩa, trái nghĩa, điền từ vào chỗ trống.',
            grammar: 'Câu hỏi về ngữ pháp, chia động từ, thì, cấu trúc câu, sửa lỗi.',
            reading: 'Đưa ra 1-2 đoạn văn ngắn, sau đó đặt câu hỏi về main idea, details, inference, vocabulary.',
            mixed: 'Kết hợp đa dạng: vocabulary (30%), grammar (40%), reading comprehension (30%).'
        }

        const prompt = `Bạn là một giáo viên tiếng Anh chuyên nghiệp. Hãy tạo một bài test tiếng Anh.

THÔNG TIN:
- Tên: ${name}
- Loại: ${type}
- Độ khó: ${level}
- Số câu hỏi: ${questionCount}
${topic ? `- Chủ đề: ${topic}` : ''}
- Hướng dẫn: ${typeGuidelines[type]}

Trả về JSON với ĐÚNG format sau:
{
  "questions": [
    {
      "type": "multiple_choice",
      "question": "Question text in English",
      "questionVi": "Câu hỏi bằng tiếng Việt",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "optionsVi": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
      "answer": "Option A",
      "explanation": "Explanation in English",
      "explanationVi": "Giải thích bằng tiếng Việt",
      "category": "vocabulary|grammar|reading",
      "points": 1
    }
  ]
}

YÊU CẦU:
- Tạo đúng ${questionCount} câu hỏi
- Độ khó ${level}: ${level === 'beginner' ? 'Đơn giản, rõ ràng' : level === 'intermediate' ? 'Vừa phải, đa dạng' : 'Nâng cao, thử thách'}
- Mỗi câu có 4 lựa chọn
- Đa dạng dạng câu hỏi (nghĩa từ, ngữ pháp, điền từ, đọc hiểu...)
- Nếu là "reading", hãy đưa đoạn văn trong "context" field
- Cả tiếng Anh và tiếng Việt đều chính xác
- Giải thích rõ ràng, giúp học sinh hiểu

${type === 'reading' ? `
- Với câu hỏi reading comprehension, thêm field "context" chứa đoạn văn:
{
  "type": "reading_comprehension",
  "context": "Reading passage text here...",
  "question": "...",
  ...
}
` : ''}

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

        const testData = JSON.parse(objectMatch[0])
        console.log(`✅ Parsed test with ${testData.questions.length} questions`)

        // Save to database
        const test = await prisma.reviewTest.create({
            data: {
                name,
                type,
                questions: JSON.stringify(testData.questions),
                totalItems: testData.questions.length,
                timeLimit
            }
        })

        console.log(`✅ Saved test: ${test.id}`)

        return NextResponse.json({
            success: true,
            test: {
                id: test.id,
                name: test.name,
                type: test.type,
                questions: JSON.parse(test.questions),
                totalItems: test.totalItems,
                timeLimit: test.timeLimit
            }
        })

    } catch (error) {
        console.error('❌ Test generation error:', error)
        return NextResponse.json(
            {
                error: 'Không thể tạo bài test',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
