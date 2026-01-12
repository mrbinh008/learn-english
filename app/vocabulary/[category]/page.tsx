'use client'

import { Layout } from '@/components/Layout'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import TTSButton from '@/components/TTSButton'
import { LoadingSpinner, Alert } from '@/components/ui'
import type { WordData } from '@/lib/types'

const CATEGORY_NAMES: Record<string, string> = {
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

export default function CategoryWordsPage() {
    const params = useParams()
    const category = params.category as string

    const [words, setWords] = useState<WordData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        if (category) {
            fetchWords()
        }
    }, [category])

    const fetchWords = async () => {
        try {
            const res = await fetch('/api/vocabulary/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category,
                    limit: 100,
                    offset: 0
                })
            })

            const data = await res.json()

            if (data.success) {
                setWords(data.words)
                setTotal(data.total)
            } else {
                setError('Không thể tải từ vựng')
            }
        } catch (err) {
            console.error('Error fetching words:', err)
            setError('Có lỗi xảy ra')
        } finally {
            setLoading(false)
        }
    }

    const getCategoryName = (cat: string): string => {
        return CATEGORY_NAMES[cat] || cat
    }

    if (loading) {
        return (
            <Layout>
                <LoadingSpinner fullPage text="Đang tải từ vựng..." />
            </Layout>
        )
    }

    if (error) {
        return (
            <Layout>
                <Alert variant="error">{error}</Alert>
                <Link href="/vocabulary" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                    Quay lại
                </Link>
            </Layout>
        )
    }

    return (
        <Layout>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <Link href="/vocabulary" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="page-title" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                        {getCategoryName(category)}
                    </h1>
                    <p style={{ color: 'var(--gray-500)' }}>
                        {total} từ vựng
                    </p>
                </div>
            </div>

            {/* Words List */}
            {words.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--gray-500)' }}>
                        Chưa có từ vựng nào trong chủ đề này
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {words.map((word) => (
                        <WordCard key={word.id} word={word} />
                    ))}
                </div>
            )}
        </Layout>
    )
}

// Word card sub-component
function WordCard({ word }: { word: WordData }) {
    return (
        <div className="card">
            {/* Word Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                            {word.english}
                        </h3>
                        <TTSButton text={word.english} iconOnly />
                        {word.phonetic && (
                            <span style={{ color: 'var(--gray-500)', fontSize: '1rem' }}>
                                {word.phonetic}
                            </span>
                        )}
                    </div>
                    <p style={{ color: 'var(--primary-600)', fontSize: '1.1rem', marginTop: '0.25rem' }}>
                        {word.vietnamese}
                    </p>
                    {word.partOfSpeech && (
                        <span className="badge badge-gray" style={{ marginTop: '0.5rem' }}>
                            {word.partOfSpeech}
                        </span>
                    )}
                </div>
            </div>

            {/* Definitions */}
            {word.definitions.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--gray-600)' }}>
                        Định nghĩa:
                    </h4>
                    <ul style={{ marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {word.definitions.map((def, idx) => (
                            <li key={idx} style={{ color: 'var(--gray-700)' }}>{def}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Examples */}
            {word.examples.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--gray-600)' }}>
                        Ví dụ:
                    </h4>
                    {word.examples.map((ex, idx) => (
                        <div
                            key={idx}
                            style={{
                                padding: '0.75rem',
                                background: 'var(--gray-50)',
                                borderRadius: '0.5rem',
                                borderLeft: '3px solid var(--primary-500)',
                                marginBottom: '0.5rem',
                                fontStyle: 'italic',
                                color: 'var(--gray-600)'
                            }}
                        >
                            {ex}
                        </div>
                    ))}
                </div>
            )}

            {/* Synonyms */}
            {word.synonyms.length > 0 && (
                <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--gray-600)' }}>
                        Từ đồng nghĩa:
                    </h4>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {word.synonyms.map((syn, idx) => (
                            <span key={idx} className="badge badge-blue">
                                {syn}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
