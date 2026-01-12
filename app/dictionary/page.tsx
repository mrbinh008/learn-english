'use client'

import { useState } from 'react'
import { Layout } from '@/components/Layout'
import { Search, Volume2, BookOpen, Loader2 } from 'lucide-react'
import {
    lookupWord,
    DictionaryEntry,
    getBestAudioUrl,
    getPhoneticText,
    getAllDefinitions,
    getAllSynonyms
} from '@/lib/dictionary'

export default function DictionaryPage() {
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<DictionaryEntry | null>(null)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        setError(null)
        setResult(null)

        const response = await lookupWord(query.trim())

        if (response.success && response.data) {
            setResult(response.data[0])
        } else {
            setError(response.error || 'Có lỗi xảy ra')
        }

        setLoading(false)
    }

    const playAudio = (url: string) => {
        const audio = new Audio(url)
        audio.play()
    }

    return (
        <Layout>
            <div className="page-header">
                <h1 className="page-title">Từ điển Anh - Việt 📖</h1>
                <p className="page-subtitle">
                    Tra từ tiếng Anh, xem nghĩa, phát âm và ví dụ
                </p>
            </div>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="search-box" style={{ marginBottom: '2rem' }}>
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Nhập từ tiếng Anh cần tra..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : 'Tra từ'}
                </button>
            </form>

            {/* Error */}
            {error && (
                <div className="card" style={{ background: '#fef2f2', borderColor: '#fecaca', marginBottom: '1rem' }}>
                    <p style={{ color: '#991b1b' }}>{error}</p>
                </div>
            )}

            {/* Result */}
            {result && (
                <div className="card animate-fade-in">
                    {/* Word Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{result.word}</h2>
                        {getPhoneticText(result) && (
                            <span style={{ color: 'var(--gray-500)', fontSize: '1.1rem' }}>
                                {getPhoneticText(result)}
                            </span>
                        )}
                        {getBestAudioUrl(result) && (
                            <button
                                onClick={() => playAudio(getBestAudioUrl(result)!)}
                                className="btn btn-secondary"
                                style={{ padding: '0.5rem' }}
                            >
                                <Volume2 size={20} />
                            </button>
                        )}
                    </div>

                    {/* Definitions */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <BookOpen size={18} />
                            Định nghĩa
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {getAllDefinitions(result).slice(0, 5).map((def, idx) => (
                                <div key={idx} style={{ paddingLeft: '1rem', borderLeft: '3px solid var(--primary-400)' }}>
                                    <span className={`badge badge-blue`} style={{ marginBottom: '0.5rem' }}>
                                        {def.partOfSpeech}
                                    </span>
                                    <p style={{ fontWeight: 500 }}>{def.definition}</p>
                                    {def.example && (
                                        <p style={{ color: 'var(--gray-500)', fontStyle: 'italic', marginTop: '0.25rem' }}>
                                            &quot;{def.example}&quot;
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Synonyms */}
                    {getAllSynonyms(result).length > 0 && (
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                                Từ đồng nghĩa
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {getAllSynonyms(result).slice(0, 10).map((syn, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setQuery(syn)}
                                        className="badge badge-green"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {syn}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add to Flashcard Button */}
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)' }}>
                        <button className="btn btn-primary">
                            Thêm vào Flashcard
                        </button>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!result && !loading && !error && (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        Nhập từ để bắt đầu tra cứu
                    </h3>
                    <p style={{ color: 'var(--gray-500)' }}>
                        Tra từ tiếng Anh để xem nghĩa, phát âm, ví dụ và từ đồng nghĩa
                    </p>
                </div>
            )}
        </Layout>
    )
}
