'use client'

import { useState, useCallback } from 'react'
import type { Question } from '@/lib/types'

interface UseQuizReturn {
    currentIndex: number
    currentQuestion: Question | null
    selectedAnswer: number | null
    showResult: boolean
    score: number
    isCompleted: boolean
    progress: number
    selectAnswer: (index: number) => void
    submitAnswer: () => void
    nextQuestion: () => void
    previousQuestion: () => void
    reset: () => void
}

/**
 * Custom hook for quiz/test state management
 * @param questions - Array of quiz questions
 * @returns Object containing quiz state and control functions
 * 
 * @example
 * const quiz = useQuiz(passage.questions)
 * quiz.selectAnswer(2)
 * quiz.submitAnswer()
 */
export function useQuiz(questions: Question[]): UseQuizReturn {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [score, setScore] = useState(0)

    const currentQuestion = questions[currentIndex] || null
    const isCompleted = currentIndex >= questions.length
    const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0

    const selectAnswer = useCallback((index: number) => {
        if (!showResult) {
            setSelectedAnswer(index)
        }
    }, [showResult])

    const submitAnswer = useCallback(() => {
        if (selectedAnswer === null || !currentQuestion) return
        
        const correctAnswer = currentQuestion.correctAnswer ?? 0
        if (selectedAnswer === correctAnswer) {
            setScore(prev => prev + 1)
        }
        setShowResult(true)
    }, [selectedAnswer, currentQuestion])

    const nextQuestion = useCallback(() => {
        if (currentIndex < questions.length) {
            setCurrentIndex(prev => prev + 1)
            setSelectedAnswer(null)
            setShowResult(false)
        }
    }, [currentIndex, questions.length])

    const previousQuestion = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
            setSelectedAnswer(null)
            setShowResult(false)
        }
    }, [currentIndex])

    const reset = useCallback(() => {
        setCurrentIndex(0)
        setSelectedAnswer(null)
        setShowResult(false)
        setScore(0)
    }, [])

    return {
        currentIndex,
        currentQuestion,
        selectedAnswer,
        showResult,
        score,
        isCompleted,
        progress,
        selectAnswer,
        submitAnswer,
        nextQuestion,
        previousQuestion,
        reset
    }
}

export default useQuiz
