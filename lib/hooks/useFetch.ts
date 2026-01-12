'use client'

import { useState, useCallback } from 'react'

interface UseFetchOptions {
    immediate?: boolean
}

interface UseFetchReturn<T> {
    data: T | null
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
}

/**
 * Custom hook for data fetching with loading and error states
 * @param url - API endpoint to fetch from
 * @param options - Configuration options
 * @returns Object containing data, loading state, error, and refetch function
 * 
 * @example
 * const { data, loading, error, refetch } = useFetch<Deck[]>('/api/decks')
 */
export function useFetch<T>(
    url: string,
    options: UseFetchOptions = { immediate: true }
): UseFetchReturn<T> {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(options.immediate ?? true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await fetch(url)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const result = await response.json()
            
            // Handle different API response formats
            if (result.success !== undefined) {
                if (result.success) {
                    // Extract data from various response formats
                    setData(result.data || result.decks || result.words || result.passages || result)
                } else {
                    throw new Error(result.error || 'Request failed')
                }
            } else {
                setData(result)
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred'
            setError(message)
            console.error(`Fetch error for ${url}:`, err)
        } finally {
            setLoading(false)
        }
    }, [url])

    // Initial fetch on mount if immediate is true
    useState(() => {
        if (options.immediate) {
            fetchData()
        }
    })

    return { data, loading, error, refetch: fetchData }
}

export default useFetch
