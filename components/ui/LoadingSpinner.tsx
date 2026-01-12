'use client'

import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
    /** Optional text to display below spinner */
    text?: string
    /** Size of the spinner (default: 'md') */
    size?: 'sm' | 'md' | 'lg'
    /** Use full page layout with centering */
    fullPage?: boolean
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
}

/**
 * Reusable loading spinner component
 * 
 * @example
 * // Simple spinner
 * <LoadingSpinner />
 * 
 * // With text
 * <LoadingSpinner text="Đang tải..." />
 * 
 * // Full page centered
 * <LoadingSpinner fullPage text="Đang xử lý..." />
 */
export function LoadingSpinner({ 
    text, 
    size = 'md', 
    fullPage = false 
}: LoadingSpinnerProps) {
    const spinner = (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '0.75rem'
        }}>
            <Loader2 
                className={`${sizeClasses[size]} animate-spin text-blue-500`} 
            />
            {text && (
                <p style={{ 
                    color: 'var(--gray-500)', 
                    fontSize: size === 'sm' ? '0.8rem' : '0.9rem'
                }}>
                    {text}
                </p>
            )}
        </div>
    )

    if (fullPage) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '50vh' 
            }}>
                {spinner}
            </div>
        )
    }

    return spinner
}

export default LoadingSpinner
