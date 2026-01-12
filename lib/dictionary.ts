// Dictionary API Integration with Free Dictionary API
// https://dictionaryapi.dev/

export interface DictionaryPhonetic {
    text?: string
    audio?: string
}

export interface DictionaryDefinition {
    definition: string
    example?: string
    synonyms?: string[]
    antonyms?: string[]
}

export interface DictionaryMeaning {
    partOfSpeech: string
    definitions: DictionaryDefinition[]
    synonyms?: string[]
    antonyms?: string[]
}

export interface DictionaryEntry {
    word: string
    phonetic?: string
    phonetics: DictionaryPhonetic[]
    meanings: DictionaryMeaning[]
    sourceUrls?: string[]
}

export interface DictionaryResult {
    success: boolean
    data?: DictionaryEntry[]
    error?: string
}

const DICTIONARY_API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en'

export async function lookupWord(word: string): Promise<DictionaryResult> {
    try {
        const response = await fetch(`${DICTIONARY_API_BASE}/${encodeURIComponent(word.toLowerCase())}`)

        if (!response.ok) {
            if (response.status === 404) {
                return {
                    success: false,
                    error: `Không tìm thấy từ "${word}" trong từ điển`
                }
            }
            return {
                success: false,
                error: `Lỗi tra từ điển: ${response.statusText}`
            }
        }

        const data: DictionaryEntry[] = await response.json()

        return {
            success: true,
            data
        }
    } catch (error) {
        return {
            success: false,
            error: `Lỗi kết nối: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
    }
}

// Get the best audio URL from phonetics
export function getBestAudioUrl(entry: DictionaryEntry): string | null {
    const phoneticsWithAudio = entry.phonetics.filter(p => p.audio && p.audio.length > 0)

    // Prefer US pronunciation
    const usAudio = phoneticsWithAudio.find(p => p.audio?.includes('-us'))
    if (usAudio?.audio) return usAudio.audio

    // Fallback to any available audio
    return phoneticsWithAudio[0]?.audio || null
}

// Get phonetic text
export function getPhoneticText(entry: DictionaryEntry): string | null {
    if (entry.phonetic) return entry.phonetic

    const phoneticWithText = entry.phonetics.find(p => p.text)
    return phoneticWithText?.text || null
}

// Flatten all definitions
export function getAllDefinitions(entry: DictionaryEntry): Array<{
    partOfSpeech: string
    definition: string
    example?: string
}> {
    const results: Array<{
        partOfSpeech: string
        definition: string
        example?: string
    }> = []

    for (const meaning of entry.meanings) {
        for (const def of meaning.definitions) {
            results.push({
                partOfSpeech: meaning.partOfSpeech,
                definition: def.definition,
                example: def.example
            })
        }
    }

    return results
}

// Get all synonyms
export function getAllSynonyms(entry: DictionaryEntry): string[] {
    const synonyms = new Set<string>()

    for (const meaning of entry.meanings) {
        meaning.synonyms?.forEach(s => synonyms.add(s))
        meaning.definitions.forEach(def => {
            def.synonyms?.forEach(s => synonyms.add(s))
        })
    }

    return Array.from(synonyms)
}

// Get all antonyms
export function getAllAntonyms(entry: DictionaryEntry): string[] {
    const antonyms = new Set<string>()

    for (const meaning of entry.meanings) {
        meaning.antonyms?.forEach(a => antonyms.add(a))
        meaning.definitions.forEach(def => {
            def.antonyms?.forEach(a => antonyms.add(a))
        })
    }

    return Array.from(antonyms)
}
