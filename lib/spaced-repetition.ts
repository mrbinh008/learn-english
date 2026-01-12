// SM-2 Spaced Repetition Algorithm
// Based on SuperMemo 2 algorithm by Piotr Wozniak

export interface ReviewItem {
    easeFactor: number  // EF - Easiness Factor (min 1.3)
    interval: number    // Interval in days
    reviewCount: number // Number of reviews
    lastReview?: Date   // Last review date
}

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5
// 0 - Complete blackout, no memory
// 1 - Incorrect response; correct one remembered after seeing it
// 2 - Incorrect response; correct one seemed easy to recall
// 3 - Correct response recalled with serious difficulty
// 4 - Correct response after hesitation
// 5 - Perfect response, no hesitation

export interface ReviewResult {
    easeFactor: number
    interval: number
    nextReview: Date
    reviewCount: number
}

// Calculate new interval and ease factor based on quality
export function calculateNextReview(item: ReviewItem, quality: ReviewQuality): ReviewResult {
    let { easeFactor, interval, reviewCount } = item

    // If quality < 3, reset to beginning but keep ease factor
    if (quality < 3) {
        interval = 1
        reviewCount = 0
    } else {
        // Successful recall
        if (reviewCount === 0) {
            interval = 1
        } else if (reviewCount === 1) {
            interval = 6
        } else {
            interval = Math.round(interval * easeFactor)
        }
        reviewCount += 1
    }

    // Update ease factor
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

    // EF should not go below 1.3
    if (easeFactor < 1.3) {
        easeFactor = 1.3
    }

    // Calculate next review date
    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + interval)

    return {
        easeFactor,
        interval,
        nextReview,
        reviewCount
    }
}

// Get items due for review
export function isDueForReview(nextReview: Date): boolean {
    return new Date() >= nextReview
}

// Convert quality to Vietnamese label
export function getQualityLabel(quality: ReviewQuality): string {
    const labels: Record<ReviewQuality, string> = {
        0: 'Quên hoàn toàn',
        1: 'Sai - nhớ lại khi thấy đáp án',
        2: 'Sai - dễ nhớ lại',
        3: 'Đúng - khó nhớ',
        4: 'Đúng - hơi do dự',
        5: 'Đúng - hoàn hảo'
    }
    return labels[quality]
}

// Simple quality buttons for UI
export interface QualityButton {
    quality: ReviewQuality
    label: string
    color: string
    description: string
}

export const QUALITY_BUTTONS: QualityButton[] = [
    { quality: 1, label: 'Quên', color: 'red', description: 'Không nhớ gì cả' },
    { quality: 3, label: 'Khó', color: 'orange', description: 'Nhớ nhưng khó khăn' },
    { quality: 4, label: 'Tốt', color: 'blue', description: 'Nhớ được, hơi chậm' },
    { quality: 5, label: 'Dễ', color: 'green', description: 'Nhớ ngay lập tức' }
]

// Calculate estimated days until mastery
export function estimateDaysToMastery(currentInterval: number, targetInterval: number = 30): number {
    if (currentInterval >= targetInterval) return 0

    let days = 0
    let interval = currentInterval
    const ef = 2.5

    while (interval < targetInterval) {
        days += interval
        interval = Math.round(interval * ef)
    }

    return days
}
