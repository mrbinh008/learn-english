'use client'

import { ReactNode } from 'react'

interface EmptyStateProps {
    /** Emoji or icon to display */
    icon?: string | ReactNode
    /** Main title */
    title: string
    /** Description text */
    description?: string
    /** Action button or element */
    action?: ReactNode
}

/**
 * Reusable empty state component for when there's no data
 * 
 * @example
 * <EmptyState
 *   icon="📚"
 *   title="Chưa có bộ thẻ nào"
 *   description="Tạo deck mới hoặc tải dữ liệu từ các chủ đề có sẵn"
 *   action={<button className="btn btn-primary">Tạo deck mới</button>}
 * />
 */
export function EmptyState({ 
    icon = '📭', 
    title, 
    description, 
    action 
}: EmptyStateProps) {
    return (
        <div 
            className="card" 
            style={{ 
                textAlign: 'center', 
                padding: '3rem' 
            }}
        >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {icon}
            </div>
            <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 600, 
                marginBottom: '0.5rem' 
            }}>
                {title}
            </h3>
            {description && (
                <p style={{ 
                    color: 'var(--gray-500)', 
                    marginBottom: action ? '1.5rem' : 0 
                }}>
                    {description}
                </p>
            )}
            {action}
        </div>
    )
}

export default EmptyState
