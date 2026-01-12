'use client'

import { Layout } from '@/components/Layout'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react'

// Mock history data
const mockHistory = [
    {
        id: '1',
        date: 'Hôm nay, 14:30',
        type: 'mixed',
        score: 8,
        total: 10,
        percentage: 80,
        timeTaken: 245 // seconds
    },
    {
        id: '2',
        date: 'Hôm qua, 09:15',
        type: 'vocabulary',
        score: 9,
        total: 10,
        percentage: 90,
        timeTaken: 180
    },
    {
        id: '3',
        date: '05/01/2026, 20:00',
        type: 'grammar',
        score: 7,
        total: 10,
        percentage: 70,
        timeTaken: 320
    },
    {
        id: '4',
        date: '04/01/2026, 15:45',
        type: 'flashcard',
        score: 10,
        total: 10,
        percentage: 100,
        timeTaken: 150
    },
    {
        id: '5',
        date: '03/01/2026, 11:20',
        type: 'vocabulary',
        score: 6,
        total: 10,
        percentage: 60,
        timeTaken: 280
    },
]

const typeLabels: Record<string, { label: string; badge: string }> = {
    mixed: { label: 'Tổng hợp', badge: 'badge-purple' },
    vocabulary: { label: 'Từ vựng', badge: 'badge-blue' },
    grammar: { label: 'Ngữ pháp', badge: 'badge-orange' },
    flashcard: { label: 'Flashcard', badge: 'badge-green' },
}

export default function ReviewHistoryPage() {
    const averageScore = Math.round(
        mockHistory.reduce((acc, h) => acc + h.percentage, 0) / mockHistory.length
    )

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <Layout>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <Link href="/review" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="page-title">Lịch sử ôn tập 📊</h1>
                    <p className="page-subtitle">Xem lại các bài test đã làm</p>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-icon feature-icon blue">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{mockHistory.length}</h3>
                        <p>Bài đã làm</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon feature-icon green">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{averageScore}%</h3>
                        <p>Trung bình</p>
                    </div>
                </div>
            </div>

            {/* Progress Chart Placeholder */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
                    📈 Biểu đồ tiến bộ
                </h2>
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    height: '150px',
                    padding: '1rem 0',
                    borderBottom: '2px solid var(--gray-200)'
                }}>
                    {mockHistory.slice().reverse().map((item, idx) => (
                        <div
                            key={item.id}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <div
                                style={{
                                    width: '40px',
                                    height: `${item.percentage * 1.2}px`,
                                    background: item.percentage >= 80
                                        ? 'var(--accent-green)'
                                        : item.percentage >= 60
                                            ? 'var(--primary-500)'
                                            : 'var(--accent-orange)',
                                    borderRadius: '4px 4px 0 0',
                                    transition: 'height 0.3s'
                                }}
                            ></div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                {idx + 1}
                            </span>
                        </div>
                    ))}
                </div>
                <p style={{ textAlign: 'center', color: 'var(--gray-500)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    5 bài test gần nhất
                </p>
            </div>

            {/* History List */}
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
                Chi tiết các bài test
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {mockHistory.map((item) => (
                    <div key={item.id} className="card" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {/* Icon */}
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: item.percentage >= 80
                                    ? '#dcfce7'
                                    : item.percentage >= 60
                                        ? '#dbeafe'
                                        : '#fef3c7',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {item.percentage >= 80 ? (
                                    <CheckCircle size={24} style={{ color: 'var(--accent-green)' }} />
                                ) : item.percentage >= 60 ? (
                                    <TrendingUp size={24} style={{ color: 'var(--primary-500)' }} />
                                ) : (
                                    <XCircle size={24} style={{ color: 'var(--accent-orange)' }} />
                                )}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <span className={`badge ${typeLabels[item.type].badge}`}>
                                        {typeLabels[item.type].label}
                                    </span>
                                    <span style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{item.date}</span>
                                </div>
                                <p style={{ fontWeight: 500 }}>
                                    {item.score}/{item.total} câu đúng
                                </p>
                            </div>

                            {/* Score & Time */}
                            <div style={{ textAlign: 'right' }}>
                                <p style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: item.percentage >= 80
                                        ? 'var(--accent-green)'
                                        : item.percentage >= 60
                                            ? 'var(--primary-600)'
                                            : 'var(--accent-orange)'
                                }}>
                                    {item.percentage}%
                                </p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Clock size={14} />
                                    {formatTime(item.timeTaken)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    )
}
