'use client'

import { Layout } from '@/components/Layout'
import Link from 'next/link'
import { BookOpen, ChevronRight, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Lesson {
    id: string
    title: string
    titleVi: string
    order: number
    exerciseCount: number
}

interface Topic {
    id: string
    name: string
    nameVi: string
    description: string | null
    icon: string
    order: number
    lessonCount: number
    lessons?: Lesson[]
}

export default function GrammarPage() {
    const [topics, setTopics] = useState<Topic[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchTopics() {
            try {
                // Fetch all topics
                const topicsRes = await fetch('/api/grammar')
                const topicsData = await topicsRes.json()
                
                if (!topicsData.success) {
                    throw new Error('Failed to fetch topics')
                }

                // Fetch lessons for each topic
                const topicsWithLessons = await Promise.all(
                    topicsData.topics.map(async (topic: Topic) => {
                        const topicRes = await fetch(`/api/grammar/${topic.id}`)
                        const topicData = await topicRes.json()
                        return {
                            ...topic,
                            lessons: topicData.topic.lessons
                        }
                    })
                )

                setTopics(topicsWithLessons)
            } catch (err) {
                console.error('Error fetching grammar data:', err)
                setError('Không thể tải dữ liệu ngữ pháp')
            } finally {
                setLoading(false)
            }
        }

        fetchTopics()
    }, [])

    if (loading) {
        return (
            <Layout>
                <div className="page-header">
                    <h1 className="page-title">Ngữ pháp tiếng Anh 📚</h1>
                </div>
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <Loader2 className="spinner" size={48} />
                    <p style={{ marginTop: '1rem', color: 'var(--gray-500)' }}>Đang tải...</p>
                </div>
            </Layout>
        )
    }

    if (error) {
        return (
            <Layout>
                <div className="page-header">
                    <h1 className="page-title">Ngữ pháp tiếng Anh 📚</h1>
                </div>
                <div className="error-box">
                    <p>{error}</p>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="page-header">
                <h1 className="page-title">Ngữ pháp tiếng Anh 📚</h1>
                <p className="page-subtitle">
                    Học ngữ pháp từ cơ bản đến nâng cao với bài tập thực hành
                </p>
            </div>

            {/* Topics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {topics.map((topic) => {
                    const lessons = topic.lessons || []

                    return (
                        <div key={topic.id} className="card">
                            {/* Topic Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '2rem' }}>{topic.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                                        {topic.name}
                                    </h3>
                                    <p style={{ color: 'var(--gray-500)' }}>{topic.nameVi}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className="badge badge-blue">
                                        {lessons.length} bài
                                    </span>
                                </div>
                            </div>

                            {/* Lessons */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {lessons.map((lesson) => (
                                    <Link
                                        key={lesson.id}
                                        href={`/grammar/${topic.id}/${lesson.id}`}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            background: 'var(--gray-50)',
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <BookOpen size={20} style={{ color: 'var(--gray-400)' }} />
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 500 }}>{lesson.title}</p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{lesson.titleVi}</p>
                                        </div>
                                        <span className="badge badge-gray" style={{ fontSize: '0.75rem' }}>
                                            {lesson.exerciseCount} bài tập
                                        </span>
                                        <ChevronRight size={20} style={{ color: 'var(--gray-400)' }} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </Layout>
    )
}
