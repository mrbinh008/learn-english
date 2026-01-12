'use client'

import { Layout } from '@/components/Layout'
import { useState } from 'react'
import { BookOpen, FileText, ClipboardList, Loader2, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { TabButton, FormInput, FormSelect, Alert } from '@/components/ui'
import type { Level } from '@/lib/types'

type Tab = 'vocabulary' | 'reading' | 'test'

// ============================================
// CONSTANTS
// ============================================

const VOCAB_CATEGORIES = [
    { value: 'general', label: 'Chung' },
    { value: 'daily', label: 'Hàng ngày' },
    { value: 'travel', label: 'Du lịch' },
    { value: 'business', label: 'Công việc' },
    { value: 'academic', label: 'Học thuật' },
    { value: 'technology', label: 'Công nghệ' },
    { value: 'health', label: 'Sức khỏe' }
]

const READING_CATEGORIES = [
    { value: 'general', label: 'Chung' },
    { value: 'news', label: 'Tin tức' },
    { value: 'story', label: 'Truyện' },
    { value: 'science', label: 'Khoa học' },
    { value: 'technology', label: 'Công nghệ' },
    { value: 'business', label: 'Kinh doanh' },
    { value: 'health', label: 'Sức khỏe' }
]

const LEVEL_OPTIONS = [
    { value: 'beginner', label: 'Cơ bản' },
    { value: 'intermediate', label: 'Trung cấp' },
    { value: 'advanced', label: 'Nâng cao' }
]

const TEST_TYPES = [
    { value: 'mixed', label: 'Tổng hợp' },
    { value: 'vocabulary', label: 'Từ vựng' },
    { value: 'grammar', label: 'Ngữ pháp' },
    { value: 'reading', label: 'Đọc hiểu' }
]

// ============================================
// SUB-COMPONENTS
// ============================================

interface VocabularyFormProps {
    loading: boolean
    onSubmit: (words: string[], category: string) => Promise<void>
}

function VocabularyForm({ loading, onSubmit }: VocabularyFormProps) {
    const [vocabWords, setVocabWords] = useState<string[]>([''])
    const [vocabCategory, setVocabCategory] = useState('general')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const filteredWords = vocabWords.filter(w => w.trim())
        if (filteredWords.length === 0) {
            return
        }
        await onSubmit(filteredWords, vocabCategory)
        setVocabWords([''])
    }

    return (
        <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                Tạo từ vựng mới
            </h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Danh sách từ vựng (tiếng Anh)
                    </label>
                    {vocabWords.map((word, index) => (
                        <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input
                                type="text"
                                value={word}
                                onChange={(e) => {
                                    const newWords = [...vocabWords]
                                    newWords[index] = e.target.value
                                    setVocabWords(newWords)
                                }}
                                placeholder="example"
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    border: '2px solid var(--card-border)',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem'
                                }}
                            />
                            {vocabWords.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newWords = vocabWords.filter((_, i) => i !== index)
                                        setVocabWords(newWords)
                                    }}
                                    style={{
                                        padding: '0.75rem',
                                        border: '2px solid var(--accent-red)',
                                        borderRadius: '0.5rem',
                                        background: 'white',
                                        cursor: 'pointer',
                                        color: 'var(--accent-red)'
                                    }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => setVocabWords([...vocabWords, ''])}
                        className="btn btn-secondary"
                        style={{ marginTop: '0.5rem' }}
                    >
                        <Plus size={18} />
                        Thêm từ
                    </button>
                </div>

                <FormSelect
                    label="Chủ đề"
                    value={vocabCategory}
                    onChange={(e) => setVocabCategory(e.target.value)}
                    options={VOCAB_CATEGORIES}
                />

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ width: '100%' }}
                >
                    {loading ? (
                        <>
                            <Loader2 className="spinner" size={18} />
                            Đang tạo...
                        </>
                    ) : (
                        <>
                            <BookOpen size={18} />
                            Tạo từ vựng với AI
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}

interface ReadingFormProps {
    loading: boolean
    onSubmit: (topic: string, level: Level, category: string) => Promise<void>
}

function ReadingForm({ loading, onSubmit }: ReadingFormProps) {
    const [readingTopic, setReadingTopic] = useState('')
    const [readingLevel, setReadingLevel] = useState<Level>('intermediate')
    const [readingCategory, setReadingCategory] = useState('general')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!readingTopic.trim()) return
        await onSubmit(readingTopic, readingLevel, readingCategory)
        setReadingTopic('')
    }

    return (
        <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                Tạo bài đọc mới
            </h2>
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Chủ đề bài đọc"
                    value={readingTopic}
                    onChange={(e) => setReadingTopic(e.target.value)}
                    placeholder="VD: The benefits of reading books"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormSelect
                        label="Độ khó"
                        value={readingLevel}
                        onChange={(e) => setReadingLevel(e.target.value as Level)}
                        options={LEVEL_OPTIONS}
                        wrapperStyle={{ marginBottom: 0 }}
                    />

                    <FormSelect
                        label="Thể loại"
                        value={readingCategory}
                        onChange={(e) => setReadingCategory(e.target.value)}
                        options={READING_CATEGORIES}
                        wrapperStyle={{ marginBottom: 0 }}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ width: '100%', marginTop: '1.5rem' }}
                >
                    {loading ? (
                        <>
                            <Loader2 className="spinner" size={18} />
                            Đang tạo bài đọc...
                        </>
                    ) : (
                        <>
                            <FileText size={18} />
                            Tạo bài đọc với AI
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}

interface TestFormProps {
    loading: boolean
    onSubmit: (name: string, type: string, level: Level, questionCount: number, timeLimit: number) => Promise<void>
}

function TestForm({ loading, onSubmit }: TestFormProps) {
    const [testName, setTestName] = useState('')
    const [testType, setTestType] = useState('mixed')
    const [testLevel, setTestLevel] = useState<Level>('intermediate')
    const [testQuestionCount, setTestQuestionCount] = useState(20)
    const [testTimeLimit, setTestTimeLimit] = useState(30)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!testName.trim()) return
        await onSubmit(testName, testType, testLevel, testQuestionCount, testTimeLimit)
        setTestName('')
    }

    return (
        <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                Tạo bài test mới
            </h2>
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Tên bài test"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="VD: Test từ vựng cơ bản"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormSelect
                        label="Loại test"
                        value={testType}
                        onChange={(e) => setTestType(e.target.value)}
                        options={TEST_TYPES}
                        wrapperStyle={{ marginBottom: 0 }}
                    />

                    <FormSelect
                        label="Độ khó"
                        value={testLevel}
                        onChange={(e) => setTestLevel(e.target.value as Level)}
                        options={LEVEL_OPTIONS}
                        wrapperStyle={{ marginBottom: 0 }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                    <FormInput
                        label="Số câu hỏi"
                        type="number"
                        value={testQuestionCount}
                        onChange={(e) => setTestQuestionCount(parseInt(e.target.value))}
                        min={5}
                        max={50}
                        wrapperStyle={{ marginBottom: 0 }}
                    />

                    <FormInput
                        label="Giới hạn thời gian (phút)"
                        type="number"
                        value={testTimeLimit}
                        onChange={(e) => setTestTimeLimit(parseInt(e.target.value))}
                        min={5}
                        max={120}
                        wrapperStyle={{ marginBottom: 0 }}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ width: '100%', marginTop: '1.5rem' }}
                >
                    {loading ? (
                        <>
                            <Loader2 className="spinner" size={18} />
                            Đang tạo bài test...
                        </>
                    ) : (
                        <>
                            <ClipboardList size={18} />
                            Tạo bài test với AI
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function CreatePage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<Tab>('vocabulary')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const clearMessages = () => {
        setSuccess(null)
        setError(null)
    }

    const handleVocabSubmit = async (words: string[], category: string) => {
        setLoading(true)
        clearMessages()

        try {
            if (words.length === 0) {
                throw new Error('Vui lòng nhập ít nhất một từ')
            }

            const res = await fetch('/api/vocabulary/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ words, category })
            })

            const data = await res.json()

            if (!data.success) {
                throw new Error(data.error || 'Không thể tạo từ vựng')
            }

            setSuccess(`Đã tạo ${data.count} từ vựng thành công!`)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
        } finally {
            setLoading(false)
        }
    }

    const handleReadingSubmit = async (topic: string, level: Level, category: string) => {
        setLoading(true)
        clearMessages()

        try {
            if (!topic.trim()) {
                throw new Error('Vui lòng nhập chủ đề bài đọc')
            }

            const res = await fetch('/api/reading/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, level, category })
            })

            const data = await res.json()

            if (!data.success) {
                throw new Error(data.error || 'Không thể tạo bài đọc')
            }

            setSuccess(`Đã tạo bài đọc "${data.passage.title}" thành công!`)

            // Redirect to the new reading passage
            setTimeout(() => {
                router.push(`/reading/${data.passage.id}`)
            }, 2000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
        } finally {
            setLoading(false)
        }
    }

    const handleTestSubmit = async (name: string, type: string, level: Level, questionCount: number, timeLimit: number) => {
        setLoading(true)
        clearMessages()

        try {
            if (!name.trim()) {
                throw new Error('Vui lòng nhập tên bài test')
            }

            const res = await fetch('/api/test/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, type, level, questionCount, timeLimit })
            })

            const data = await res.json()

            if (!data.success) {
                throw new Error(data.error || 'Không thể tạo bài test')
            }

            setSuccess(`Đã tạo bài test "${data.test.name}" với ${data.test.totalItems} câu hỏi!`)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <div className="page-header">
                <h1 className="page-title">Tạo nội dung mới</h1>
                <p className="page-subtitle">
                    Sử dụng AI để tạo từ vựng, bài đọc, và bài test tự động
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--card-border)' }}>
                <TabButton
                    active={activeTab === 'vocabulary'}
                    onClick={() => setActiveTab('vocabulary')}
                    icon={<BookOpen size={20} />}
                >
                    Từ vựng
                </TabButton>
                <TabButton
                    active={activeTab === 'reading'}
                    onClick={() => setActiveTab('reading')}
                    icon={<FileText size={20} />}
                >
                    Bài đọc
                </TabButton>
                <TabButton
                    active={activeTab === 'test'}
                    onClick={() => setActiveTab('test')}
                    icon={<ClipboardList size={20} />}
                >
                    Bài test
                </TabButton>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <Alert variant="success" onDismiss={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            {error && (
                <Alert variant="error" onDismiss={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Tab Content */}
            {activeTab === 'vocabulary' && (
                <VocabularyForm loading={loading} onSubmit={handleVocabSubmit} />
            )}

            {activeTab === 'reading' && (
                <ReadingForm loading={loading} onSubmit={handleReadingSubmit} />
            )}

            {activeTab === 'test' && (
                <TestForm loading={loading} onSubmit={handleTestSubmit} />
            )}
        </Layout>
    )
}
