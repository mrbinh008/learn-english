import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET: Fetch a specific deck with flashcards
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const deck = await prisma.deck.findUnique({
            where: { id },
            include: {
                flashcards: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        })

        if (!deck) {
            return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, deck })
    } catch (error) {
        console.error('Fetch deck error:', error)
        return NextResponse.json({ error: 'Failed to fetch deck' }, { status: 500 })
    }
}

// DELETE: Delete a deck
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        await prisma.deck.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete deck error:', error)
        return NextResponse.json({ error: 'Failed to delete deck' }, { status: 500 })
    }
}
