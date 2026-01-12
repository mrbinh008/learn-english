'use client'

import { Layout } from '@/components/Layout'
import { useState } from 'react'
import { ArrowLeft, Loader2, Zap, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
    { value: 'general', label: 'Chung', icon: '📚', description: 'Từ vựng tổng quát đa dạng' },
    { value: 'daily', label: 'Giao tiếp hàng ngày', icon: '💬', description: 'Gia đình, bạn bè, hoạt động thường ngày' },
    { value: 'travel', label: 'Du lịch', icon: '✈️', description: 'Máy bay, khách sạn, phương tiện' },
    { value: 'business', label: 'Công việc', icon: '💼', description: 'Văn phòng, họp hành, email' },
    { value: 'academic', label: 'Học thuật', icon: '🎓', description: 'Nghiên cứu, giáo dục, khoa học' },
    { value: 'technology', label: 'Công nghệ', icon: '💻', description: 'Máy tính, internet, phần mềm' },
    { value: 'health', label: 'Sức khỏe', icon: '🏥', description: 'Y tế, bệnh viện, thể dục' },
    { value: 'food', label: 'Ẩm thực', icon: '🍽️', description: 'Món ăn, nguyên liệu, nhà hàng' },
    { value: 'sports', label: 'Thể thao', icon: '⚽', description: 'Bóng đá, bơi lội, tập gym' },
    { value: 'entertainment', label: 'Giải trí', icon: '🎬', description: 'Phim ảnh, âm nhạc, trò chơi' }
]

const LEVELS = [
    { value: 'beginner', label: 'Cơ bản', description: 'Từ đơn giản, thường gặp' },
    { value: 'intermediate', label: 'Trung cấp', description: 'Từ phổ biến trong giao tiếp' },
    { value: 'advanced', label: 'Nâng cao', description: 'Từ học thuật, chuyên ngành' }
]

export default function BulkGeneratePage() {
    const router = useRouter()
    const [selectedCategory, setSelectedCategory] = useState('daily')
    const [selectedLevel, setSelectedLevel] = useState('intermediate')
    const [wordCount, setWordCount] = useState(100)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const handleGenerate = async () => {
        setLoading(true)
        setError(null)
        setResult(null)
        setProgress(0)

        try {
            const res = await fetch('/api/vocabulary/generate-bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: selectedCategory,
                    count: wordCount,
                    level: selectedLevel
                })
            })

            const data = await res.json()

            if (!data.success) {
                throw new Error(data.error || 'Không thể tạo từ vựng')
            }

            setResult(data)
            setProgress(100)

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
        } finally {
            setLoading(false)
        }
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
                        Gen từ vựng hàng loạt
                    </h1>
                    <p style={{ color: 'var(--gray-500)' }}>
                        Sử dụng AI để tạo từ 100 đến 1000 từ vựng theo chủ đề
                    </p>
                </div>
            </div>

            {/* Success Message */}
            {result && (
                <div className="success-box" style={{ marginBottom: '1.5rem' }}>
                    <CheckCircle size={20} />
                    <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                            Hoàn thành! Đã tạo {result.count} từ vựng
                        </p>
                        <p style={{ fontSize: '0.9rem' }}>
                            Chủ đề: {CATEGORIES.find(c => c.value === result.category)?.label}
                        </p>
                    </div>
                    <button
                        onClick={() => router.push(`/vocabulary/${result.category}`)}
                        className="btn btn-primary"
                    >
                        Xem từ vựng
                    </button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="error-box" style={{ marginBottom: '1.5rem' }}>
                    <p>{error}</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                {/* Configuration */}
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                        Cấu hình
                    </h2>

                    {/* Category Selection */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}>
                            1. Chọn chủ đề
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setSelectedCategory(cat.value)}
                                    style={{
                                        padding: '1rem',
                                        border: selectedCategory === cat.value ? '2px solid var(--primary-500)' : '2px solid var(--card-border)',
                                        borderRadius: '0.5rem',
                                        background: selectedCategory === cat.value ? 'var(--primary-50)' : 'white',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{cat.icon}</div>
                                    <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.9rem' }} className="text-gray-600">{cat.label}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }} className="text-gray-500">{cat.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Level Selection */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}>
                            2. Chọn độ khó
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                            {LEVELS.map((lvl) => (
                                <button
                                    key={lvl.value}
                                    onClick={() => setSelectedLevel(lvl.value)}
                                    style={{
                                        padding: '1rem',
                                        border: selectedLevel === lvl.value ? '2px solid var(--primary-500)' : '2px solid var(--card-border)',
                                        borderRadius: '0.5rem',
                                        background: selectedLevel === lvl.value ? 'var(--primary-50)' : 'white',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }} className="text-gray-600">{lvl.label}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }} className="text-gray-500">{lvl.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Word Count */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}>
                            3. Số lượng từ (100 - 1000)
                        </label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <input
                                type="range"
                                min="100"
                                max="1000"
                                step="100"
                                value={wordCount}
                                onChange={(e) => setWordCount(parseInt(e.target.value))}
                                style={{ flex: 1 }}
                            />
                            <input
                                type="number"
                                min="100"
                                max="1000"
                                value={wordCount}
                                onChange={(e) => setWordCount(parseInt(e.target.value))}
                                style={{
                                    width: '100px',
                                    padding: '0.75rem',
                                    border: '2px solid var(--card-border)',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem',
                                    textAlign: 'center'
                                }}
                            />
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                            Thời gian ước tính: {Math.ceil(wordCount / 50)} - {Math.ceil(wordCount / 25)} phút
                        </p>
                    </div>

                    {/* Progress */}
                    {loading && (
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Đang tạo từ vựng...</span>
                                <span style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>{progress}%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: '0.5rem', textAlign: 'center' }}>
                                Quá trình này có thể mất vài phút. Vui lòng đợi...
                            </p>
                        </div>
                    )}

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem' }}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="spinner" size={20} />
                                Đang tạo {wordCount} từ...
                            </>
                        ) : (
                            <>
                                <Zap size={20} />
                                Bắt đầu tạo {wordCount} từ vựng
                            </>
                        )}
                    </button>
                </div>

                {/* Preview */}
                {result && result.words && (
                    <div className="card">
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                            Xem trước (20 từ đầu tiên)
                        </h2>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            {result.words.map((word: any, idx: number) => (
                                <div
                                    key={idx}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        background: 'var(--gray-50)',
                                        borderRadius: '0.5rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <span className="font-semibold text-gray-600">{word.english}</span>
                                        <span className="text-gray-500 ml-1 text-sm">
                                            {word.phonetic}
                                        </span>
                                    </div>
                                    <div className="text-gray-600 text-sm">
                                        {word.vietnamese}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}
