import { NextRequest, NextResponse } from 'next/server'
import { createAIClientFromEnv } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { text, source = 'en', target = 'vi' } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      )
    }

    // Get AI client
    const aiClient = createAIClientFromEnv()

    // Create translation prompt
    const prompt = `Translate the following ${source === 'en' ? 'English' : 'Vietnamese'} text to ${target === 'vi' ? 'Vietnamese' : 'English'}.
Provide ONLY the translation, without any explanations or additional text.

Text to translate:
${text}

Translation:`

    // Get translation from AI
    const translation = await aiClient.prompt(prompt)

    return NextResponse.json({
      translation: translation.trim(),
      source,
      target
    })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Failed to translate text' },
      { status: 500 }
    )
  }
}
