'use client'

import { useState } from 'react'
import { Layout } from '@/components/Layout'
import { Download, Sparkles, RefreshCw, Check, X } from 'lucide-react'

interface GenerateResult {
    success: boolean
    message: string
    data?: object
}

export default function GenerateDataPage() {
    const [words, setWords] = useState('')
    const [topic, setTopic] = useState('daily')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<GenerateResult | null>(null)

    const handleGenerateVocabulary = async () => {
        if (!words.trim()) return

        setLoading(true)
        setResult(null)

        try {
            const wordList = words.split(/[,\n]/).map(w => w.trim()).filter(Boolean)

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'vocabulary', words: wordList })
            })

            const data = await response.json()

            if (data.success) {
                setResult({
                    success: true,
                    message: `✅ Đã lưu ${data.count} từ vào database!`,
                    data: data.words
                })
            } else {
                setResult({ success: false, message: data.error || 'Có lỗi xảy ra' })
            }
        } catch (error) {
            setResult({ success: false, message: 'Lỗi kết nối server' })
        } finally {
            setLoading(false)
        }
    }

    const handleGenerateFlashcards = async () => {
        setLoading(true)
        setResult(null)

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'flashcards', topic })
            })

            const data = await response.json()

            if (data.success) {
                setResult({
                    success: true,
                    message: `✅ Đã tạo deck "${data.deck.name}" với ${data.deck.cardCount} thẻ!`,
                    data: data.deck
                })
            } else {
                setResult({ success: false, message: data.error || 'Có lỗi xảy ra' })
            }
        } catch (error) {
            setResult({ success: false, message: 'Lỗi kết nối server' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <div className="page-header">
                <h1 className="page-title">Tạo dữ liệu 🔧</h1>
                <p className="page-subtitle">
                    Tự động lấy từ vựng từ Dictionary API và tạo flashcard
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Generate Vocabulary */}
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Download size={20} />
                        Tải từ vựng
                    </h2>
                    <p style={{ color: 'var(--gray-500)', marginBottom: '1rem' }}>
                        Nhập các từ (cách nhau bằng dấu phẩy hoặc xuống dòng) để lấy thông tin từ Dictionary API
                    </p>

                    <textarea
                        value={words}
                        onChange={(e) => setWords(e.target.value)}
                        placeholder="accomplish, enhance, significant, contribute..."
                        rows={5}
                        className="input"
                        style={{ width: '100%', marginBottom: '1rem', resize: 'vertical' }}
                    />

                    <button
                        className="btn btn-primary"
                        onClick={handleGenerateVocabulary}
                        disabled={loading || !words.trim()}
                        style={{ width: '100%' }}
                    >
                        {loading ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />}
                        {loading ? 'Đang tải...' : 'Tải từ vựng'}
                    </button>
                </div>

                {/* Generate Flashcard Deck */}
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sparkles size={20} />
                        Tạo Flashcard Deck
                    </h2>
                    <p style={{ color: 'var(--gray-500)', marginBottom: '1rem' }}>
                        Chọn chủ đề để tự động tạo bộ flashcard với từ vựng liên quan
                    </p>

                    <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="input"
                        style={{ width: '100%', marginBottom: '1rem' }}
                    >
                        <option value="daily">Giao tiếp hàng ngày</option>
                        <option value="business">Kinh doanh</option>
                        <option value="travel">Du lịch</option>
                        <option value="technology">Công nghệ</option>
                        <option value="academic">Học thuật</option>
                        <option value="food">Ẩm thực</option>
                    </select>

                    <button
                        className="btn btn-primary"
                        onClick={handleGenerateFlashcards}
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
                        {loading ? 'Đang tạo...' : 'Tạo Flashcard Deck'}
                    </button>
                </div>
            </div>

            {/* Result */}
            {result && (
                <div
                    className="card"
                    style={{
                        marginTop: '1.5rem',
                        background: result.success ? '#dcfce7' : '#fee2e2',
                        borderColor: result.success ? 'var(--accent-green)' : 'var(--accent-red)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {result.success ? (
                            <Check size={24} style={{ color: 'var(--accent-green)' }} />
                        ) : (
                            <X size={24} style={{ color: 'var(--accent-red)' }} />
                        )}
                        <p style={{ fontWeight: 600 }}>{result.message}</p>
                    </div>

                    {result.data && result.success && (
                        <details style={{ marginTop: '1rem' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
                                Xem chi tiết dữ liệu
                            </summary>
                            <pre style={{
                                marginTop: '0.5rem',
                                padding: '1rem',
                                background: 'white',
                                borderRadius: '0.5rem',
                                overflow: 'auto',
                                fontSize: '0.85rem'
                            }}>
                                {JSON.stringify(result.data, null, 2)}
                            </pre>
                        </details>
                    )}
                </div>
            )}
        </Layout>
    )
}
