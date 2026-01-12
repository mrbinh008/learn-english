'use client'

import { Layout } from '@/components/Layout'
import Link from 'next/link'
import { BookOpen, CheckCircle, Loader2, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Category {
    id: string
    name: string
    icon: string
    wordCount: number
    category: string
}

export default function VocabularyPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/vocabulary/categories')
            const data = await res.json()
            
            if (data.success) {
                setCategories(data.categories)
            } else {
                setError('Không thể tải danh sách chủ đề')
            }
        } catch (err) {
            console.error('Error fetching categories:', err)
            setError('Có lỗi xảy ra khi tải dữ liệu')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <Layout>
                <div className="page-header">
                    <h1 className="page-title">Từ vựng theo chủ đề 📖</h1>
                </div>
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <Loader2 className="spinner" size={48} />
                    <p style={{ marginTop: '1rem', color: 'var(--gray-500)' }}>Đang tải...</p>
                </div>
            </Layout>
        )
    }

    if (error) {
        return (
            <Layout>
                <div className="page-header">
                    <h1 className="page-title">Từ vựng theo chủ đề 📖</h1>
                </div>
                <div className="error-box">
                    <p>{error}</p>
                </div>
            </Layout>
        )
    }

    const totalWords = categories.reduce((acc, c) => acc + c.wordCount, 0)

    return (
        <Layout>
            <div className="page-header">
                <h1 className="page-title">Từ vựng theo chủ đề 📖</h1>
                <p className="page-subtitle">
                    Học từ vựng theo các chủ đề phổ biến trong cuộc sống
                </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <Link href="/create?tab=vocabulary" className="btn btn-primary">
                    <Plus size={18} />
                    Tạo từ vựng mới
                </Link>
                <Link href="/vocabulary/bulk-generate" className="btn btn-secondary">
                    <BookOpen size={18} />
                    Gen 1000 từ theo chủ đề
                </Link>
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                    <div className="stat-icon feature-icon green">
                        <BookOpen size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{totalWords}</h3>
                        <p>Tổng từ vựng</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon feature-icon blue">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{categories.length}</h3>
                        <p>Chủ đề</p>
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                Chọn chủ đề
            </h2>
            
            {categories.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--gray-500)', marginBottom: '1rem' }}>
                        Chưa có từ vựng nào. Hãy tạo từ vựng mới!
                    </p>
                    <Link href="/create?tab=vocabulary" className="btn btn-primary">
                        <Plus size={18} />
                        Tạo từ vựng đầu tiên
                    </Link>
                </div>
            ) : (
                <div className="card-grid">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/vocabulary/${category.category}`}
                            className="card"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            {/* Icon & Title */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '2.5rem' }}>{category.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                        {category.name}
                                    </h3>
                                    <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                                        {category.wordCount} từ
                                    </p>
                                </div>
                            </div>

                            {/* Progress */}
                            <div style={{ marginTop: '1rem' }}>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '0%' }}></div>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                                    Chưa học
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </Layout>
    )
}
