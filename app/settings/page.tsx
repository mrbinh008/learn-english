'use client'

import { useState } from 'react'
import { Layout } from '@/components/Layout'
import { Check, Eye, EyeOff } from 'lucide-react'
import { PROVIDER_NAMES, DEFAULT_MODELS } from '@/lib/ai/types'
import type { AIProvider } from '@/lib/ai/types'

const providers: AIProvider[] = ['gemini', 'openai', 'claude', 'groq', 'cloudflare']

export default function SettingsPage() {
    const [selectedProvider, setSelectedProvider] = useState<AIProvider>('gemini')
    const [apiKeys, setApiKeys] = useState<Record<string, string>>({
        gemini: '',
        openai: '',
        claude: '',
        groq: '',
        cloudflare: '',
        cloudflareAccountId: ''
    })
    const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        // Save to localStorage
        localStorage.setItem('learn-english-settings', JSON.stringify({
            provider: selectedProvider,
            apiKeys
        }))
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    const toggleShowKey = (key: string) => {
        setShowKeys(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <Layout>
            <div className="page-header">
                <h1 className="page-title">Cài đặt ⚙️</h1>
                <p className="page-subtitle">
                    Cấu hình AI provider và các tùy chọn khác
                </p>
            </div>

            {/* AI Provider Selection */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                    🤖 Chọn AI Provider
                </h2>
                <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
                    Chọn AI bạn muốn sử dụng cho các tính năng thông minh
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {providers.map((provider) => (
                        <label
                            key={provider}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                border: `2px solid ${selectedProvider === provider ? 'var(--primary-500)' : 'var(--card-border)'}`,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <input
                                type="radio"
                                name="provider"
                                value={provider}
                                checked={selectedProvider === provider}
                                onChange={() => setSelectedProvider(provider)}
                                style={{ width: '20px', height: '20px' }}
                            />
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 600 }}>{PROVIDER_NAMES[provider].name}</p>
                                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                                    {PROVIDER_NAMES[provider].description}
                                </p>
                            </div>
                            <span className="badge badge-blue">{DEFAULT_MODELS[provider]}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* API Keys */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                    🔑 API Keys
                </h2>
                <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
                    Nhập API key cho các provider bạn muốn sử dụng
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {providers.map((provider) => (
                        <div key={provider} className="input-group">
                            <label className="input-label">{PROVIDER_NAMES[provider].name}</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type={showKeys[provider] ? 'text' : 'password'}
                                    className="input"
                                    placeholder={`Nhập ${provider} API key...`}
                                    value={apiKeys[provider]}
                                    onChange={(e) => setApiKeys(prev => ({ ...prev, [provider]: e.target.value }))}
                                />
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => toggleShowKey(provider)}
                                    style={{ padding: '0.75rem' }}
                                >
                                    {showKeys[provider] ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {provider === 'cloudflare' && (
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Cloudflare Account ID"
                                    value={apiKeys.cloudflareAccountId}
                                    onChange={(e) => setApiKeys(prev => ({ ...prev, cloudflareAccountId: e.target.value }))}
                                    style={{ marginTop: '0.5rem' }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button className="btn btn-primary" onClick={handleSave}>
                    <Check size={18} />
                    Lưu cài đặt
                </button>
                {saved && (
                    <span style={{ color: 'var(--accent-green)', fontWeight: 500 }}>
                        ✓ Đã lưu thành công!
                    </span>
                )}
            </div>
        </Layout>
    )
}
