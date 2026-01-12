'use client'

import { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
    /** Whether the modal is open */
    isOpen: boolean
    /** Function to close the modal */
    onClose: () => void
    /** Modal title */
    title?: string
    /** Modal content */
    children: ReactNode
    /** Maximum width of modal (default: '500px') */
    maxWidth?: string
    /** Show close button in header */
    showCloseButton?: boolean
    /** Custom header icon */
    icon?: ReactNode
    /** Custom styles for modal container */
    containerStyle?: React.CSSProperties
}

/**
 * Reusable modal component with overlay
 * 
 * @example
 * <Modal 
 *   isOpen={showModal} 
 *   onClose={() => setShowModal(false)}
 *   title="Create New Deck"
 * >
 *   <form>...</form>
 * </Modal>
 */
export function Modal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = '500px',
    showCloseButton = true,
    icon,
    containerStyle
}: ModalProps) {
    if (!isOpen) return null

    return (
        <div 
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem'
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div 
                className="card" 
                style={{ 
                    width: '100%', 
                    maxWidth,
                    maxHeight: '90vh',
                    overflow: 'auto',
                    ...containerStyle
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '1.5rem' 
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {icon}
                            {title && (
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                                    {title}
                                </h3>
                            )}
                        </div>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    cursor: 'pointer', 
                                    padding: '0.5rem',
                                    color: 'var(--gray-500)',
                                    borderRadius: '0.375rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}
                
                {/* Content */}
                {children}
            </div>
        </div>
    )
}

export default Modal
