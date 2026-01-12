'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'

interface TabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Whether this tab is currently active */
    active: boolean
    /** Icon element */
    icon?: ReactNode
    /** Tab label */
    children: ReactNode
}

/**
 * Reusable tab button component with consistent styling
 * 
 * @example
 * <TabButton 
 *   active={activeTab === 'vocabulary'} 
 *   onClick={() => setActiveTab('vocabulary')}
 *   icon={<BookOpen size={20} />}
 * >
 *   Vocabulary
 * </TabButton>
 */
export function TabButton({ active, icon, children, style, ...props }: TabButtonProps) {
    return (
        <button
            style={{
                padding: '1rem 1.5rem',
                background: 'none',
                border: 'none',
                borderBottom: active ? '3px solid var(--primary-500)' : 'none',
                color: active ? 'var(--primary-500)' : 'var(--gray-500)',
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '-2px',
                transition: 'color 0.2s',
                ...style
            }}
            {...props}
        >
            {icon}
            {children}
        </button>
    )
}

export default TabButton
