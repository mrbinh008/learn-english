import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const passages = await prisma.readingPassage.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        titleVi: true,
        level: true,
        category: true,
        content: true,
        createdAt: true
      }
    })

    return NextResponse.json(passages)
  } catch (error) {
    console.error('Error fetching reading passages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reading passages' },
      { status: 500 }
    )
  }
}
