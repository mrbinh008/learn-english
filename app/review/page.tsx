'use client'

import { Layout } from '@/components/Layout'
import Link from 'next/link'
import { RotateCcw, Target, Flame, TrendingUp, Play, History } from 'lucide-react'

export default function ReviewPage() {
    const todayReviewCount = 15
    const streak = 7
    const accuracy = 85

    return (
        <Layout>
            <div className="page-header">
                <h1 className="page-title">Ôn tập 🔄</h1>
                <p className="page-subtitle">
                    Ôn lại từ vựng và ngữ pháp với bài test định kỳ
                </p>
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-icon feature-icon red">
                        <Target size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{todayReviewCount}</h3>
                        <p>Cần ôn hôm nay</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon feature-icon orange">
                        <Flame size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{streak} ngày</h3>
                        <p>Streak liên tục</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon feature-icon green">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{accuracy}%</h3>
                        <p>Độ chính xác</p>
                    </div>
                </div>
            </div>

            {/* Review Actions */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                    📝 Bài ôn tập hôm nay
                </h2>
                <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
                    Bạn có {todayReviewCount} từ cần ôn lại để củng cố trí nhớ
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/review/test" className="btn btn-primary">
                        <Play size={18} />
                        Bắt đầu ôn tập
                    </Link>
                    <Link href="/review/history" className="btn btn-secondary">
                        <History size={18} />
                        Xem lịch sử
                    </Link>
                </div>
            </div>

            {/* Review Types */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                Chọn loại ôn tập
            </h2>
            <div className="card-grid">
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '2rem' }}>📚</span>
                        <div>
                            <h3 style={{ fontWeight: 600 }}>Từ vựng</h3>
                            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>10 từ cần ôn</p>
                        </div>
                    </div>
                    <Link href="/review/test?type=vocabulary" className="btn btn-primary" style={{ width: '100%' }}>
                        Ôn từ vựng
                    </Link>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '2rem' }}>📝</span>
                        <div>
                            <h3 style={{ fontWeight: 600 }}>Ngữ pháp</h3>
                            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>5 bài tập</p>
                        </div>
                    </div>
                    <Link href="/review/test?type=grammar" className="btn btn-primary" style={{ width: '100%' }}>
                        Ôn ngữ pháp
                    </Link>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '2rem' }}>🃏</span>
                        <div>
                            <h3 style={{ fontWeight: 600 }}>Flashcard</h3>
                            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>8 thẻ cần ôn</p>
                        </div>
                    </div>
                    <Link href="/review/test?type=flashcard" className="btn btn-primary" style={{ width: '100%' }}>
                        Ôn Flashcard
                    </Link>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '2rem' }}>🎯</span>
                        <div>
                            <h3 style={{ fontWeight: 600 }}>Tổng hợp</h3>
                            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Mix tất cả</p>
                        </div>
                    </div>
                    <Link href="/review/test?type=mixed" className="btn btn-primary" style={{ width: '100%' }}>
                        Ôn tổng hợp
                    </Link>
                </div>
            </div>
        </Layout>
    )
}
