'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, BookOpen, Play, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'

// Simple markdown to HTML converter
function markdownToHtml(markdown: string): string {
    return markdown
        .replace(/^# (.*$)/gim, '<h1 style="font-size:1.5rem;font-weight:600;margin:1.5rem 0 0.75rem;color:var(--foreground)">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 style="font-size:1.25rem;font-weight:600;margin:1.5rem 0 0.75rem;color:var(--foreground)">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 style="font-size:1.1rem;font-weight:600;margin:1rem 0 0.5rem;color:var(--foreground)">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--primary-600)">$1</strong>')
        .replace(/`(.*?)`/g, '<code style="background:var(--gray-100);padding:0.2rem 0.4rem;borderRadius:0.25rem;fontSize:0.9em">$1</code>')
        .replace(/^- (.*$)/gim, '<li style="margin-left:1.5rem;margin-bottom:0.25rem">$1</li>')
        .replace(/\n\n/g, '</p><p style="margin-bottom:0.75rem">')
        .replace(/\n/g, '<br>')
}

interface Example {
    english: string
    vietnamese: string
}

interface Exercise {
    id: string
    question: string
    questionVi: string | null
    type: string
    options: string[] | null
    answer: string
    explanation: string | null
}

interface Lesson {
    id: string
    title: string
    titleVi: string
    content: string
    examples: Example[]
    order: number
    topic: {
        id: string
        name: string
        nameVi: string
        icon: string
    }
    exercises: Exercise[]
}

export default function GrammarLessonPage() {
    const params = useParams()
    const topicId = params.topic as string
    const lessonId = params.lesson as string

    const [lesson, setLesson] = useState<Lesson | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [showExercises, setShowExercises] = useState(false)
    const [currentExercise, setCurrentExercise] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [score, setScore] = useState(0)

    useEffect(() => {
        async function fetchLesson() {
            try {
                const res = await fetch(`/api/grammar/${topicId}/${lessonId}`)
                const data = await res.json()
                
                if (!data.success) {
                    throw new Error('Failed to fetch lesson')
                }

                setLesson(data.lesson)
            } catch (err) {
                console.error('Error fetching lesson:', err)
                setError('Không thể tải bài học')
            } finally {
                setLoading(false)
            }
        }

        if (topicId && lessonId) {
            fetchLesson()
        }
    }, [topicId, lessonId])

    const handleSubmitAnswer = () => {
        if (lesson && selectedAnswer !== null) {
            const currentEx = lesson.exercises[currentExercise]
            const correctIndex = currentEx.options?.indexOf(currentEx.answer) ?? -1
            
            if (selectedAnswer === correctIndex) {
                setScore(score + 1)
            }
            setShowResult(true)
        }
    }

    const handleNextExercise = () => {
        if (lesson && currentExercise < lesson.exercises.length - 1) {
            setCurrentExercise(currentExercise + 1)
            setSelectedAnswer(null)
            setShowResult(false)
        }
    }

    if (loading) {
        return (
            <Layout>
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <Loader2 className="spinner" size={48} />
                    <p style={{ marginTop: '1rem', color: 'var(--gray-500)' }}>Đang tải...</p>
                </div>
            </Layout>
        )
    }

    if (error || !lesson) {
        return (
            <Layout>
                <div className="error-box">
                    <p>{error || 'Không tìm thấy bài học'}</p>
                    <Link href="/grammar" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                        Quay lại
                    </Link>
                </div>
            </Layout>
        )
    }

    const currentEx = lesson.exercises[currentExercise]
    const correctIndex = currentEx?.options?.indexOf(currentEx.answer) ?? -1

    return (
        <Layout>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <Link href="/grammar" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="page-title" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                        {lesson.title}
                    </h1>
                    <p style={{ color: 'var(--gray-500)' }}>
                        {lesson.topic.icon} {lesson.topic.nameVi} · {lesson.titleVi}
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem' }}>
                {/* Main Content */}
                <div className="card">
                    {/* Lesson Content */}
                    <div
                        style={{
                            lineHeight: 1.8,
                            fontSize: '1rem'
                        }}
                        dangerouslySetInnerHTML={{ __html: markdownToHtml(lesson.content) }}
                    />

                    {/* Examples */}
                    {lesson.examples.length > 0 && (
                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <BookOpen size={18} />
                                Ví dụ
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {lesson.examples.map((ex, idx) => (
                                    <div key={idx} style={{
                                        padding: '1rem',
                                        background: 'var(--gray-50)',
                                        borderRadius: '0.5rem',
                                        borderLeft: '3px solid var(--primary-500)'
                                    }}>
                                        <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{ex.english}</p>
                                        <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{ex.vietnamese}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar - Exercises */}
                <div style={{ position: 'sticky', top: '1rem', alignSelf: 'start' }}>
                    <div className="card">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
                            📝 Bài tập
                        </h3>

                        {lesson.exercises.length === 0 ? (
                            <p style={{ color: 'var(--gray-500)' }}>Chưa có bài tập cho bài học này</p>
                        ) : !showExercises ? (
                            <>
                                <p style={{ color: 'var(--gray-500)', marginBottom: '1rem' }}>
                                    Có {lesson.exercises.length} bài tập để luyện tập kiến thức
                                </p>
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                    onClick={() => setShowExercises(true)}
                                >
                                    <Play size={18} />
                                    Bắt đầu làm bài
                                </button>
                            </>
                        ) : (
                            <>
                                <div style={{ marginBottom: '1rem' }}>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>
                                        Câu {currentExercise + 1}/{lesson.exercises.length}
                                    </p>
                                    <div className="progress-bar" style={{ marginTop: '0.5rem' }}>
                                        <div className="progress-fill" style={{ width: `${((currentExercise + 1) / lesson.exercises.length) * 100}%` }}></div>
                                    </div>
                                </div>

                                <p style={{ fontWeight: 500, marginBottom: '1rem' }}>
                                    {currentEx.question}
                                </p>

                                {currentEx.options && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                        {currentEx.options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => !showResult && setSelectedAnswer(idx)}
                                                style={{
                                                    padding: '0.75rem',
                                                    border: `2px solid ${showResult && idx === correctIndex
                                                            ? 'var(--accent-green)'
                                                            : showResult && idx === selectedAnswer
                                                                ? 'var(--accent-red)'
                                                                : selectedAnswer === idx
                                                                    ? 'var(--primary-500)'
                                                                    : 'var(--gray-200)'
                                                        }`,
                                                    borderRadius: '0.5rem',
                                                    background: showResult && idx === correctIndex
                                                        ? '#dcfce7'
                                                        : 'var(--card-bg)',
                                                    textAlign: 'left',
                                                    cursor: showResult ? 'default' : 'pointer',
                                                    fontSize: '0.95rem'
                                                }}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {showResult && currentEx.explanation && (
                                    <div style={{
                                        padding: '0.75rem',
                                        background: 'var(--primary-50)',
                                        borderRadius: '0.5rem',
                                        marginBottom: '1rem',
                                        fontSize: '0.9rem'
                                    }}>
                                        <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>💡 Giải thích:</p>
                                        <p>{currentEx.explanation}</p>
                                    </div>
                                )}

                                {!showResult ? (
                                    <button
                                        className="btn btn-primary"
                                        style={{ width: '100%' }}
                                        onClick={handleSubmitAnswer}
                                        disabled={selectedAnswer === null}
                                    >
                                        Kiểm tra
                                    </button>
                                ) : currentExercise < lesson.exercises.length - 1 ? (
                                    <button
                                        className="btn btn-primary"
                                        style={{ width: '100%' }}
                                        onClick={handleNextExercise}
                                    >
                                        Câu tiếp theo
                                    </button>
                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--accent-green)' }}>
                                            <CheckCircle size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                            Hoàn thành!
                                        </p>
                                        <p style={{ color: 'var(--gray-500)', marginBottom: '1rem' }}>
                                            Đúng {score}/{lesson.exercises.length} câu
                                        </p>
                                        <Link href="/grammar" className="btn btn-secondary" style={{ width: '100%' }}>
                                            Về danh sách
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}
