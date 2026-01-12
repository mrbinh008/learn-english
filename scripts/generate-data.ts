#!/usr/bin/env npx tsx
/**
 * CLI Script to generate vocabulary data from Dictionary API and AI
 * 
 * Usage:
 *   npx tsx scripts/generate-data.ts vocabulary <words...>
 *   npx tsx scripts/generate-data.ts flashcards <topic>
 *   npx tsx scripts/generate-data.ts ai-generate <type> <topic>
 * 
 * Examples:
 *   npx tsx scripts/generate-data.ts vocabulary hello goodbye thanks
 *   npx tsx scripts/generate-data.ts flashcards "business english"
 *   npx tsx scripts/generate-data.ts ai-generate vocabulary "food and drinks"
 */

import 'dotenv/config'
import prisma from '../lib/db'

// Dictionary API
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

// Generate vocabulary from words
async function generateVocabulary(words: string[]) {
    console.log(`\n🔍 Fetching ${words.length} words from Dictionary API...\n`)

    const results: Array<{
        word: string
        phonetic?: string
        audioUrl?: string
        definitions: string[]
        example?: string
        synonyms: string[]
    }> = []

    for (const word of words) {
        process.stdout.write(`  📖 ${word}... `)

        const entry = await fetchWordFromDictionary(word)

        if (entry) {
            const result = {
                word: entry.word,
                phonetic: extractPhonetic(entry),
                audioUrl: extractAudioUrl(entry),
                definitions: extractDefinitions(entry),
                example: extractExample(entry),
                synonyms: entry.meanings.flatMap(m => m.synonyms).slice(0, 5)
            }
            results.push(result)
            console.log('✅')
        } else {
            console.log('❌ not found')
        }

        // Rate limit
        await new Promise(r => setTimeout(r, 200))
    }

    // Output as JSON
    console.log('\n📦 Generated Data:\n')
    console.log(JSON.stringify(results, null, 2))

    // Save to database
    console.log('\n💾 Saving to database...')

    for (const item of results) {
        await prisma.word.upsert({
            where: { english: item.word.toLowerCase() },
            create: {
                english: item.word.toLowerCase(),
                vietnamese: item.definitions[0] || 'N/A',
                phonetic: item.phonetic,
                definitions: JSON.stringify(item.definitions),
                examples: item.example ? JSON.stringify([item.example]) : undefined,
                synonyms: JSON.stringify(item.synonyms),
                audioUrl: item.audioUrl,
                category: 'general'
            },
            update: {
                phonetic: item.phonetic,
                definitions: JSON.stringify(item.definitions),
                examples: item.example ? JSON.stringify([item.example]) : undefined,
                synonyms: JSON.stringify(item.synonyms),
                audioUrl: item.audioUrl
            }
        })
    }

    console.log(`\n✅ Saved ${results.length} words to database!`)
    return results
}

// Generate flashcard deck
async function generateFlashcardDeck(topic: string) {
    console.log(`\n🃏 Creating flashcard deck for topic: "${topic}"\n`)

    // Sample words based on topic
    const topicWords: Record<string, string[]> = {
        'business english': ['negotiate', 'deadline', 'budget', 'proposal', 'revenue', 'strategy', 'stakeholder', 'benchmark'],
        'business': ['negotiate', 'deadline', 'budget', 'proposal', 'revenue', 'strategy', 'stakeholder', 'benchmark'],
        'travel': ['destination', 'itinerary', 'reservation', 'departure', 'luggage', 'accommodation', 'currency', 'passport'],
        'technology': ['software', 'hardware', 'algorithm', 'database', 'interface', 'encryption', 'bandwidth', 'protocol'],
        'academic': ['hypothesis', 'methodology', 'analysis', 'conclusion', 'abstract', 'citation', 'thesis', 'bibliography'],
        'daily': ['breakfast', 'commute', 'meeting', 'exercise', 'relaxation', 'schedule', 'routine', 'hobby'],
        'food': ['delicious', 'appetite', 'ingredient', 'recipe', 'cuisine', 'beverage', 'dessert', 'nutrition']
    }

    const words = topicWords[topic.toLowerCase()] || topicWords['daily']

    console.log(`  📚 Words: ${words.join(', ')}\n`)

    // First fetch from dictionary
    const results = await generateVocabulary(words)

    // Create deck
    const deck = await prisma.deck.create({
        data: {
            name: topic.charAt(0).toUpperCase() + topic.slice(1),
            description: `Flashcard deck for ${topic}`,
            cardCount: results.length
        }
    })

    // Create flashcards from the words
    for (const item of results) {
        await prisma.flashcard.create({
            data: {
                deckId: deck.id,
                front: item.word,
                back: item.definitions[0] || 'N/A',
                phonetic: item.phonetic,
                audioUrl: item.audioUrl,
                example: item.example
            }
        })
    }

    console.log(`\n✅ Created deck "${topic}" with ${results.length} cards!`)
    console.log(`   Deck ID: ${deck.id}`)
}

// AI-powered generation (requires API key)
async function aiGenerate(type: string, topic: string) {
    console.log(`\n🤖 AI Generation for ${type}: "${topic}"\n`)

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        console.log(`
❌ No API key found!

Please set one of these environment variables:
  - GEMINI_API_KEY
  - OPENAI_API_KEY
  - ANTHROPIC_API_KEY

Example:
  GEMINI_API_KEY=xxx npx tsx scripts/generate-data.ts ai-generate vocabulary "emotions"
    `)
        process.exit(1)
    }

    // Use Gemini API
    const prompt = type === 'vocabulary'
        ? `Generate 10 English vocabulary words related to "${topic}" for Vietnamese learners.
Return JSON array: [{"english":"word","vietnamese":"nghĩa tiếng Việt","example":"example sentence"}]
Only return the JSON, no explanation.`
        : `Generate 5 quiz questions about "${topic}" in English for Vietnamese learners.
Return JSON array: [{"question":"question text","options":["A","B","C","D"],"correctAnswer":0,"explanation":"giải thích tiếng Việt"}]
Only return the JSON, no explanation.`

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        })

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

        // Extract JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
            const items = JSON.parse(jsonMatch[0])
            console.log('📦 Generated content:\n')
            console.log(JSON.stringify(items, null, 2))

            // Save vocabulary to database
            if (type === 'vocabulary') {
                console.log('\n💾 Saving to database...')
                for (const item of items) {
                    await prisma.word.upsert({
                        where: { english: item.english.toLowerCase() },
                        create: {
                            english: item.english.toLowerCase(),
                            vietnamese: item.vietnamese,
                            examples: item.example ? JSON.stringify([item.example]) : undefined,
                            category: topic.toLowerCase()
                        },
                        update: {
                            vietnamese: item.vietnamese,
                            examples: item.example ? JSON.stringify([item.example]) : undefined
                        }
                    })
                }
                console.log(`\n✅ Saved ${items.length} AI-generated words!`)
            }
        } else {
            console.log('❌ Could not parse AI response')
            console.log('Raw response:', text)
        }
    } catch (error) {
        console.error('❌ AI generation failed:', error)
    }
}

// Main CLI handler
async function main() {
    const args = process.argv.slice(2)
    const command = args[0]

    if (!command) {
        console.log(`
📚 Learn English - Data Generation CLI

Usage:
  npx tsx scripts/generate-data.ts vocabulary <words...>
  npx tsx scripts/generate-data.ts flashcards <topic>
  npx tsx scripts/generate-data.ts ai-generate <type> <topic>

Examples:
  npx tsx scripts/generate-data.ts vocabulary hello goodbye thanks
  npx tsx scripts/generate-data.ts flashcards "business"
  npx tsx scripts/generate-data.ts ai-generate vocabulary "emotions"

Topics: business, travel, technology, academic, daily, food
    `)
        process.exit(0)
    }

    try {
        switch (command) {
            case 'vocabulary':
                const words = args.slice(1)
                if (words.length === 0) {
                    console.error('❌ Please provide words to fetch')
                    process.exit(1)
                }
                await generateVocabulary(words)
                break

            case 'flashcards':
                const topic = args[1] || 'daily'
                await generateFlashcardDeck(topic)
                break

            case 'ai-generate':
                const genType = args[1] || 'vocabulary'
                const genTopic = args[2] || 'daily life'
                await aiGenerate(genType, genTopic)
                break

            default:
                console.error(`❌ Unknown command: ${command}`)
                process.exit(1)
        }
    } finally {
        await prisma.$disconnect()
    }
}

main().catch(console.error)
