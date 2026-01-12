'use client'

import { ReactNode } from 'react'

interface PageHeaderProps {
    /** Page title */
    title: string
    /** Page subtitle/description */
    subtitle?: string
    /** Action buttons or elements */
    actions?: ReactNode
    /** Back button or breadcrumb */
    backElement?: ReactNode
}

/**
 * Reusable page header component
 * 
 * @example
 * <PageHeader
 *   title="Flashcards"
 *   subtitle="Học từ vựng hiệu quả"
 *   actions={
 *     <button className="btn btn-primary">Tạo deck mới</button>
 *   }
 * />
 */
export function PageHeader({ 
    title, 
    subtitle, 
    actions,
    backElement
}: PageHeaderProps) {
    return (
        <div className="page-header">
            {backElement && (
                <div style={{ marginBottom: '1rem' }}>
                    {backElement}
                </div>
            )}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <h1 className="page-title">{title}</h1>
                    {subtitle && (
                        <p className="page-subtitle">{subtitle}</p>
                    )}
                </div>
                {actions && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {actions}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PageHeader
