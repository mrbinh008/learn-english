'use client'

import { Layout } from '@/components/Layout'
import { useState } from 'react'
import { BookOpen, FileText, ClipboardList, Loader2, CheckCircle, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Tab = 'vocabulary' | 'reading' | 'test'

export default function CreatePage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<Tab>('vocabulary')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Vocabulary state
    const [vocabWords, setVocabWords] = useState<string[]>([''])
    const [vocabCategory, setVocabCategory] = useState('general')

    // Reading state
    const [readingTopic, setReadingTopic] = useState('')
    const [readingLevel, setReadingLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
    const [readingCategory, setReadingCategory] = useState('general')

    // Test state
    const [testName, setTestName] = useState('')
    const [testType, setTestType] = useState<'vocabulary' | 'grammar' | 'reading' | 'mixed'>('mixed')
    const [testLevel, setTestLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
    const [testQuestionCount, setTestQuestionCount] = useState(20)
    const [testTimeLimit, setTestTimeLimit] = useState(30)

    const handleVocabSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const filteredWords = vocabWords.filter(w => w.trim())
            if (filteredWords.length === 0) {
                throw new Error('Vui lòng nhập ít nhất một từ')
            }

            const res = await fetch('/api/vocabulary/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    words: filteredWords,
                    category: vocabCategory
                })
            })

            const data = await res.json()
            
            if (!data.success) {
                throw new Error(data.error || 'Không thể tạo từ vựng')
            }

            setSuccess(`✅ Đã tạo ${data.count} từ vựng thành công!`)
            setVocabWords([''])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
        } finally {
            setLoading(false)
        }
    }

    const handleReadingSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            if (!readingTopic.trim()) {
                throw new Error('Vui lòng nhập chủ đề bài đọc')
            }

            const res = await fetch('/api/reading/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: readingTopic,
                    level: readingLevel,
                    category: readingCategory
                })
            })

            const data = await res.json()
            
            if (!data.success) {
                throw new Error(data.error || 'Không thể tạo bài đọc')
            }

            setSuccess(`✅ Đã tạo bài đọc "${data.passage.title}" thành công!`)
            setReadingTopic('')
            
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

    const handleTestSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            if (!testName.trim()) {
                throw new Error('Vui lòng nhập tên bài test')
            }

            const res = await fetch('/api/test/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: testName,
                    type: testType,
                    level: testLevel,
                    questionCount: testQuestionCount,
                    timeLimit: testTimeLimit
                })
            })

            const data = await res.json()
            
            if (!data.success) {
                throw new Error(data.error || 'Không thể tạo bài test')
            }

            setSuccess(`✅ Đã tạo bài test "${data.test.name}" với ${data.test.totalItems} câu hỏi!`)
            setTestName('')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <div className="page-header">
                <h1 className="page-title">Tạo nội dung mới ✨</h1>
                <p className="page-subtitle">
                    Sử dụng AI để tạo từ vựng, bài đọc, và bài test tự động
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--card-border)' }}>
                <button
                    onClick={() => setActiveTab('vocabulary')}
                    style={{
                        padding: '1rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'vocabulary' ? '3px solid var(--primary-500)' : 'none',
                        color: activeTab === 'vocabulary' ? 'var(--primary-500)' : 'var(--gray-500)',
                        fontWeight: activeTab === 'vocabulary' ? 600 : 400,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '-2px'
                    }}
                >
                    <BookOpen size={20} />
                    Từ vựng
                </button>
                <button
                    onClick={() => setActiveTab('reading')}
                    style={{
                        padding: '1rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'reading' ? '3px solid var(--primary-500)' : 'none',
                        color: activeTab === 'reading' ? 'var(--primary-500)' : 'var(--gray-500)',
                        fontWeight: activeTab === 'reading' ? 600 : 400,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '-2px'
                    }}
                >
                    <FileText size={20} />
                    Bài đọc
                </button>
                <button
                    onClick={() => setActiveTab('test')}
                    style={{
                        padding: '1rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'test' ? '3px solid var(--primary-500)' : 'none',
                        color: activeTab === 'test' ? 'var(--primary-500)' : 'var(--gray-500)',
                        fontWeight: activeTab === 'test' ? 600 : 400,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '-2px'
                    }}
                >
                    <ClipboardList size={20} />
                    Bài test
                </button>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="success-box" style={{ marginBottom: '1.5rem' }}>
                    <CheckCircle size={20} />
                    <p>{success}</p>
                </div>
            )}
            
            {error && (
                <div className="error-box" style={{ marginBottom: '1.5rem' }}>
                    <p>{error}</p>
                </div>
            )}

            {/* Vocabulary Form */}
            {activeTab === 'vocabulary' && (
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                        Tạo từ vựng mới
                    </h2>
                    <form onSubmit={handleVocabSubmit}>
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

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                Chủ đề
                            </label>
                            <select
                                value={vocabCategory}
                                onChange={(e) => setVocabCategory(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid var(--card-border)',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="general">Chung</option>
                                <option value="daily">Hàng ngày</option>
                                <option value="travel">Du lịch</option>
                                <option value="business">Công việc</option>
                                <option value="academic">Học thuật</option>
                                <option value="technology">Công nghệ</option>
                                <option value="health">Sức khỏe</option>
                            </select>
                        </div>

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
            )}

            {/* Reading Form */}
            {activeTab === 'reading' && (
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                        Tạo bài đọc mới
                    </h2>
                    <form onSubmit={handleReadingSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                Chủ đề bài đọc
                            </label>
                            <input
                                type="text"
                                value={readingTopic}
                                onChange={(e) => setReadingTopic(e.target.value)}
                                placeholder="VD: The benefits of reading books"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid var(--card-border)',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    Độ khó
                                </label>
                                <select
                                    value={readingLevel}
                                    onChange={(e) => setReadingLevel(e.target.value as any)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid var(--card-border)',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <option value="beginner">Cơ bản</option>
                                    <option value="intermediate">Trung cấp</option>
                                    <option value="advanced">Nâng cao</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    Thể loại
                                </label>
                                <select
                                    value={readingCategory}
                                    onChange={(e) => setReadingCategory(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid var(--card-border)',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <option value="general">Chung</option>
                                    <option value="news">Tin tức</option>
                                    <option value="story">Truyện</option>
                                    <option value="science">Khoa học</option>
                                    <option value="technology">Công nghệ</option>
                                    <option value="business">Kinh doanh</option>
                                    <option value="health">Sức khỏe</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%' }}
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
            )}

            {/* Test Form */}
            {activeTab === 'test' && (
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                        Tạo bài test mới
                    </h2>
                    <form onSubmit={handleTestSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                Tên bài test
                            </label>
                            <input
                                type="text"
                                value={testName}
                                onChange={(e) => setTestName(e.target.value)}
                                placeholder="VD: Test từ vựng cơ bản"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid var(--card-border)',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    Loại test
                                </label>
                                <select
                                    value={testType}
                                    onChange={(e) => setTestType(e.target.value as any)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid var(--card-border)',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <option value="mixed">Tổng hợp</option>
                                    <option value="vocabulary">Từ vựng</option>
                                    <option value="grammar">Ngữ pháp</option>
                                    <option value="reading">Đọc hiểu</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    Độ khó
                                </label>
                                <select
                                    value={testLevel}
                                    onChange={(e) => setTestLevel(e.target.value as any)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid var(--card-border)',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <option value="beginner">Cơ bản</option>
                                    <option value="intermediate">Trung cấp</option>
                                    <option value="advanced">Nâng cao</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    Số câu hỏi
                                </label>
                                <input
                                    type="number"
                                    value={testQuestionCount}
                                    onChange={(e) => setTestQuestionCount(parseInt(e.target.value))}
                                    min="5"
                                    max="50"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid var(--card-border)',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    Giới hạn thời gian (phút)
                                </label>
                                <input
                                    type="number"
                                    value={testTimeLimit}
                                    onChange={(e) => setTestTimeLimit(parseInt(e.target.value))}
                                    min="5"
                                    max="120"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid var(--card-border)',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%' }}
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
            )}
        </Layout>
    )
}
