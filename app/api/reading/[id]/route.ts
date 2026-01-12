import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const passage = await prisma.readingPassage.findUnique({
      where: { id }
    })

    if (!passage) {
      return NextResponse.json(
        { error: 'Reading passage not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(passage)
  } catch (error) {
    console.error('Error fetching reading passage:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reading passage' },
      { status: 500 }
    )
  }
}
