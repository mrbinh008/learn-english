import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET: Fetch all flashcard decks
export async function GET() {
    try {
        const decks = await prisma.deck.findMany({
            include: {
                flashcards: true
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({
            success: true,
            count: decks.length,
            decks: decks.map(deck => ({
                ...deck,
                cardCount: deck.flashcards.length
            }))
        })
    } catch (error) {
        console.error('Fetch decks error:', error)
        return NextResponse.json({ error: 'Failed to fetch decks' }, { status: 500 })
    }
}

// POST: Create a new deck
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, description } = body

        const deck = await prisma.deck.create({
            data: {
                name,
                description,
                cardCount: 0
            }
        })

        return NextResponse.json({ success: true, deck })
    } catch (error) {
        console.error('Create deck error:', error)
        return NextResponse.json({ error: 'Failed to create deck' }, { status: 500 })
    }
}
