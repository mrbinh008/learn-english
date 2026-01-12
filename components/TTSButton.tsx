'use client'

import { useState, useRef } from 'react'

interface TTSButtonProps {
    text: string
    lang?: string
    className?: string
    iconOnly?: boolean
}

/**
 * Text-to-Speech Button Component
 * Phát âm từ/câu sử dụng Google TTS miễn phí
 * 
 * Usage:
 * <TTSButton text="hello" />
 * <TTSButton text="hello" lang="en-US" iconOnly />
 */
export default function TTSButton({ text, lang = 'en-US', className = '', iconOnly = false }: TTSButtonProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const handlePlay = async () => {
        if (isPlaying) {
            // Stop current audio
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            }
            setIsPlaying(false)
            return
        }

        try {
            setError(null)
            setIsPlaying(true)

            // Create audio element if not exists
            if (!audioRef.current) {
                audioRef.current = new Audio()
                audioRef.current.onended = () => setIsPlaying(false)
                audioRef.current.onerror = () => {
                    setError('Không thể phát âm')
                    setIsPlaying(false)
                }
            }

            // Set audio source and play
            audioRef.current.src = `/api/tts?text=${encodeURIComponent(text)}&lang=${lang}&service=google`
            await audioRef.current.play()
        } catch (err) {
            console.error('TTS Error:', err)
            setError('Không thể phát âm')
            setIsPlaying(false)
        }
    }

    return (
        <div className="inline-flex items-center gap-2">
            <button
                onClick={handlePlay}
                disabled={!text}
                className={`
                    inline-flex items-center gap-2 
                    px-3 py-2 rounded-lg
                    transition-all duration-200
                    ${isPlaying 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${className}
                `}
                title={isPlaying ? 'Đang phát...' : 'Phát âm'}
            >
                {isPlaying ? (
                    <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                    </svg>
                )}
                {!iconOnly && (
                    <span className="text-sm font-medium">
                        {isPlaying ? 'Dừng' : 'Phát âm'}
                    </span>
                )}
            </button>
            {error && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    )
}
