// AI Helper Functions for English Learning
import { AIClient, AIMessage } from '@/lib/ai'

const SYSTEM_PROMPT = `Bạn là trợ lý học tiếng Anh cho người Việt. Hãy trả lời ngắn gọn, dễ hiểu.
Khi được hỏi về từ vựng, hãy cung cấp: nghĩa tiếng Việt, ví dụ, và cách dùng.
Khi kiểm tra ngữ pháp, hãy giải thích lỗi và cách sửa bằng tiếng Việt.`

export interface TranslationResult {
    vietnamese: string
    examples: string[]
    usage?: string
}

export interface GrammarCheckResult {
    isCorrect: boolean
    corrections: Array<{
        original: string
        corrected: string
        explanation: string
    }>
    suggestion?: string
}

export interface QuizQuestion {
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
}

// Translate word to Vietnamese with examples
export async function translateWord(
    client: AIClient,
    word: string
): Promise<TranslationResult> {
    const prompt = `Dịch từ "${word}" sang tiếng Việt. Trả về JSON với format:
{
  "vietnamese": "nghĩa tiếng Việt",
  "examples": ["ví dụ 1", "ví dụ 2"],
  "usage": "cách dùng phổ biến"
}
Chỉ trả về JSON, không giải thích thêm.`

    const response = await client.prompt(prompt, SYSTEM_PROMPT)

    try {
        return JSON.parse(response)
    } catch {
        return {
            vietnamese: response,
            examples: []
        }
    }
}

// Check grammar of a sentence
export async function checkGrammar(
    client: AIClient,
    sentence: string
): Promise<GrammarCheckResult> {
    const prompt = `Kiểm tra ngữ pháp câu: "${sentence}"
Trả về JSON:
{
  "isCorrect": true/false,
  "corrections": [
    {"original": "lỗi", "corrected": "sửa lại", "explanation": "giải thích"}
  ],
  "suggestion": "câu hoàn chỉnh nếu có lỗi"
}
Chỉ trả về JSON.`

    const response = await client.prompt(prompt, SYSTEM_PROMPT)

    try {
        return JSON.parse(response)
    } catch {
        return {
            isCorrect: true,
            corrections: []
        }
    }
}

// Generate quiz questions for vocabulary
export async function generateVocabularyQuiz(
    client: AIClient,
    words: string[],
    count: number = 5
): Promise<QuizQuestion[]> {
    const prompt = `Tạo ${count} câu hỏi trắc nghiệm từ vựng cho các từ: ${words.join(', ')}
Mỗi câu có 4 đáp án, 1 đáp án đúng.
Trả về JSON array:
[{
  "question": "câu hỏi (có thể hỏi nghĩa, điền từ, hoặc chọn từ đồng nghĩa)",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0-3,
  "explanation": "giải thích đáp án"
}]
Chỉ trả về JSON array.`

    const response = await client.prompt(prompt, SYSTEM_PROMPT)

    try {
        return JSON.parse(response)
    } catch {
        return []
    }
}

// Generate grammar exercises
export async function generateGrammarExercise(
    client: AIClient,
    topic: string,
    count: number = 5
): Promise<QuizQuestion[]> {
    const prompt = `Tạo ${count} bài tập ngữ pháp về "${topic}" cho người Việt học tiếng Anh.
Trả về JSON array:
[{
  "question": "câu hỏi hoặc câu cần điền",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0-3,
  "explanation": "giải thích bằng tiếng Việt"
}]
Chỉ trả về JSON array.`

    const response = await client.prompt(prompt, SYSTEM_PROMPT)

    try {
        return JSON.parse(response)
    } catch {
        return []
    }
}

// Summarize reading passage
export async function summarizePassage(
    client: AIClient,
    passage: string
): Promise<{ summary: string; keyPoints: string[] }> {
    const prompt = `Tóm tắt bài đọc sau bằng tiếng Việt và liệt kê các ý chính:

${passage}

Trả về JSON:
{
  "summary": "tóm tắt ngắn gọn bằng tiếng Việt",
  "keyPoints": ["ý chính 1", "ý chính 2", "ý chính 3"]
}
Chỉ trả về JSON.`

    const response = await client.prompt(prompt, SYSTEM_PROMPT)

    try {
        return JSON.parse(response)
    } catch {
        return {
            summary: response,
            keyPoints: []
        }
    }
}

// Generate comprehension questions for reading
export async function generateComprehensionQuestions(
    client: AIClient,
    passage: string,
    count: number = 5
): Promise<QuizQuestion[]> {
    const prompt = `Tạo ${count} câu hỏi đọc hiểu cho bài đọc sau:

${passage}

Trả về JSON array với câu hỏi bằng tiếng Anh và giải thích bằng tiếng Việt:
[{
  "question": "câu hỏi tiếng Anh",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0-3,
  "explanation": "giải thích tiếng Việt"
}]
Chỉ trả về JSON array.`

    const response = await client.prompt(prompt, SYSTEM_PROMPT)

    try {
        return JSON.parse(response)
    } catch {
        return []
    }
}

// Explain a word in context
export async function explainWordInContext(
    client: AIClient,
    word: string,
    context: string
): Promise<string> {
    const prompt = `Giải thích nghĩa của từ "${word}" trong ngữ cảnh sau:
"${context}"

Trả lời ngắn gọn bằng tiếng Việt.`

    return client.prompt(prompt, SYSTEM_PROMPT)
}
