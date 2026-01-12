'use client'

import { ReactNode } from 'react'
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

type AlertVariant = 'success' | 'error' | 'info' | 'warning'

interface AlertProps {
    /** Alert variant */
    variant: AlertVariant
    /** Alert message */
    children: ReactNode
    /** Optional custom icon */
    icon?: ReactNode
    /** Optional onDismiss callback */
    onDismiss?: () => void
}

const variantStyles: Record<AlertVariant, { background: string; border: string; color: string }> = {
    success: {
        background: '#dcfce7',
        border: '#22c55e',
        color: '#166534'
    },
    error: {
        background: '#fee2e2',
        border: '#ef4444',
        color: '#991b1b'
    },
    info: {
        background: '#dbeafe',
        border: '#3b82f6',
        color: '#1e40af'
    },
    warning: {
        background: '#fef3c7',
        border: '#f59e0b',
        color: '#92400e'
    }
}

const variantIcons: Record<AlertVariant, ReactNode> = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertTriangle size={20} />
}

/**
 * Reusable alert component for displaying success/error/info messages
 * 
 * @example
 * <Alert variant="success">Operation completed successfully!</Alert>
 * <Alert variant="error">Something went wrong</Alert>
 */
export function Alert({ variant, children, icon, onDismiss }: AlertProps) {
    const styles = variantStyles[variant]
    const defaultIcon = variantIcons[variant]

    return (
        <div
            style={{
                padding: '1rem',
                background: styles.background,
                border: `2px solid ${styles.border}`,
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                color: styles.color
            }}
        >
            {icon || defaultIcon}
            <div style={{ flex: 1 }}>{children}</div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        color: styles.color,
                        opacity: 0.7
                    }}
                >
                    ×
                </button>
            )}
        </div>
    )
}

export default Alert
