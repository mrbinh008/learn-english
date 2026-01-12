import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET: Fetch a specific grammar topic with its lessons
export async function GET(
    request: Request,
    { params }: { params: Promise<{ topicId: string }> }
) {
    try {
        const { topicId } = await params

        const topic = await prisma.grammarTopic.findUnique({
            where: { id: topicId },
            include: {
                lessons: {
                    orderBy: { order: 'asc' },
                    include: {
                        _count: {
                            select: { exercises: true }
                        }
                    }
                }
            }
        })

        if (!topic) {
            return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            topic: {
                id: topic.id,
                name: topic.name,
                nameVi: topic.nameVi,
                description: topic.description,
                icon: topic.icon,
                order: topic.order,
                lessons: topic.lessons.map(lesson => ({
                    id: lesson.id,
                    title: lesson.title,
                    titleVi: lesson.titleVi,
                    order: lesson.order,
                    exerciseCount: lesson._count.exercises
                }))
            }
        })
    } catch (error) {
        console.error('Fetch grammar topic error:', error)
        return NextResponse.json({ error: 'Failed to fetch grammar topic' }, { status: 500 })
    }
}
