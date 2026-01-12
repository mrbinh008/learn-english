import { Layout } from '@/components/Layout'
import Link from 'next/link'
import { FileText, Clock, BarChart } from 'lucide-react'
import prisma from '@/lib/db'

async function getReadingPassages() {
    const passages = await prisma.readingPassage.findMany({
        orderBy: { createdAt: 'desc' }
    })
    
    return passages.map(passage => ({
        id: passage.id,
        title: passage.title,
        titleVi: passage.titleVi || passage.title,
        level: passage.level,
        category: passage.category,
        // Calculate read time based on word count (assuming 200 words per minute)
        readTime: Math.ceil(passage.content.split(' ').length / 200),
        wordCount: passage.content.split(' ').length
    }))
}

const levelColors: Record<string, string> = {
    beginner: 'badge-green',
    intermediate: 'badge-orange',
    advanced: 'badge-red'
}

const levelLabels: Record<string, string> = {
    beginner: 'Cơ bản',
    intermediate: 'Trung cấp',
    advanced: 'Nâng cao'
}

export default async function ReadingPage() {
    const readingPassages = await getReadingPassages()
    
    return (
        <Layout>
            <div className="page-header">
                <h1 className="page-title">Luyện đọc 📰</h1>
                <p className="page-subtitle">
                    Đọc hiểu các bài viết theo nhiều cấp độ và chủ đề
                </p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button className="btn btn-primary">Tất cả</button>
                <button className="btn btn-secondary">Cơ bản</button>
                <button className="btn btn-secondary">Trung cấp</button>
                <button className="btn btn-secondary">Nâng cao</button>
            </div>

            {/* Reading Cards */}
            <div className="card-grid">
                {readingPassages.map((passage) => (
                    <Link
                        key={passage.id}
                        href={`/reading/${passage.id}`}
                        className="card"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        {/* Category & Level */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <span className={`badge ${levelColors[passage.level]}`}>
                                {levelLabels[passage.level]}
                            </span>
                            <span className="badge badge-blue">{passage.category}</span>
                        </div>

                        {/* Title */}
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                            {passage.title}
                        </h3>
                        <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            {passage.titleVi}
                        </p>

                        {/* Meta */}
                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--gray-500)', fontSize: '0.85rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Clock size={14} />
                                {passage.readTime} phút
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <FileText size={14} />
                                {passage.wordCount} từ
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </Layout>
    )
}
