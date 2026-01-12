import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { createAIClientFromEnv } from '@/lib/ai'

// Dictionary API (fallback)
const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en'

interface DictionaryEntry {
    word: string
    phonetic?: string
    phonetics: Array<{ text?: string; audio?: string }>
    meanings: Array<{
        partOfSpeech: string
        definitions: Array<{ definition: string; example?: string }>
        synonyms: string[]
    }>
}

interface WordResult {
    word: string
    phonetic?: string
    audioUrl?: string
    vietnamese: string
    definitions: string[]
    example?: string
    synonyms: string[]
}

// GET: Fetch words from dictionary and save to database
// POST: Generate flashcard deck from words
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { action, words, topic, useAI = true } = body

        console.log('📥 /api/generate received request:', {
            action,
            words: words?.length || 0,
            topic,
            useAI
        })

        if (action === 'vocabulary' && words && words.length > 0) {
            console.log(`📚 Processing vocabulary with ${useAI ? 'AI' : 'Dictionary API'}`)
            const results = useAI 
                ? await fetchAndSaveVocabularyWithAI(words)
                : await fetchAndSaveVocabulary(words)
            console.log(`✅ Vocabulary processed: ${results.length} words`)
            return NextResponse.json({ success: true, count: results.length, words: results })
        }

        if (action === 'flashcards' && topic) {
            console.log(`🃏 Creating flashcard deck for topic: ${topic}`)
            // Let AI generate vocabulary list if words not provided
            const deck = await createFlashcardDeck(topic, words, useAI)
            console.log(`✅ Flashcard deck created: ${deck.name}`)
            return NextResponse.json({ success: true, deck })
        }

        console.warn('⚠️ Invalid action or missing parameters')
        return NextResponse.json({ error: 'Invalid action or missing parameters' }, { status: 400 })
    } catch (error) {
        console.error('❌ Generate data error:', error)
        if (error instanceof Error) {
            console.error('❌ Error message:', error.message)
            console.error('❌ Error stack:', error.stack)
        }
        return NextResponse.json({ 
            error: 'Failed to generate data',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

// Fetch word from Dictionary API
async function fetchWordFromDictionary(word: string): Promise<DictionaryEntry | null> {
    try {
        const response = await fetch(`${DICTIONARY_API}/${encodeURIComponent(word)}`)
        if (!response.ok) return null
        const data = await response.json()
        return data[0] || null
    } catch {
        return null
    }
}

// Extract best audio URL
function extractAudioUrl(entry: DictionaryEntry): string | undefined {
    for (const p of entry.phonetics) {
        if (p.audio && p.audio.includes('-us.mp3')) return p.audio
    }
    for (const p of entry.phonetics) {
        if (p.audio && p.audio.includes('-uk.mp3')) return p.audio
    }
    return entry.phonetics.find(p => p.audio)?.audio
}

// Extract phonetic text
function extractPhonetic(entry: DictionaryEntry): string | undefined {
    if (entry.phonetic) return entry.phonetic
    return entry.phonetics.find(p => p.text)?.text
}

// Extract definitions
function extractDefinitions(entry: DictionaryEntry): string[] {
    const defs: string[] = []
    for (const meaning of entry.meanings) {
        for (const def of meaning.definitions.slice(0, 2)) {
            defs.push(`(${meaning.partOfSpeech}) ${def.definition}`)
        }
    }
    return defs.slice(0, 3)
}

// Extract example
function extractExample(entry: DictionaryEntry): string | undefined {
    for (const meaning of entry.meanings) {
        for (const def of meaning.definitions) {
            if (def.example) return def.example
        }
    }
    return undefined
}

// Fetch and save vocabulary using local AI - BATCH MODE
async function fetchAndSaveVocabularyWithAI(words: string[]): Promise<WordResult[]> {
    const results: WordResult[] = []

    try {
        console.log('🤖 Initializing AI client...')
        const aiClient = createAIClientFromEnv()
        
        // Check available providers
        const availableProviders = aiClient.getAvailableProviders()
        console.log('📋 Available AI providers:', availableProviders)
        
        if (!availableProviders.includes('openai')) {
            console.error('❌ OpenAI provider not available. Falling back to dictionary API.')
            return fetchAndSaveVocabulary(words)
        }

        console.log(`🔄 Processing ${words.length} words with AI in BATCH mode...`)

        // Process ALL words in a single request for efficiency
        const prompt = `You are an English-Vietnamese dictionary. Provide detailed information for these English words: ${words.join(', ')}

Return a JSON array with this EXACT format for each word:
[
  {
    "word": "example",
    "phonetic": "/ɪɡˈzæmpəl/",
    "vietnamese": "ví dụ, mẫu",
    "definitions": [
      "(noun) một vật, tình huống hoặc hành động được đưa ra để minh họa một quy tắc hoặc nguyên tắc chung",
      "(verb) trích dẫn hoặc đưa ra như một ví dụ"
    ],
    "example": "For example, you could use recycled paper to make cards.",
    "synonyms": ["instance", "case", "illustration", "sample", "model"]
  }
]

IMPORTANT:
- "vietnamese" field MUST be in Vietnamese language (nghĩa tiếng Việt) - short translation
- "definitions" field should be detailed Vietnamese definitions with part of speech in English
- Include 2-3 definitions per word
- Include 3-5 synonyms
- Provide 1 clear example sentence in English

Return ONLY valid JSON array, no markdown code blocks, no additional text.`

        console.log('📤 Sending batch prompt to AI...')
        const response = await aiClient.prompt(prompt)
        console.log('📥 Received AI response length:', response.length)
        console.log('📥 First 300 chars:', response.substring(0, 300))
        
        // Parse AI response
        try {
            // Try to extract JSON array from response
            let jsonStr = response.trim()
            
            // Remove markdown code blocks if present
            jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '')
            
            // Find JSON array
            const arrayMatch = jsonStr.match(/\[[\s\S]*\]/)
            if (arrayMatch) {
                console.log('🔍 Extracted JSON array from response')
                jsonStr = arrayMatch[0]
            }
            
            const wordsData = JSON.parse(jsonStr)
            console.log('✅ Successfully parsed AI response:', wordsData.length, 'words')
            
            // Process each word from AI response
            for (const wordData of wordsData) {
                try {
                    const result: WordResult = {
                        word: wordData.word || wordData.english || 'unknown',
                        phonetic: wordData.phonetic,
                        audioUrl: undefined, // AI doesn't provide audio, we'll add TTS later
                        vietnamese: wordData.vietnamese || wordData.meaning || 'N/A',
                        definitions: Array.isArray(wordData.definitions) ? wordData.definitions : [wordData.definitions || 'N/A'],
                        example: wordData.example,
                        synonyms: Array.isArray(wordData.synonyms) ? wordData.synonyms : []
                    }
                    results.push(result)
                    console.log(`✅ Processed word from AI: ${result.word}`)

                    // Save to database
                    console.log(`💾 Saving to database: ${result.word}`)
                    await prisma.word.upsert({
                        where: { english: result.word.toLowerCase() },
                        create: {
                            english: result.word.toLowerCase(),
                            vietnamese: result.vietnamese,
                            phonetic: result.phonetic,
                            definitions: JSON.stringify(result.definitions),
                            examples: result.example ? JSON.stringify([result.example]) : undefined,
                            synonyms: JSON.stringify(result.synonyms),
                            audioUrl: result.audioUrl,
                            category: 'general'
                        },
                        update: {
                            vietnamese: result.vietnamese,
                            phonetic: result.phonetic,
                            definitions: JSON.stringify(result.definitions),
                            examples: result.example ? JSON.stringify([result.example]) : undefined,
                            synonyms: JSON.stringify(result.synonyms)
                        }
                    })
                    console.log(`✅ Saved to database: ${result.word}`)
                } catch (dbError) {
                    console.error(`❌ Error saving word to database:`, dbError)
                }
            }
            
        } catch (parseError) {
            // Fallback to dictionary API if AI response is invalid
            console.log(`⚠️ AI parsing failed, using dictionary API for all words`)
            console.error('Parse error:', parseError)
            return fetchAndSaveVocabulary(words)
        }
    } catch (error) {
        console.error('❌ AI client error, falling back to dictionary API:', error)
        if (error instanceof Error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            })
        }
        // Fallback to dictionary API
        return fetchAndSaveVocabulary(words)
    }

    console.log(`✅ Completed processing ${results.length} words with AI`)
    return results
}

// Fetch and save vocabulary from Dictionary API
async function fetchAndSaveVocabulary(words: string[]): Promise<WordResult[]> {
    const results: WordResult[] = []

    console.log(`📚 Processing ${words.length} words with Dictionary API...`)

    for (const word of words) {
        const entry = await fetchWordFromDictionary(word)

        if (entry) {
            const result: WordResult = {
                word: entry.word,
                phonetic: extractPhonetic(entry),
                audioUrl: extractAudioUrl(entry),
                vietnamese: entry.meanings[0]?.definitions[0]?.definition || 'N/A', // Dictionary API returns English
                definitions: extractDefinitions(entry),
                example: extractExample(entry),
                synonyms: entry.meanings.flatMap(m => m.synonyms).slice(0, 5)
            }
            results.push(result)
            console.log(`✅ Got word from dictionary: ${result.word}`)

            // Save to database
            await prisma.word.upsert({
                where: { english: entry.word.toLowerCase() },
                create: {
                    english: entry.word.toLowerCase(),
                    vietnamese: result.vietnamese,
                    phonetic: result.phonetic,
                    definitions: JSON.stringify(result.definitions),
                    examples: result.example ? JSON.stringify([result.example]) : undefined,
                    synonyms: JSON.stringify(result.synonyms),
                    audioUrl: result.audioUrl,
                    category: 'general'
                },
                update: {
                    phonetic: result.phonetic,
                    definitions: JSON.stringify(result.definitions),
                    examples: result.example ? JSON.stringify([result.example]) : undefined,
                    synonyms: JSON.stringify(result.synonyms),
                    audioUrl: result.audioUrl
                }
            })
            console.log(`✅ Saved to database: ${word}`)
        } else {
            console.warn(`⚠️ Word not found in dictionary: ${word}`)
        }

        // Rate limit
        await new Promise(r => setTimeout(r, 100))
    }

    console.log(`✅ Completed processing ${results.length} words with Dictionary API`)
    return results
}

// Create flashcard deck
async function createFlashcardDeck(topic: string, words?: string[], useAI: boolean = true) {
    const deckName = topic.charAt(0).toUpperCase() + topic.slice(1)
    
    // Check if deck already exists
    const existingDeck = await prisma.deck.findFirst({
        where: { name: deckName }
    })

    if (existingDeck) {
        console.log(`⚠️ Deck "${deckName}" already exists (ID: ${existingDeck.id}). Returning existing deck.`)
        return {
            id: existingDeck.id,
            name: existingDeck.name,
            cardCount: existingDeck.cardCount
        }
    }

    // Generate vocabulary list with AI if words not provided
    let vocabularyList = words
    if (!vocabularyList || vocabularyList.length === 0) {
        if (useAI) {
            console.log(`🤖 Using AI to generate vocabulary list for topic: ${topic}`)
            vocabularyList = await generateVocabularyListWithAI(topic, 15)
        } else {
            console.log(`📚 Using predefined vocabulary list for topic: ${topic}`)
            vocabularyList = getTopicWords(topic)
        }
    }

    console.log(`📝 Vocabulary list for deck "${deckName}":`, vocabularyList)

    // First fetch vocabulary details with AI
    const vocabResults = useAI 
        ? await fetchAndSaveVocabularyWithAI(vocabularyList)
        : await fetchAndSaveVocabulary(vocabularyList)

    // Create deck
    const deck = await prisma.deck.create({
        data: {
            name: deckName,
            description: `Flashcard deck for ${topic}`,
            cardCount: vocabResults.length
        }
    })

    // Create flashcards
    for (const item of vocabResults) {
        await prisma.flashcard.create({
            data: {
                deckId: deck.id,
                front: item.word,
                back: item.vietnamese || item.definitions[0] || 'N/A',
                phonetic: item.phonetic,
                audioUrl: item.audioUrl,
                example: item.example
            }
        })
    }

    console.log(`✅ Created new deck "${deckName}" with ${vocabResults.length} cards`)

    return {
        id: deck.id,
        name: deck.name,
        cardCount: vocabResults.length
    }
}

// Generate vocabulary list using AI based on topic
async function generateVocabularyListWithAI(topic: string, count: number = 15): Promise<string[]> {
    try {
        console.log(`🤖 Generating ${count} vocabulary words for topic: ${topic}`)
        const aiClient = createAIClientFromEnv()
        
        const availableProviders = aiClient.getAvailableProviders()
        if (!availableProviders.includes('openai')) {
            console.error('❌ OpenAI provider not available. Using fallback words.')
            return getTopicWords(topic)
        }

        const prompt = `Generate a list of ${count} important English vocabulary words related to the topic "${topic}".

Requirements:
- Choose practical, commonly used words that learners would benefit from knowing
- Include a mix of:
  * Nouns (things, concepts)
  * Verbs (actions)
  * Adjectives (descriptive words)
  * Common phrases or collocations (2-3 words max)
- Words should be appropriate for intermediate English learners
- Focus on words that are specifically relevant to ${topic}

Return ONLY a JSON array of words, no explanations or markdown:
["word1", "word2", "word3", ...]

Example for topic "cooking":
["recipe", "ingredient", "chop", "boil", "delicious", "flavor", "seasoning", "simmer", "taste", "fresh", "bake", "stir", "tender", "crispy", "appetizing"]`

        console.log('📤 Sending vocabulary generation prompt to AI...')
        const response = await aiClient.prompt(prompt)
        console.log('📥 Received AI response:', response.substring(0, 200))
        
        // Parse AI response
        let jsonStr = response.trim()
        jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '')
        
        // Find JSON array
        const arrayMatch = jsonStr.match(/\[[\s\S]*?\]/)
        if (arrayMatch) {
            const words = JSON.parse(arrayMatch[0])
            if (Array.isArray(words) && words.length > 0) {
                console.log(`✅ Generated ${words.length} words with AI:`, words.slice(0, 5), '...')
                return words
            }
        }
        
        console.warn('⚠️ Failed to parse AI response, using fallback')
        return getTopicWords(topic)
    } catch (error) {
        console.error('❌ AI vocabulary generation failed:', error)
        return getTopicWords(topic)
    }
}

// Get default words for a topic (fallback)
function getTopicWords(topic: string): string[] {
    const topicWords: Record<string, string[]> = {
        'business': ['negotiate', 'deadline', 'budget', 'proposal', 'revenue', 'strategy', 'stakeholder', 'benchmark'],
        'travel': ['destination', 'itinerary', 'reservation', 'departure', 'luggage', 'accommodation', 'currency', 'passport'],
        'technology': ['software', 'hardware', 'algorithm', 'database', 'interface', 'encryption', 'bandwidth', 'protocol'],
        'academic': ['hypothesis', 'methodology', 'analysis', 'conclusion', 'abstract', 'citation', 'thesis', 'bibliography'],
        'daily': ['breakfast', 'commute', 'meeting', 'exercise', 'relaxation', 'schedule', 'routine', 'hobby'],
        'food': ['delicious', 'appetite', 'ingredient', 'recipe', 'cuisine', 'beverage', 'dessert', 'nutrition']
    }

    return topicWords[topic.toLowerCase()] || topicWords['daily']
}
