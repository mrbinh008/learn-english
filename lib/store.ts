import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AIProvider } from './ai/types'

export interface AppSettings {
    aiProvider: AIProvider
    apiKeys: {
        gemini: string
        openai: string
        claude: string
        groq: string
        cloudflare: string
        cloudflareAccountId: string
    }
    theme: 'light' | 'dark' | 'system'
    dailyGoal: number // Words to learn per day
    reviewReminder: boolean
}

interface AppStore {
    settings: AppSettings
    updateSettings: (settings: Partial<AppSettings>) => void
    updateApiKey: (provider: AIProvider, key: string) => void
    isConfigured: (provider: AIProvider) => boolean
}

const defaultSettings: AppSettings = {
    aiProvider: 'gemini',
    apiKeys: {
        gemini: '',
        openai: '',
        claude: '',
        groq: '',
        cloudflare: '',
        cloudflareAccountId: ''
    },
    theme: 'system',
    dailyGoal: 10,
    reviewReminder: true
}

export const useAppStore = create<AppStore>()(
    persist(
        (set, get) => ({
            settings: defaultSettings,

            updateSettings: (newSettings) => {
                set((state) => ({
                    settings: { ...state.settings, ...newSettings }
                }))
            },

            updateApiKey: (provider, key) => {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        apiKeys: {
                            ...state.settings.apiKeys,
                            [provider]: key
                        }
                    }
                }))
            },

            isConfigured: (provider) => {
                const { apiKeys } = get().settings
                switch (provider) {
                    case 'gemini':
                        return !!apiKeys.gemini
                    case 'openai':
                        return !!apiKeys.openai && apiKeys.openai.startsWith('sk-')
                    case 'claude':
                        return !!apiKeys.claude && apiKeys.claude.startsWith('sk-ant-')
                    case 'groq':
                        return !!apiKeys.groq && apiKeys.groq.startsWith('gsk_')
                    case 'cloudflare':
                        return !!apiKeys.cloudflare && !!apiKeys.cloudflareAccountId
                    default:
                        return false
                }
            }
        }),
        {
            name: 'learn-english-settings'
        }
    )
)
