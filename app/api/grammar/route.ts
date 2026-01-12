import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET: Fetch all grammar topics with lesson counts
export async function GET() {
    try {
        const topics = await prisma.grammarTopic.findMany({
            orderBy: { order: 'asc' },
            include: {
                _count: {
                    select: { lessons: true }
                }
            }
        })

        return NextResponse.json({
            success: true,
            count: topics.length,
            topics: topics.map(topic => ({
                id: topic.id,
                name: topic.name,
                nameVi: topic.nameVi,
                description: topic.description,
                icon: topic.icon,
                order: topic.order,
                lessonCount: topic._count.lessons
            }))
        })
    } catch (error) {
        console.error('Fetch grammar topics error:', error)
        return NextResponse.json({ error: 'Failed to fetch grammar topics' }, { status: 500 })
    }
}
