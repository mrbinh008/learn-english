import { NextRequest, NextResponse } from 'next/server'

// Text-to-Speech API endpoint
// Supports multiple free TTS services

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const text = searchParams.get('text')
    const lang = searchParams.get('lang') || 'en-US'
    const service = searchParams.get('service') || 'google'

    if (!text) {
        return NextResponse.json({ error: 'Missing text parameter' }, { status: 400 })
    }

    try {
        console.log(`🔊 TTS Request: "${text}" (${lang}) via ${service}`)

        if (service === 'google') {
            // Google Translate TTS (free, no API key needed)
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}`
            
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            })

            if (!response.ok) {
                throw new Error('Google TTS failed')
            }

            const audioBuffer = await response.arrayBuffer()
            
            return new NextResponse(audioBuffer, {
                headers: {
                    'Content-Type': 'audio/mpeg',
                    'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
                }
            })
        } else if (service === 'voicerss') {
            // VoiceRSS (requires free API key)
            const apiKey = process.env.VOICERSS_API_KEY
            if (!apiKey) {
                return NextResponse.json({ 
                    error: 'VoiceRSS API key not configured',
                    hint: 'Add VOICERSS_API_KEY to .env file (get free key from voicerss.org)'
                }, { status: 500 })
            }

            const url = `https://api.voicerss.org/?key=${apiKey}&hl=${lang}&src=${encodeURIComponent(text)}&c=MP3&f=44khz_16bit_stereo`
            
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error('VoiceRSS TTS failed')
            }

            const audioBuffer = await response.arrayBuffer()
            
            return new NextResponse(audioBuffer, {
                headers: {
                    'Content-Type': 'audio/mpeg',
                    'Cache-Control': 'public, max-age=86400',
                }
            })
        } else {
            return NextResponse.json({ 
                error: 'Invalid service',
                availableServices: ['google', 'voicerss']
            }, { status: 400 })
        }
    } catch (error) {
        console.error('❌ TTS Error:', error)
        return NextResponse.json({ 
            error: 'Failed to generate speech',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

// POST endpoint for batch TTS generation
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { words, lang = 'en-US', service = 'google' } = body

        if (!words || !Array.isArray(words) || words.length === 0) {
            return NextResponse.json({ error: 'Missing or invalid words array' }, { status: 400 })
        }

        console.log(`🔊 Batch TTS Request: ${words.length} words via ${service}`)

        const results = []

        for (const word of words) {
            try {
                const audioUrl = `/api/tts?text=${encodeURIComponent(word)}&lang=${lang}&service=${service}`
                results.push({
                    word,
                    audioUrl,
                    success: true
                })
            } catch (error) {
                results.push({
                    word,
                    audioUrl: null,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                })
            }
        }

        return NextResponse.json({ 
            success: true,
            count: results.length,
            results 
        })
    } catch (error) {
        console.error('❌ Batch TTS Error:', error)
        return NextResponse.json({ 
            error: 'Failed to generate batch speech',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
