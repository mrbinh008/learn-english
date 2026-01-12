'use client'

import { useState, useCallback } from 'react'

interface UseModalReturn<T = unknown> {
    isOpen: boolean
    data: T | null
    open: (data?: T) => void
    close: () => void
    toggle: () => void
}

/**
 * Custom hook for modal state management
 * @returns Object containing modal state and control functions
 * 
 * @example
 * const modal = useModal<WordData>()
 * modal.open({ word: 'hello', ... })
 * 
 * {modal.isOpen && <Modal onClose={modal.close} data={modal.data} />}
 */
export function useModal<T = unknown>(): UseModalReturn<T> {
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState<T | null>(null)

    const open = useCallback((modalData?: T) => {
        setData(modalData ?? null)
        setIsOpen(true)
    }, [])

    const close = useCallback(() => {
        setIsOpen(false)
        // Delay clearing data to allow for exit animations
        setTimeout(() => setData(null), 300)
    }, [])

    const toggle = useCallback(() => {
        setIsOpen(prev => !prev)
    }, [])

    return { isOpen, data, open, close, toggle }
}

export default useModal
