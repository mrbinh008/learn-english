import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET: Fetch a specific grammar lesson with exercises
export async function GET(
    request: Request,
    { params }: { params: Promise<{ topicId: string; lessonId: string }> }
) {
    try {
        const { lessonId } = await params

        const lesson = await prisma.grammarLesson.findUnique({
            where: { id: lessonId },
            include: {
                topic: {
                    select: {
                        id: true,
                        name: true,
                        nameVi: true,
                        icon: true
                    }
                },
                exercises: {
                    orderBy: { id: 'asc' }
                }
            }
        })

        if (!lesson) {
            return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
        }

        // Parse JSON strings
        const examples = lesson.examples ? JSON.parse(lesson.examples) : []
        const exercises = lesson.exercises.map(ex => ({
            id: ex.id,
            question: ex.question,
            questionVi: ex.questionVi,
            type: ex.type,
            options: ex.options ? JSON.parse(ex.options) : null,
            answer: ex.answer,
            explanation: ex.explanation
        }))

        return NextResponse.json({
            success: true,
            lesson: {
                id: lesson.id,
                title: lesson.title,
                titleVi: lesson.titleVi,
                content: lesson.content,
                examples,
                order: lesson.order,
                topic: lesson.topic,
                exercises
            }
        })
    } catch (error) {
        console.error('Fetch grammar lesson error:', error)
        return NextResponse.json({ error: 'Failed to fetch grammar lesson' }, { status: 500 })
    }
}
