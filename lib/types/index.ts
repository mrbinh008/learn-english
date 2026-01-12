// ============================================
// SHARED TYPES FOR LEARN-ENGLISH APPLICATION
// ============================================

// -------------------- VOCABULARY --------------------

export interface WordData {
    id?: string
    english: string
    vietnamese: string
    phonetic?: string
    partOfSpeech?: string
    definitions: string[]
    examples: string[]
    synonyms: string[]
    antonyms: string[]
    audioUrl?: string
    category?: string
}

export interface VocabularyItem {
    word: string
    vietnamese: string
    definition: string
    example?: string
}

// -------------------- FLASHCARDS --------------------

export interface Flashcard {
    id: string
    front: string
    back: string
    phonetic?: string
    audioUrl?: string
    example?: string
    deckId?: string
    easeFactor?: number
    interval?: number
    nextReview?: string
    reviewCount?: number
}

export interface Deck {
    id: string
    name: string
    description?: string | null
    cardCount: number
    flashcards?: Flashcard[]
    createdAt?: string
    updatedAt?: string
}

// -------------------- READING --------------------

export interface Question {
    question: string
    questionVi?: string
    options: string[]
    optionsVi?: string[]
    answer?: string
    correctAnswer?: number
    explanation?: string
    explanationVi?: string
}

export interface ReadingPassage {
    id: string
    title: string
    titleVi?: string
    content: string
    translation?: string
    level: Level
    category: string
    questions: Question[]
    vocabulary?: VocabularyItem[]
    summary?: string
    summaryVi?: string
    wordCount?: number
    readTime?: number
    createdAt?: string
}

// -------------------- GRAMMAR --------------------

export interface GrammarTopic {
    id: string
    name: string
    nameVi?: string
    description?: string
    descriptionVi?: string
    level: Level
    exercises?: GrammarExercise[]
}

export interface GrammarExercise {
    id: string
    question: string
    questionVi?: string
    options: string[]
    answer: string
    explanation?: string
    explanationVi?: string
}

// -------------------- COMMON --------------------

export type Level = 'beginner' | 'intermediate' | 'advanced'

export type Category = 
    | 'daily' 
    | 'business' 
    | 'travel' 
    | 'technology' 
    | 'food' 
    | 'health' 
    | 'education'
    | 'environment'
    | 'entertainment'
    | 'sports'

// -------------------- API RESPONSES --------------------

export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    count: number
    page?: number
    totalPages?: number
}

// -------------------- UI STATES --------------------

export interface LoadingState {
    isLoading: boolean
    error: string | null
}

export interface ModalState {
    isOpen: boolean
    data?: unknown
}

// -------------------- CONSTANTS --------------------

export const LEVEL_LABELS: Record<Level, string> = {
    beginner: 'Cơ bản',
    intermediate: 'Trung cấp',
    advanced: 'Nâng cao'
}

export const LEVEL_COLORS: Record<Level, string> = {
    beginner: 'badge-green',
    intermediate: 'badge-orange',
    advanced: 'badge-red'
}

export const CATEGORY_LABELS: Record<string, string> = {
    daily: 'Hàng ngày',
    business: 'Kinh doanh',
    travel: 'Du lịch',
    technology: 'Công nghệ',
    food: 'Ẩm thực',
    health: 'Sức khỏe',
    education: 'Giáo dục',
    environment: 'Môi trường',
    entertainment: 'Giải trí',
    sports: 'Thể thao'
}
