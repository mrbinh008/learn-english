'use client'

import { useState, useEffect, useCallback } from 'react'
import { Layout } from '@/components/Layout'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Languages, Loader2, Bookmark } from 'lucide-react'
import TTSButton from '@/components/TTSButton'
import { LoadingSpinner, Modal, LevelBadge } from '@/components/ui'
import type { ReadingPassage, VocabularyItem, WordData, Question, Level } from '@/lib/types'

// ============================================
// SUB-COMPONENTS
// ============================================

interface DictionarySidebarProps {
    selectedWord: string | null
    wordData: WordData | null
    loading: boolean
}

function DictionarySidebar({ selectedWord, wordData, loading }: DictionarySidebarProps) {
    return (
        <div className="card" style={{ position: 'sticky', top: '1rem' }}>
            <h3 style={{
                fontSize: '1rem',
                fontWeight: 600,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <BookOpen size={18} />
                Tra từ
            </h3>

            {loading && (
                <div className="flex items-center justify-center p-8">
                    <LoadingSpinner />
                </div>
            )}

            {!loading && selectedWord && wordData ? (
                <div>
                    {/* Word Header */}
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{selectedWord}</span>
                            <TTSButton text={selectedWord} iconOnly />
                        </div>
                        {wordData.phonetic && (
                            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                                {wordData.phonetic}
                            </p>
                        )}
                        {wordData.partOfSpeech && (
                            <span className="badge badge-blue" style={{ marginTop: '0.5rem' }}>
                                {wordData.partOfSpeech}
                            </span>
                        )}
                    </div>

                    {/* Vietnamese Translation */}
                    <div style={{
                        padding: '0.75rem',
                        background: 'var(--primary-50)',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem'
                    }}>
                        <p style={{ fontWeight: 600, color: 'var(--primary-700)', fontSize: '1.1rem' }}>
                            {wordData.vietnamese}
                        </p>
                    </div>

                    {/* Definitions */}
                    {wordData.definitions?.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                            <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                Định nghĩa:
                            </h4>
                            <ul style={{ paddingLeft: '1.25rem', color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                                {wordData.definitions.map((def, i) => (
                                    <li key={i} style={{ marginBottom: '0.25rem' }}>{def}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Examples */}
                    {wordData.examples?.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                            <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                Ví dụ:
                            </h4>
                            {wordData.examples.map((ex, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: '0.5rem',
                                        background: 'var(--gray-50)',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.85rem',
                                        fontStyle: 'italic',
                                        color: 'var(--gray-600)',
                                        marginBottom: '0.5rem'
                                    }}
                                >
                                    {ex}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Synonyms */}
                    {wordData.synonyms?.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                            <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                Từ đồng nghĩa:
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                {wordData.synonyms.map((syn, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            padding: '0.25rem 0.5rem',
                                            background: '#dcfce7',
                                            color: '#166534',
                                            fontSize: '0.8rem',
                                            borderRadius: '0.25rem'
                                        }}
                                    >
                                        {syn}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Antonyms */}
                    {wordData.antonyms?.length > 0 && (
                        <div>
                            <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                Từ trái nghĩa:
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                {wordData.antonyms.map((ant, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            padding: '0.25rem 0.5rem',
                                            background: '#fee2e2',
                                            color: '#991b1b',
                                            fontSize: '0.8rem',
                                            borderRadius: '0.25rem'
                                        }}
                                    >
                                        {ant}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : !loading && !selectedWord ? (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'var(--gray-500)',
                    fontSize: '0.9rem'
                }}>
                    <p style={{ marginBottom: '0.5rem' }}>
                        Bôi đen từ bất kỳ trong bài để tra nghĩa
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>
                        Từ sẽ tự động được lưu vào từ vựng
                    </p>
                </div>
            ) : null}
        </div>
    )
}

// Quiz Modal Content
interface QuizModalProps {
    isOpen: boolean
    onClose: () => void
    questions: Question[]
}

function QuizModal({ isOpen, onClose, questions }: QuizModalProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [score, setScore] = useState(0)

    const handleReset = useCallback(() => {
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setShowResult(false)
        setScore(0)
        onClose()
    }, [onClose])

    const handleSubmitAnswer = () => {
        if (selectedAnswer === null) return
        const correctAnswer = questions[currentQuestion].correctAnswer ?? 0
        if (selectedAnswer === correctAnswer) {
            setScore(prev => prev + 1)
        }
        setShowResult(true)
    }

    const handleNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1)
            setSelectedAnswer(null)
            setShowResult(false)
        }
    }

    const currentQ = questions[currentQuestion]
    const correctAnswerIdx = currentQ?.correctAnswer ?? 0

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleReset}
            title={`Câu hỏi đọc hiểu (${currentQuestion + 1}/${questions.length})`}
            maxWidth="600px"
        >
            {currentQ && (
                <>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                        {currentQ.question}
                    </p>
                    {currentQ.questionVi && (
                        <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem', color: 'var(--gray-600)' }}>
                            {currentQ.questionVi}
                        </p>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {currentQ.options.map((option, idx) => {
                            const isCorrect = idx === correctAnswerIdx
                            const isSelected = idx === selectedAnswer
                            const isWrong = showResult && isSelected && !isCorrect

                            return (
                                <button
                                    key={idx}
                                    onClick={() => !showResult && setSelectedAnswer(idx)}
                                    style={{
                                        padding: '1rem',
                                        border: `2px solid ${showResult && isCorrect
                                            ? '#16a34a'
                                            : isWrong
                                                ? '#dc2626'
                                                : isSelected
                                                    ? 'var(--primary-500)'
                                                    : 'var(--gray-200)'
                                            }`,
                                        borderRadius: '0.5rem',
                                        background: showResult && isCorrect
                                            ? '#dcfce7'
                                            : isWrong
                                                ? '#fee2e2'
                                                : 'var(--card-bg)',
                                        textAlign: 'left',
                                        cursor: showResult ? 'default' : 'pointer',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {showResult && isCorrect && <span style={{ fontSize: '1.2rem' }}>✅</span>}
                                            {isWrong && <span style={{ fontSize: '1.2rem' }}>❌</span>}
                                            <span className='text-gray-500'>{option}</span>
                                        </div>
                                        {showResult && isCorrect && (
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                background: '#22c55e',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '0.25rem',
                                                color: 'white'
                                            }}>
                                                ĐÚNG
                                            </span>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    {showResult && (
                        <div style={{
                            padding: '1rem',
                            background: selectedAnswer === correctAnswerIdx ? '#dcfce7' : '#fef3c7',
                            borderRadius: '0.5rem',
                            marginBottom: '1rem',
                            border: `2px solid ${selectedAnswer === correctAnswerIdx ? '#16a34a' : '#f59e0b'}`
                        }}>
                            {selectedAnswer === correctAnswerIdx ? (
                                <p style={{ fontWeight: 600, color: '#166534', marginBottom: '0.5rem' }}>
                                    🎉 Chính xác!
                                </p>
                            ) : (
                                <>
                                    <p style={{ fontWeight: 600, color: '#92400e', marginBottom: '0.5rem' }}>
                                        ❌ Không chính xác
                                    </p>
                                    <p style={{ color: '#166534', marginBottom: '0.5rem' }}>
                                        <strong>Đáp án đúng:</strong> {currentQ.options[correctAnswerIdx]}
                                    </p>
                                </>
                            )}
                            {currentQ.explanation && (
                                <>
                                    <p style={{ fontWeight: 600, marginBottom: '0.5rem' }} className='text-gray-400'>💡 Giải thích:</p>
                                    <p style={{ color: 'var(--gray-700)' }}>{currentQ.explanation}</p>
                                </>
                            )}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {!showResult ? (
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                onClick={handleSubmitAnswer}
                                disabled={selectedAnswer === null}
                            >
                                Kiểm tra
                            </button>
                        ) : currentQuestion < questions.length - 1 ? (
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                onClick={handleNextQuestion}
                            >
                                Câu tiếp theo
                            </button>
                        ) : (
                            <button
                                className="btn btn-success"
                                style={{ flex: 1 }}
                                onClick={handleReset}
                            >
                                Hoàn thành ({score}/{questions.length} đúng)
                            </button>
                        )}
                    </div>
                </>
            )}
        </Modal>
    )
}

// Vocabulary Tooltip
interface VocabularyTooltipProps {
    vocab: VocabularyItem
    position: { x: number; y: number }
}

function VocabularyTooltip({ vocab, position }: VocabularyTooltipProps) {
    const safeX = typeof window !== 'undefined' ? Math.min(position.x + 10, window.innerWidth - 320) : position.x + 10
    const safeY = typeof window !== 'undefined' ? Math.min(position.y + 10, window.innerHeight - 250) : position.y + 10

    return (
        <div style={{
            position: 'fixed',
            left: safeX,
            top: safeY,
            zIndex: 9999,
            background: 'white',
            border: '2px solid #fbbf24',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            maxWidth: '300px',
            pointerEvents: 'none'
        }}>
            <p style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '1.1rem' }}>
                {vocab.word}
            </p>
            <p style={{ color: '#2563eb', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                {vocab.vietnamese}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: vocab.example ? '0.5rem' : 0 }}>
                {vocab.definition}
            </p>
            {vocab.example && (
                <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#6b7280' }}>
                    "{vocab.example}"
                </p>
            )}
        </div>
    )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ReadingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [passageId, setPassageId] = useState<string | null>(null)
    const [passage, setPassage] = useState<ReadingPassage | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedWord, setSelectedWord] = useState<string | null>(null)
    const [wordData, setWordData] = useState<WordData | null>(null)
    const [loadingWord, setLoadingWord] = useState(false)
    const [showTranslation, setShowTranslation] = useState(false)
    const [loadingTranslation, setLoadingTranslation] = useState(false)
    const [showQuiz, setShowQuiz] = useState(false)
    const [hoveredVocab, setHoveredVocab] = useState<VocabularyItem | null>(null)
    const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null)

    // Unwrap params
    useEffect(() => {
        params.then(p => setPassageId(p.id))
    }, [params])

    // Fetch passage data
    useEffect(() => {
        if (!passageId) return

        const fetchPassage = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/reading/${passageId}`)
                if (!response.ok) throw new Error('Failed to fetch passage')
                const data = await response.json()

                // Parse questions and convert answer text to index
                let questions = typeof data.questions === 'string'
                    ? JSON.parse(data.questions)
                    : data.questions

                // Parse vocabulary
                const vocabulary = data.vocabulary
                    ? (typeof data.vocabulary === 'string'
                        ? JSON.parse(data.vocabulary)
                        : data.vocabulary)
                    : []

                // Convert answer (text) to correctAnswer (index)
                if (questions && Array.isArray(questions)) {
                    questions = questions.map((q: Question & { answer?: string }) => {
                        let correctAnswer = q.correctAnswer

                        // If correctAnswer doesn't exist but answer does, find the index
                        if (correctAnswer === undefined && q.answer) {
                            correctAnswer = q.options.findIndex((opt: string) => opt === q.answer)
                        }

                        return {
                            ...q,
                            correctAnswer: correctAnswer !== undefined && correctAnswer >= 0 ? correctAnswer : 0
                        }
                    })
                }

                setPassage({
                    ...data,
                    questions,
                    vocabulary
                })
            } catch (error) {
                console.error('Error fetching passage:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPassage()
    }, [passageId])

    // Handle text selection for dictionary lookup
    useEffect(() => {
        const handleSelection = async () => {
            const selection = window.getSelection()
            const text = selection?.toString().trim()

            if (text && text.length > 0 && text.split(' ').length === 1) {
                const cleanWord = text.replace(/[.,!?;:'"()]/g, '').toLowerCase()
                if (cleanWord.length > 1) {
                    setSelectedWord(cleanWord)
                    setLoadingWord(true)
                    setWordData(null)

                    try {
                        const response = await fetch('/api/dictionary/lookup', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                word: cleanWord,
                                saveToDb: true
                            })
                        })

                        if (response.ok) {
                            const data = await response.json()
                            setWordData(data.word)
                        }
                    } catch (error) {
                        console.error('Error looking up word:', error)
                    } finally {
                        setLoadingWord(false)
                    }
                }
            }
        }

        document.addEventListener('mouseup', handleSelection)
        return () => document.removeEventListener('mouseup', handleSelection)
    }, [])

    const handleTranslationToggle = async () => {
        if (!passage) return

        if (showTranslation) {
            setShowTranslation(false)
            return
        }

        if (passage.translation) {
            setShowTranslation(true)
            return
        }

        setLoadingTranslation(true)
        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: passage.content })
            })

            if (response.ok) {
                const data = await response.json()
                setPassage({ ...passage, translation: data.translation })
                setShowTranslation(true)
            }
        } catch (error) {
            console.error('Translation error:', error)
        } finally {
            setLoadingTranslation(false)
        }
    }

    // Render content with vocabulary highlighting
    const renderContentWithVocabulary = useCallback(() => {
        if (!passage) return null

        const vocabulary = passage.vocabulary || []
        if (vocabulary.length === 0) {
            return passage.content
        }

        // Create a map for quick lookup
        const vocabMap = new Map<string, VocabularyItem>()
        vocabulary.forEach(item => {
            vocabMap.set(item.word.toLowerCase(), item)
        })

        // Split content into paragraphs
        const paragraphs = passage.content.split('\n\n')

        return paragraphs.map((para, paraIdx) => {
            // Split paragraph into words and spaces
            const parts = para.split(/(\s+)/)
            const rendered: React.ReactNode[] = []
            let skipNext = 0

            for (let idx = 0; idx < parts.length; idx++) {
                if (skipNext > 0) {
                    skipNext--
                    continue
                }

                const part = parts[idx]
                if (part.match(/^\s+$/)) {
                    rendered.push(<span key={idx}>{part}</span>)
                    continue
                }

                // Check for multi-word phrases first (up to 3 words)
                const cleanWord = part.replace(/[.,!?;:'"()]/g, '').toLowerCase()
                let vocabItem: VocabularyItem | undefined
                let wordsMatched = 1

                // Try 3-word phrase
                if (idx + 4 < parts.length) {
                    const word2 = parts[idx + 2]?.replace(/[.,!?;:'"()]/g, '').toLowerCase() || ''
                    const word3 = parts[idx + 4]?.replace(/[.,!?;:'"()]/g, '').toLowerCase() || ''
                    const threeWords = `${cleanWord} ${word2} ${word3}`
                    if (vocabMap.has(threeWords)) {
                        vocabItem = vocabMap.get(threeWords)
                        wordsMatched = 3
                    }
                }

                // Try 2-word phrase
                if (!vocabItem && idx + 2 < parts.length) {
                    const word2 = parts[idx + 2]?.replace(/[.,!?;:'"()]/g, '').toLowerCase() || ''
                    const twoWords = `${cleanWord} ${word2}`
                    if (vocabMap.has(twoWords)) {
                        vocabItem = vocabMap.get(twoWords)
                        wordsMatched = 2
                    }
                }

                // Try single word
                if (!vocabItem) {
                    vocabItem = vocabMap.get(cleanWord)
                }

                if (vocabItem) {
                    // Collect all parts that make up the phrase
                    const phraseParts = [part]
                    for (let j = 1; j < wordsMatched * 2; j++) {
                        if (idx + j < parts.length) {
                            phraseParts.push(parts[idx + j])
                        }
                    }

                    const item = vocabItem // Capture for closure
                    rendered.push(
                        <span
                            key={idx}
                            onMouseEnter={(e) => {
                                setHoveredVocab(item)
                                setTooltipPosition({ x: e.clientX, y: e.clientY })
                            }}
                            onMouseLeave={() => {
                                setHoveredVocab(null)
                                setTooltipPosition(null)
                            }}
                            style={{
                                background: 'linear-gradient(180deg, transparent 60%, #fef08a 60%)',
                                cursor: 'help',
                                fontWeight: 500,
                                position: 'relative'
                            }}
                        >
                            {phraseParts.join('')}
                        </span>
                    )

                    skipNext = (wordsMatched * 2) - 1
                } else {
                    rendered.push(<span key={idx}>{part}</span>)
                }
            }

            return (
                <p key={paraIdx} style={{ marginBottom: paraIdx < paragraphs.length - 1 ? '1rem' : 0 }}>
                    {rendered}
                </p>
            )
        })
    }, [passage])

    // Loading state
    if (loading) {
        return (
            <Layout>
                <LoadingSpinner fullPage text="Đang tải bài đọc..." />
            </Layout>
        )
    }

    // Not found state
    if (!passage) {
        return (
            <Layout>
                <div className="card text-center">
                    <p className="text-gray-600">Không tìm thấy bài đọc</p>
                    <Link href="/reading" className="btn btn-primary mt-4">
                        Quay lại
                    </Link>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <Link href="/reading" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                    <ArrowLeft size={20} />
                </Link>
                <div style={{ flex: 1 }}>
                    <h1 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                        {passage.title}
                    </h1>
                    {passage.titleVi && (
                        <p style={{ color: 'var(--gray-500)' }}>{passage.titleVi}</p>
                    )}
                </div>
                <button className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                    <Bookmark size={20} />
                </button>
            </div>

            {/* Meta & Controls */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <LevelBadge level={passage.level as Level} />
                <span className="badge badge-blue">{passage.category}</span>

                <button
                    onClick={handleTranslationToggle}
                    className="btn btn-secondary"
                    disabled={loadingTranslation}
                    style={{ marginLeft: 'auto' }}
                >
                    {loadingTranslation ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Languages size={18} />
                    )}
                    {showTranslation ? 'Ẩn bản dịch' : 'Hiện bản dịch'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
                {/* Reading Content */}
                <div className="card">
                    <div style={{
                        fontSize: '1.1rem',
                        lineHeight: 1.8,
                        whiteSpace: 'pre-wrap',
                        marginBottom: showTranslation ? '2rem' : 0,
                        userSelect: 'text',
                        cursor: 'text'
                    }}>
                        {renderContentWithVocabulary()}
                    </div>

                    {/* Translation */}
                    {showTranslation && passage.translation && (
                        <div style={{
                            paddingTop: '2rem',
                            borderTop: '2px solid var(--primary-200)',
                            marginTop: '2rem'
                        }}>
                            <h3 style={{
                                fontSize: '1rem',
                                fontWeight: 600,
                                marginBottom: '1rem',
                                color: 'var(--primary-600)'
                            }}>
                                Bản dịch tiếng Việt:
                            </h3>
                            <div style={{
                                fontSize: '1rem',
                                lineHeight: 1.8,
                                whiteSpace: 'pre-wrap',
                                color: 'var(--gray-700)'
                            }}>
                                {passage.translation}
                            </div>
                        </div>
                    )}

                    {/* Vocabulary Legend */}
                    {passage.vocabulary && passage.vocabulary.length > 0 && (
                        <div style={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            background: '#fffbeb',
                            borderRadius: '0.5rem',
                            border: '1px solid #fcd34d'
                        }}>
                            <p style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                💡 Từ vựng quan trọng ({passage.vocabulary.length} từ)
                            </p>
                            <p style={{ fontSize: '0.85rem', color: '#92400e' }}>
                                Từ được <span style={{ background: 'linear-gradient(180deg, transparent 60%, #fef08a 60%)', padding: '0 2px' }}>tô vàng</span> có nghĩa.
                                Di chuột vào để xem định nghĩa.
                            </p>
                        </div>
                    )}

                    {/* Quiz Button */}
                    {passage.questions && passage.questions.length > 0 && (
                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)' }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowQuiz(true)}
                            >
                                <BookOpen size={18} />
                                Làm bài tập đọc hiểu ({passage.questions.length} câu)
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar - Dictionary */}
                <div>
                    <DictionarySidebar
                        selectedWord={selectedWord}
                        wordData={wordData}
                        loading={loadingWord}
                    />
                </div>
            </div>

            {/* Quiz Modal */}
            {passage.questions && passage.questions.length > 0 && (
                <QuizModal
                    isOpen={showQuiz}
                    onClose={() => setShowQuiz(false)}
                    questions={passage.questions}
                />
            )}

            {/* Vocabulary Hover Tooltip */}
            {hoveredVocab && tooltipPosition && (
                <VocabularyTooltip vocab={hoveredVocab} position={tooltipPosition} />
            )}
        </Layout>
    )
}
