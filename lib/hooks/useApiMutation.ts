'use client'

import { useState, useCallback } from 'react'

interface UseApiMutationOptions<TInput> {
    onSuccess?: (data: unknown) => void
    onError?: (error: string) => void
    body?: TInput
}

interface UseApiMutationReturn<TInput> {
    mutate: (body?: TInput) => Promise<unknown>
    loading: boolean
    error: string | null
    data: unknown
    reset: () => void
}

/**
 * Custom hook for API mutations (POST, PUT, DELETE)
 * @param url - API endpoint
 * @param method - HTTP method (default: 'POST')
 * @returns Object containing mutate function, loading state, error, and data
 * 
 * @example
 * const { mutate, loading, error } = useApiMutation('/api/decks')
 * await mutate({ name: 'New Deck', description: 'My deck' })
 */
export function useApiMutation<TInput = unknown>(
    url: string,
    method: 'POST' | 'PUT' | 'DELETE' = 'POST'
): UseApiMutationReturn<TInput> {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<unknown>(null)

    const mutate = useCallback(async (body?: TInput, options?: UseApiMutationOptions<TInput>) => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body ? JSON.stringify(body) : undefined
            })
            
            const result = await response.json()
            
            if (!response.ok) {
                throw new Error(result.error || result.message || `HTTP error! status: ${response.status}`)
            }
            
            if (result.success === false) {
                throw new Error(result.error || 'Request failed')
            }
            
            setData(result)
            options?.onSuccess?.(result)
            return result
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred'
            setError(message)
            options?.onError?.(message)
            console.error(`Mutation error for ${url}:`, err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [url, method])

    const reset = useCallback(() => {
        setData(null)
        setError(null)
        setLoading(false)
    }, [])

    return { mutate, loading, error, data, reset }
}

export default useApiMutation
