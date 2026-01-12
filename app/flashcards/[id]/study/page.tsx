'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { Layout } from '@/components/Layout'
import { RotateCcw, Check, X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import TTSButton from '@/components/TTSButton'

interface Flashcard {
    id: string
    front: string
    back: string
    phonetic?: string
    audioUrl?: string
    example?: string
}

interface Deck {
    id: string
    name: string
    flashcards: Flashcard[]
}

export default function StudyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [deck, setDeck] = useState<Deck | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [results, setResults] = useState<{ id: string; correct: boolean }[]>([])

    // Fetch deck from API
    useEffect(() => {
        const fetchDeck = async () => {
            try {
                const response = await fetch(`/api/decks/${id}`)
                const data = await response.json()
                if (data.success) {
                    setDeck(data.deck)
                }
            } catch (error) {
                console.error('Failed to fetch deck:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchDeck()
    }, [id])

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === ' ') {
                e.preventDefault()
                handleFlip()
            } else if (e.key === 'ArrowLeft' && currentIndex > 0 && !isFlipped) {
                handlePrevious()
            } else if (e.key === 'ArrowRight' && currentIndex < cards.length - 1 && !isFlipped) {
                handleNext()
            } else if (e.key === '1' && isFlipped) {
                handleAnswer(false)
            } else if (e.key === '2' && isFlipped) {
                handleAnswer(true)
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [currentIndex, isFlipped])

    const cards = deck?.flashcards || []
    const currentCard = cards[currentIndex]
    const isCompleted = currentIndex >= cards.length

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    const handleAnswer = (correct: boolean) => {
        if (currentCard) {
            setResults([...results, { id: currentCard.id, correct }])
        }
        setIsFlipped(false)
        setCurrentIndex(currentIndex + 1)
    }

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1)
            setIsFlipped(false)
        }
    }

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
            setIsFlipped(false)
        }
    }

    const handleRestart = () => {
        setCurrentIndex(0)
        setResults([])
        setIsFlipped(false)
    }

    const correctCount = results.filter(r => r.correct).length
    const percentage = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0

    if (loading) {
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <div className="spinner"></div>
                </div>
            </Layout>
        )
    }

    if (!deck || cards.length === 0) {
        return (
            <Layout>
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</p>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        {deck ? 'Deck này chưa có thẻ nào' : 'Không tìm thấy deck'}
                    </h3>
                    <Link href="/flashcards" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Về danh sách
                    </Link>
                </div>
            </Layout>
        )
    }

    if (isCompleted) {
        return (
            <Layout>
                <div className="page-header">
                    <h1 className="page-title">Hoàn thành! 🎉</h1>
                </div>

                <div className="card" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                        {percentage >= 80 ? '🏆' : percentage >= 50 ? '👍' : '💪'}
                    </div>

                    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        {percentage}%
                    </h2>
                    <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>
                        Bạn đã nhớ {correctCount}/{cards.length} từ
                    </p>

                    <div className="progress-bar" style={{ marginBottom: '2rem' }}>
                        <div
                            className="progress-fill"
                            style={{
                                width: `${percentage}%`,
                                background: percentage >= 80 ? 'var(--accent-green)' : percentage >= 50 ? 'var(--primary-500)' : 'var(--accent-orange)'
                            }}
                        ></div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="btn btn-primary" onClick={handleRestart}>
                            <RotateCcw size={18} />
                            Học lại
                        </button>
                        <Link href="/flashcards" className="btn btn-secondary">
                            Về danh sách
                        </Link>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Học {deck.name}</h1>
                        <p className="page-subtitle">
                            Thẻ {currentIndex + 1} / {cards.length}
                        </p>
                    </div>
                    <Link href="/flashcards" className="btn btn-secondary">
                        Thoát
                    </Link>
                </div>
            </div>

            {/* Progress */}
            <div className="progress-bar" style={{ marginBottom: '2rem' }}>
                <div
                    className="progress-fill"
                    style={{ width: `${((currentIndex) / cards.length) * 100}%` }}
                ></div>
            </div>

            {/* Navigation Controls */}
            {!isFlipped && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '1rem',
                    marginBottom: '1.5rem'
                }}>
                    <button
                        className="btn btn-secondary"
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        title="Previous (←)"
                        style={{ minWidth: '100px' }}
                    >
                        <ChevronLeft size={18} />
                        Trước
                    </button>
                    
                    <div style={{ 
                        padding: '0.5rem 1rem',
                        background: 'var(--gray-100)',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: 'var(--gray-600)'
                    }}>
                        {currentIndex + 1} / {cards.length}
                    </div>

                    <button
                        className="btn btn-secondary"
                        onClick={handleNext}
                        disabled={currentIndex === cards.length - 1}
                        title="Next (→)"
                        style={{ minWidth: '100px' }}
                    >
                        Sau
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* Flashcard */}
            <div className="flashcard-container" style={{ marginBottom: '2rem' }}>
                <div
                    className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                    onClick={handleFlip}
                >
                    {/* Front - English */}
                    <div className="flashcard-face flashcard-front">
                        <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.5rem' }}>Tiếng Anh</p>
                        <p className="flashcard-word">{currentCard.front}</p>

                        {/* Phonetic */}
                        {currentCard.phonetic && (
                            <p style={{ fontSize: '1rem', opacity: 0.9, marginTop: '0.5rem' }}>
                                {currentCard.phonetic}
                            </p>
                        )}

                        {/* TTS Button - Always available */}
                        <div 
                            onClick={(e) => e.stopPropagation()} 
                            style={{ marginTop: '1rem' }}
                        >
                            <TTSButton text={currentCard.front} lang="en-US" />
                        </div>

                        <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '1rem' }}>
                            Nhấn để xem nghĩa (Space)
                        </p>
                    </div>

                    {/* Back - Vietnamese */}
                    <div className="flashcard-face flashcard-back">
                        <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.5rem' }}>Tiếng Việt</p>
                        <p className="flashcard-meaning">{currentCard.back}</p>

                        {/* Example sentence */}
                        {currentCard.example && (
                            <p style={{
                                fontSize: '0.9rem',
                                opacity: 0.85,
                                marginTop: '1rem',
                                fontStyle: 'italic',
                                maxWidth: '90%'
                            }}>
                                &ldquo;{currentCard.example}&rdquo;
                            </p>
                        )}

                        {/* TTS Button on back */}
                        <div 
                            onClick={(e) => e.stopPropagation()} 
                            style={{ marginTop: '1rem' }}
                        >
                            <TTSButton text={currentCard.front} lang="en-US" iconOnly />
                        </div>
                    </div>
                </div>
            </div>

            {/* Answer Buttons */}
            {isFlipped && (
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <button
                        className="btn btn-danger"
                        style={{ minWidth: '120px' }}
                        onClick={() => handleAnswer(false)}
                        title="Press 1"
                    >
                        <X size={18} />
                        Chưa nhớ (1)
                    </button>
                    <button
                        className="btn btn-success"
                        style={{ minWidth: '120px' }}
                        onClick={() => handleAnswer(true)}
                        title="Press 2"
                    >
                        <Check size={18} />
                        Đã nhớ (2)
                    </button>
                </div>
            )}

            {!isFlipped && (
                <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-primary" onClick={handleFlip}>
                        Xem đáp án (Space)
                        <ArrowRight size={18} />
                    </button>
                </div>
            )}

            {/* Keyboard shortcuts hint */}
            <div style={{ 
                marginTop: '2rem', 
                textAlign: 'center',
                fontSize: '0.85rem',
                color: 'var(--gray-500)'
            }}>
                <p>💡 Phím tắt: Space (lật thẻ) • ← → (chuyển thẻ) • 1 (chưa nhớ) • 2 (đã nhớ)</p>
            </div>
        </Layout>
    )
}
