'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import Link from 'next/link'
import { Check, X, Clock, ArrowRight, RotateCcw } from 'lucide-react'

// Mock test questions
const mockQuestions = [
    {
        id: '1',
        type: 'vocabulary',
        question: '"Accomplish" có nghĩa là gì?',
        options: ['Hoàn thành', 'Bắt đầu', 'Dừng lại', 'Tiếp tục'],
        correctAnswer: 0,
        explanation: '"Accomplish" có nghĩa là hoàn thành, đạt được mục tiêu.'
    },
    {
        id: '2',
        type: 'vocabulary',
        question: 'Từ nào đồng nghĩa với "Significant"?',
        options: ['Small', 'Important', 'Fast', 'Slow'],
        correctAnswer: 1,
        explanation: '"Significant" = quan trọng, đáng kể → "Important" là từ đồng nghĩa.'
    },
    {
        id: '3',
        type: 'grammar',
        question: 'Chọn đáp án đúng: She ___ to school every day.',
        options: ['go', 'goes', 'going', 'went'],
        correctAnswer: 1,
        explanation: 'Với chủ ngữ số ít (She) ở thì hiện tại đơn, động từ cần thêm "s".'
    },
    {
        id: '4',
        type: 'grammar',
        question: 'Câu nào đúng ngữ pháp?',
        options: [
            'I have been living here since 5 years.',
            'I have been living here for 5 years.',
            'I am living here since 5 years.',
            'I live here since 5 years.'
        ],
        correctAnswer: 1,
        explanation: 'Dùng "for" với khoảng thời gian (5 years), "since" với mốc thời gian cụ thể.'
    },
    {
        id: '5',
        type: 'fill_blank',
        question: 'Điền từ thích hợp: The meeting was ___ (postpone) until next week.',
        options: ['postponed', 'postponing', 'postpone', 'postpones'],
        correctAnswer: 0,
        explanation: 'Cấu trúc bị động: was + V3 (postponed).'
    },
]

export default function ReviewTestPage() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [answers, setAnswers] = useState<{ questionId: string; selected: number; correct: boolean }[]>([])
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
    const [isCompleted, setIsCompleted] = useState(false)

    const currentQuestion = mockQuestions[currentIndex]
    const progress = ((currentIndex + 1) / mockQuestions.length) * 100

    // Timer
    useEffect(() => {
        if (isCompleted || timeLeft <= 0) return

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsCompleted(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [isCompleted, timeLeft])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleSelectAnswer = (index: number) => {
        if (showResult) return
        setSelectedAnswer(index)
    }

    const handleSubmitAnswer = () => {
        if (selectedAnswer === null) return

        const isCorrect = selectedAnswer === currentQuestion.correctAnswer
        setAnswers([...answers, {
            questionId: currentQuestion.id,
            selected: selectedAnswer,
            correct: isCorrect
        }])
        setShowResult(true)
    }

    const handleNextQuestion = () => {
        if (currentIndex < mockQuestions.length - 1) {
            setCurrentIndex(currentIndex + 1)
            setSelectedAnswer(null)
            setShowResult(false)
        } else {
            setIsCompleted(true)
        }
    }

    const correctCount = answers.filter(a => a.correct).length
    const percentage = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0

    // Completed Screen
    if (isCompleted) {
        return (
            <Layout>
                <div className="page-header">
                    <h1 className="page-title">Kết quả bài test 🎯</h1>
                </div>

                <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
                        {percentage >= 80 ? '🏆' : percentage >= 60 ? '👍' : percentage >= 40 ? '💪' : '📚'}
                    </div>

                    <h2 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        {percentage}%
                    </h2>
                    <p style={{ color: 'var(--gray-500)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                        Bạn trả lời đúng {correctCount}/{mockQuestions.length} câu
                    </p>

                    <div className="progress-bar" style={{ marginBottom: '2rem', height: '12px' }}>
                        <div
                            className="progress-fill"
                            style={{
                                width: `${percentage}%`,
                                background: percentage >= 80 ? 'var(--accent-green)' :
                                    percentage >= 60 ? 'var(--primary-500)' :
                                        percentage >= 40 ? 'var(--accent-orange)' : 'var(--accent-red)'
                            }}
                        ></div>
                    </div>

                    {/* Review Answers */}
                    <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
                            Chi tiết đáp án
                        </h3>
                        {mockQuestions.map((q, idx) => {
                            const answer = answers.find(a => a.questionId === q.id)
                            return (
                                <div
                                    key={q.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '0.75rem',
                                        background: answer?.correct ? '#dcfce7' : '#fee2e2',
                                        borderRadius: '0.5rem',
                                        marginBottom: '0.5rem'
                                    }}
                                >
                                    {answer?.correct ? (
                                        <Check size={20} style={{ color: 'var(--accent-green)' }} />
                                    ) : (
                                        <X size={20} style={{ color: 'var(--accent-red)' }} />
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 500 }} className='text-gray-600'>Câu {idx + 1}</p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                                            {q.question.substring(0, 50)}...
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link href="/review/test" className="btn btn-primary">
                            <RotateCcw size={18} />
                            Làm lại
                        </Link>
                        <Link href="/review" className="btn btn-secondary">
                            Về trang ôn tập
                        </Link>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>Bài test ôn tập</h1>
                    <p style={{ color: 'var(--gray-500)' }}>
                        Câu {currentIndex + 1} / {mockQuestions.length}
                    </p>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    background: timeLeft < 60 ? '#fee2e2' : 'var(--gray-100)',
                    borderRadius: '0.75rem',
                    fontWeight: 600,
                    color: timeLeft < 60 ? 'var(--accent-red)' : 'gray'
                }}>
                    <Clock size={18} />
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar" style={{ marginBottom: '2rem' }}>
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Question Card */}
            <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
                {/* Question Type Badge */}
                <div style={{ marginBottom: '1rem' }}>
                    <span className={`badge ${currentQuestion.type === 'vocabulary' ? 'badge-blue' : 'badge-purple'}`}>
                        {currentQuestion.type === 'vocabulary' ? 'Từ vựng' :
                            currentQuestion.type === 'grammar' ? 'Ngữ pháp' : 'Điền từ'}
                    </span>
                </div>

                {/* Question */}
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    {currentQuestion.question}
                </h2>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {currentQuestion.options.map((option, idx) => {
                        let bgColor = 'var(--gray-50)'
                        let borderColor = 'var(--gray-200)'

                        if (showResult) {
                            if (idx === currentQuestion.correctAnswer) {
                                bgColor = '#dcfce7'
                                borderColor = 'var(--accent-green)'
                            } else if (idx === selectedAnswer && idx !== currentQuestion.correctAnswer) {
                                bgColor = '#fee2e2'
                                borderColor = 'var(--accent-red)'
                            }
                        } else if (selectedAnswer === idx) {
                            bgColor = 'var(--primary-50)'
                            borderColor = 'var(--primary-500)'
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleSelectAnswer(idx)}
                                disabled={showResult}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: bgColor,
                                    border: `2px solid ${borderColor}`,
                                    borderRadius: '0.75rem',
                                    cursor: showResult ? 'default' : 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <span style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: selectedAnswer === idx ? 'var(--primary-500)' : 'var(--gray-200)',
                                    color: selectedAnswer === idx ? 'white' : 'var(--gray-600)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 600,
                                }}>
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <span style={{ flex: 1 }} className='text-gray-600'>{option}</span>
                                {showResult && idx === currentQuestion.correctAnswer && (
                                    <Check size={20} style={{ color: 'var(--accent-green)' }} />
                                )}
                                {showResult && idx === selectedAnswer && idx !== currentQuestion.correctAnswer && (
                                    <X size={20} style={{ color: 'var(--accent-red)' }} />
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Explanation */}
                {showResult && (
                    <div style={{
                        padding: '1rem',
                        background: 'var(--primary-50)',
                        borderRadius: '0.75rem',
                        marginBottom: '1.5rem'
                    }}>
                        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>💡 Giải thích:</p>
                        <p style={{ color: 'var(--gray-700)' }}>{currentQuestion.explanation}</p>
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {!showResult ? (
                        <button
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                            onClick={handleSubmitAnswer}
                            disabled={selectedAnswer === null}
                        >
                            Kiểm tra đáp án
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                            onClick={handleNextQuestion}
                        >
                            {currentIndex < mockQuestions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
                            <ArrowRight size={18} />
                        </button>
                    )}
                </div>
            </div>
        </Layout>
    )
}
