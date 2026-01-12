import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

/**
 * GET /api/vocabulary/categories
 * Get all vocabulary categories with word counts
 */
export async function GET(request: NextRequest) {
    try {
        // Get all categories with counts
        const categories = await prisma.word.groupBy({
            by: ['category'],
            _count: {
                category: true
            }
        })

        // Map to details
        const categoriesWithDetails = categories.map((cat) => {
            const categoryName = cat.category || 'general'
            return {
                id: categoryName,
                name: getCategoryName(categoryName),
                icon: getCategoryIcon(categoryName),
                wordCount: cat._count.category,
                category: categoryName
            }
        })

        return NextResponse.json({
            success: true,
            categories: categoriesWithDetails
        })
    } catch (error) {
        console.error('❌ Get categories error:', error)
        return NextResponse.json(
            { error: 'Không thể lấy danh sách chủ đề' },
            { status: 500 }
        )
    }
}

/**
 * GET /api/vocabulary/categories/[category]
 * Get words by category with pagination
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { category, limit = 50, offset = 0 } = body

        const words = await prisma.word.findMany({
            where: category ? { category } : undefined,
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'desc' }
        })

        const total = await prisma.word.count({
            where: category ? { category } : undefined
        })

        // Parse JSON fields
        const formattedWords = words.map(word => ({
            ...word,
            definitions: word.definitions ? JSON.parse(word.definitions) : [],
            examples: word.examples ? JSON.parse(word.examples) : [],
            synonyms: word.synonyms ? JSON.parse(word.synonyms) : [],
            antonyms: word.antonyms ? JSON.parse(word.antonyms) : []
        }))

        return NextResponse.json({
            success: true,
            words: formattedWords,
            total,
            limit,
            offset
        })
    } catch (error) {
        console.error('❌ Get words by category error:', error)
        return NextResponse.json(
            { error: 'Không thể lấy từ vựng' },
            { status: 500 }
        )
    }
}

function getCategoryName(category: string): string {
    const names: Record<string, string> = {
        general: 'Chung',
        daily: 'Giao tiếp hàng ngày',
        travel: 'Du lịch',
        business: 'Công việc',
        academic: 'Học thuật',
        technology: 'Công nghệ',
        health: 'Sức khỏe',
        food: 'Ẩm thực',
        sports: 'Thể thao',
        entertainment: 'Giải trí'
    }
    return names[category] || category
}

function getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
        general: '📚',
        daily: '💬',
        travel: '✈️',
        business: '💼',
        academic: '🎓',
        technology: '💻',
        health: '🏥',
        food: '🍽️',
        sports: '⚽',
        entertainment: '🎬'
    }
    return icons[category] || '📖'
}
