'use client'

import type { Level } from '@/lib/types'
import { LEVEL_LABELS, LEVEL_COLORS } from '@/lib/types'

interface LevelBadgeProps {
    /** Level value */
    level: Level
    /** Optional size variant */
    size?: 'sm' | 'md'
}

/**
 * Reusable level badge component with consistent styling
 * 
 * @example
 * <LevelBadge level="intermediate" />
 */
export function LevelBadge({ level, size = 'md' }: LevelBadgeProps) {
    const label = LEVEL_LABELS[level] || level
    const colorClass = LEVEL_COLORS[level] || 'badge-blue'
    
    return (
        <span 
            className={`badge ${colorClass}`}
            style={size === 'sm' ? { fontSize: '0.75rem', padding: '0.2rem 0.5rem' } : undefined}
        >
            {label}
        </span>
    )
}

export default LevelBadge
