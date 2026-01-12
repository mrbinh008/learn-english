import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET: Fetch all words from database
export async function GET() {
    try {
        const words = await prisma.word.findMany({
            orderBy: { createdAt: 'desc' }
        })

        // Parse JSON strings back to arrays
        const formattedWords = words.map(word => ({
            ...word,
            definitions: word.definitions ? JSON.parse(word.definitions) : [],
            examples: word.examples ? JSON.parse(word.examples) : [],
            synonyms: word.synonyms ? JSON.parse(word.synonyms) : [],
            antonyms: word.antonyms ? JSON.parse(word.antonyms) : []
        }))

        return NextResponse.json({
            success: true,
            count: words.length,
            words: formattedWords
        })
    } catch (error) {
        console.error('Fetch words error:', error)
        return NextResponse.json({ error: 'Failed to fetch words' }, { status: 500 })
    }
}
