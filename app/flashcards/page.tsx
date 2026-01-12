'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import Link from 'next/link'
import { Plus, BookOpen, Trash2, RefreshCw, Sparkles } from 'lucide-react'

// Import reusable components
import { LoadingSpinner, Modal, EmptyState, PageHeader } from '@/components/ui'

// Import shared types
import type { Deck } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/types'

// Quick sync topics configuration
const QUICK_TOPICS = ['daily', 'business', 'travel', 'technology', 'food'] as const

export default function FlashcardsPage() {
    const [decks, setDecks] = useState<Deck[]>([])
    const [loading, setLoading] = useState(true)
    const [syncing, setSyncing] = useState(false)
    
    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showAIModal, setShowAIModal] = useState(false)
    
    // Form states
    const [newDeckName, setNewDeckName] = useState('')
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

    // Sync data from predefined topics
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
                alert(`Đã tạo deck "${data.deck.name}" với ${data.deck.cardCount} thẻ bằng AI!`)
            } else {
                alert('Lỗi: ' + (data.error || 'Không thể tạo deck'))
            }
        } catch (error) {
            console.error('AI generation failed:', error)
            alert('Lỗi khi tạo deck bằng AI!')
        } finally {
            setGeneratingAI(false)
        }
    }

    // Create new empty deck
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
                setNewDeckName('')
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

    // Loading state
    if (loading) {
        return (
            <Layout>
                <LoadingSpinner fullPage text="Đang tải..." />
            </Layout>
        )
    }

    return (
        <Layout>
            {/* Page Header */}
            <PageHeader
                title="Flashcards 🧠"
                subtitle="Học từ vựng hiệu quả với phương pháp lặp lại có khoảng cách"
                actions={
                    <>
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
                    </>
                }
            />

            {/* AI Generation Card */}
            <AIGenerationCard onOpenModal={() => setShowAIModal(true)} />

            {/* Quick Sync Buttons */}
            <QuickSyncSection 
                syncing={syncing} 
                onSync={handleSyncData} 
            />

            {/* Deck List */}
            {decks.length === 0 ? (
                <EmptyState
                    icon="📚"
                    title="Chưa có bộ thẻ nào"
                    description="Tạo deck mới hoặc tải dữ liệu từ các chủ đề có sẵn"
                    action={
                        <button
                            className="btn btn-primary"
                            onClick={() => handleSyncData('daily')}
                            disabled={syncing}
                        >
                            <RefreshCw size={18} />
                            Tải deck &quot;Giao tiếp hàng ngày&quot;
                        </button>
                    }
                />
            ) : (
                <DeckGrid decks={decks} onDelete={handleDeleteDeck} />
            )}

            {/* Create Deck Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Tạo bộ thẻ mới"
                maxWidth="400px"
            >
                <div className="input-group">
                    <label className="input-label">Tên bộ thẻ</label>
                    <input
                        type="text"
                        className="input"
                        value={newDeckName}
                        onChange={(e) => setNewDeckName(e.target.value)}
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
            </Modal>

            {/* AI Generation Modal */}
            <AIGenerationModal
                isOpen={showAIModal}
                onClose={() => {
                    setShowAIModal(false)
                    setAiTopic('')
                }}
                aiTopic={aiTopic}
                setAiTopic={setAiTopic}
                generating={generatingAI}
                onGenerate={handleGenerateWithAI}
            />
        </Layout>
    )
}

// ============================================
// SUB-COMPONENTS
// ============================================

function AIGenerationCard({ onOpenModal }: { onOpenModal: () => void }) {
    return (
        <div 
            className="card" 
            style={{ 
                marginBottom: '1.5rem', 
                background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', 
                border: '2px solid #667eea50' 
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Sparkles size={20} style={{ color: '#667eea' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }} className='text-gray-600'>
                    Tạo Flashcards bằng AI
                </h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '1rem' }}>
                AI sẽ tự động tạo 15 từ vựng quan trọng dựa trên chủ đề bạn chọn, bao gồm nghĩa tiếng Việt, phiên âm và ví dụ.
            </p>
            <button
                className="btn btn-primary"
                onClick={onOpenModal}
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
                <Sparkles size={18} />
                Bắt đầu tạo với AI
            </button>
        </div>
    )
}

function QuickSyncSection({ 
    syncing, 
    onSync 
}: { 
    syncing: boolean
    onSync: (topic: string) => void 
}) {
    return (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                🔄 Tải dữ liệu từ Dictionary API
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {QUICK_TOPICS.map(topic => (
                    <button
                        key={topic}
                        className="btn btn-secondary"
                        onClick={() => onSync(topic)}
                        disabled={syncing}
                        style={{ textTransform: 'capitalize' }}
                    >
                        {syncing ? (
                            <RefreshCw size={16} className="animate-spin" />
                        ) : (
                            <RefreshCw size={16} />
                        )}
                        {CATEGORY_LABELS[topic] || topic}
                    </button>
                ))}
            </div>
        </div>
    )
}

function DeckGrid({ 
    decks, 
    onDelete 
}: { 
    decks: Deck[]
    onDelete: (id: string) => void 
}) {
    return (
        <div className="card-grid">
            {decks.map(deck => (
                <div key={deck.id} className="feature-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div className="feature-icon purple">
                            <BookOpen size={24} />
                        </div>
                        <button
                            onClick={() => onDelete(deck.id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--gray-400)',
                                padding: '0.25rem'
                            }}
                            aria-label="Delete deck"
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
    )
}

function AIGenerationModal({
    isOpen,
    onClose,
    aiTopic,
    setAiTopic,
    generating,
    onGenerate
}: {
    isOpen: boolean
    onClose: () => void
    aiTopic: string
    setAiTopic: (topic: string) => void
    generating: boolean
    onGenerate: () => void
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Tạo Flashcards bằng AI"
            icon={<Sparkles size={24} style={{ color: '#667eea' }} />}
            maxWidth="500px"
            containerStyle={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
                border: '2px solid #667eea50'
            }}
        >
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
                    disabled={generating}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && aiTopic.trim() && !generating) {
                            onGenerate()
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
                    onClick={onClose}
                    disabled={generating}
                >
                    Hủy
                </button>
                <button
                    className="btn btn-primary"
                    style={{
                        flex: 1,
                        background: generating
                            ? 'var(--gray-400)'
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                    onClick={onGenerate}
                    disabled={!aiTopic.trim() || generating}
                >
                    {generating ? (
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

            {generating && (
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
        </Modal>
    )
}
