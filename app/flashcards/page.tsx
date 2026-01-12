'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import Link from 'next/link'
import { Plus, BookOpen, Trash2, RefreshCw, Sparkles } from 'lucide-react'

interface Deck {
    id: string
    name: string
    description: string | null
    cardCount: number
    createdAt: string
}

export default function FlashcardsPage() {
    const [decks, setDecks] = useState<Deck[]>([])
    const [loading, setLoading] = useState(true)
    const [syncing, setSyncing] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showAIModal, setShowAIModal] = useState(false)
    const [newDeckName, setNewDeskName] = useState('')
    const [newDeckDesc, setNewDeckDesc] = useState('')
    const [aiTopic, setAiTopic] = useState('')
    const [generatingAI, setGeneratingAI] = useState(false)

    // Fetch decks from API
    const fetchDecks = async () => {
        try {
            const response = await fetch('/api/decks')
            const data = await response.json()
            if (data.success) {
                setDecks(data.decks)
            }
        } catch (error) {
            console.error('Failed to fetch decks:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDecks()
    }, [])

    // Sync data from Dictionary API
    const handleSyncData = async (topic: string) => {
        setSyncing(true)
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'flashcards', topic })
            })
            const data = await response.json()
            if (data.success) {
                // Refresh deck list
                await fetchDecks()
                alert(`Đã tạo deck "${data.deck.name}" với ${data.deck.cardCount} thẻ!`)
            }
        } catch (error) {
            console.error('Sync failed:', error)
            alert('Lỗi đồng bộ dữ liệu!')
        } finally {
            setSyncing(false)
        }
    }

    // Generate deck with AI (custom topic)
    const handleGenerateWithAI = async () => {
        if (!aiTopic.trim()) return

        setGeneratingAI(true)
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'flashcards',
                    topic: aiTopic.trim(),
                    useAI: true
                })
            })
            const data = await response.json()
            if (data.success) {
                await fetchDecks()
                setShowAIModal(false)
                setAiTopic('')
                alert(`✅ Đã tạo deck "${data.deck.name}" với ${data.deck.cardCount} thẻ bằng AI!`)
            } else {
                alert('❌ Lỗi: ' + (data.error || 'Không thể tạo deck'))
            }
        } catch (error) {
            console.error('AI generation failed:', error)
            alert('❌ Lỗi khi tạo deck bằng AI!')
        } finally {
            setGeneratingAI(false)
        }
    }

    // Create new deck
    const handleCreateDeck = async () => {
        if (!newDeckName.trim()) return

        try {
            const response = await fetch('/api/decks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newDeckName, description: newDeckDesc })
            })
            const data = await response.json()
            if (data.success) {
                await fetchDecks()
                setShowCreateModal(false)
                setNewDeskName('')
                setNewDeckDesc('')
            }
        } catch (error) {
            console.error('Create deck failed:', error)
        }
    }

    // Delete deck
    const handleDeleteDeck = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa deck này?')) return

        try {
            await fetch(`/api/decks/${id}`, { method: 'DELETE' })
            await fetchDecks()
        } catch (error) {
            console.error('Delete deck failed:', error)
        }
    }

    if (loading) {
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <div className="spinner"></div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Flashcards 🧠</h1>
                        <p className="page-subtitle">Học từ vựng hiệu quả với phương pháp lặp lại có khoảng cách</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowAIModal(true)}
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                        >
                            <Sparkles size={18} />
                            Tạo bằng AI
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <Plus size={18} />
                            Tạo deck mới
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Generation Card */}
            <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', border: '2px solid #667eea50' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <Sparkles size={20} style={{ color: '#667eea' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }} className='text-gray-600'>
                        ✨ Tạo Flashcards bằng AI
                    </h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '1rem' }}>
                    AI sẽ tự động tạo 15 từ vựng quan trọng dựa trên chủ đề bạn chọn, bao gồm nghĩa tiếng Việt, phiên âm và ví dụ.
                </p>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAIModal(true)}
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                    <Sparkles size={18} />
                    Bắt đầu tạo với AI
                </button>
            </div>

            {/* Quick Sync Buttons */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                    🔄 Tải dữ liệu từ Dictionary API
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['daily', 'business', 'travel', 'technology', 'food'].map(topic => (
                        <button
                            key={topic}
                            className="btn btn-secondary"
                            onClick={() => handleSyncData(topic)}
                            disabled={syncing}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {syncing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                            {topic === 'daily' ? 'Hàng ngày' :
                                topic === 'business' ? 'Kinh doanh' :
                                    topic === 'travel' ? 'Du lịch' :
                                        topic === 'technology' ? 'Công nghệ' : 'Ẩm thực'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Deck List */}
            {decks.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</p>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        Chưa có bộ thẻ nào
                    </h3>
                    <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
                        Tạo deck mới hoặc tải dữ liệu từ các chủ đề có sẵn
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleSyncData('daily')}
                        disabled={syncing}
                    >
                        <RefreshCw size={18} />
                        Tải deck &quot;Giao tiếp hàng ngày&quot;
                    </button>
                </div>
            ) : (
                <div className="card-grid">
                    {decks.map(deck => (
                        <div key={deck.id} className="feature-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div className="feature-icon purple">
                                    <BookOpen size={24} />
                                </div>
                                <button
                                    onClick={() => handleDeleteDeck(deck.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--gray-400)',
                                        padding: '0.25rem'
                                    }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <h3 className="feature-title">{deck.name}</h3>
                            <p className="feature-description">
                                {deck.description || `${deck.cardCount} thẻ`}
                            </p>

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                <Link
                                    href={`/flashcards/${deck.id}/study`}
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    Học ngay
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                            Tạo bộ thẻ mới
                        </h3>

                        <div className="input-group">
                            <label className="input-label">Tên bộ thẻ</label>
                            <input
                                type="text"
                                className="input"
                                value={newDeckName}
                                onChange={(e) => setNewDeskName(e.target.value)}
                                placeholder="Ví dụ: Từ vựng IELTS"
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Mô tả (tùy chọn)</label>
                            <input
                                type="text"
                                className="input"
                                value={newDeckDesc}
                                onChange={(e) => setNewDeckDesc(e.target.value)}
                                placeholder="Mô tả ngắn về bộ thẻ"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                                onClick={() => setShowCreateModal(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                onClick={handleCreateDeck}
                                disabled={!newDeckName.trim()}
                            >
                                Tạo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Generation Modal */}
            {showAIModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{
                        width: '100%',
                        maxWidth: '500px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
                        border: '2px solid #667eea50'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <Sparkles size={24} style={{ color: '#667eea' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }} className='text-gray-600'>
                                Tạo Flashcards bằng AI
                            </h3>
                        </div>

                        <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
                            Nhập chủ đề bất kỳ, AI sẽ tự động tạo 15 từ vựng quan trọng với nghĩa tiếng Việt, phiên âm và ví dụ.
                        </p>

                        <div className="input-group">
                            <label className="text-gray-500">Chủ đề (Topic)</label>
                            <input
                                type="text"
                                className="input"
                                value={aiTopic}
                                onChange={(e) => setAiTopic(e.target.value)}
                                placeholder="Ví dụ: Environment, Music, Sports, Shopping..."
                                disabled={generatingAI}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && aiTopic.trim() && !generatingAI) {
                                        handleGenerateWithAI()
                                    }
                                }}
                            />
                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                                💡 Gợi ý: Environment, Music, Sports, Shopping, Education, Nature, Art, Science
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                                onClick={() => {
                                    setShowAIModal(false)
                                    setAiTopic('')
                                }}
                                disabled={generatingAI}
                            >
                                Hủy
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{
                                    flex: 1,
                                    background: generatingAI
                                        ? 'var(--gray-400)'
                                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                }}
                                onClick={handleGenerateWithAI}
                                disabled={!aiTopic.trim() || generatingAI}
                            >
                                {generatingAI ? (
                                    <>
                                        <RefreshCw size={18} className="animate-spin" />
                                        Đang tạo...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        Tạo ngay
                                    </>
                                )}
                            </button>
                        </div>

                        {generatingAI && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '0.75rem',
                                background: '#667eea15',
                                borderRadius: '0.5rem',
                                fontSize: '0.85rem',
                                color: '#667eea',
                                textAlign: 'center'
                            }}>
                                ⏳ AI đang phân tích chủ đề và tạo từ vựng... Vui lòng đợi ~30 giây
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    )
}
