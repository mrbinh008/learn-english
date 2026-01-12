import { NextResponse } from 'next/server'

// ============================================
// STANDARDIZED API RESPONSE HELPERS
// ============================================

/**
 * Create a successful API response
 */
export function successResponse<T>(data: T, status = 200) {
    return NextResponse.json({ success: true, ...data }, { status })
}

/**
 * Create an error API response
 */
export function errorResponse(message: string, status = 500, details?: string) {
    return NextResponse.json({
        success: false,
        error: message,
        details
    }, { status })
}

/**
 * Create a not found API response
 */
export function notFoundResponse(resource = 'Resource') {
    return NextResponse.json({
        success: false,
        error: `${resource} not found`
    }, { status: 404 })
}

/**
 * Create a bad request API response
 */
export function badRequestResponse(message: string) {
    return NextResponse.json({
        success: false,
        error: message
    }, { status: 400 })
}

// ============================================
// AI RESPONSE PARSING HELPERS
// ============================================

/**
 * Parse JSON from AI response, handling markdown code blocks
 */
export function parseAIJsonResponse<T>(response: string): T | null {
    try {
        let jsonStr = response.trim()
        
        // Remove markdown code blocks if present
        jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '')
        
        // Try to find JSON array
        const arrayMatch = jsonStr.match(/\[[\s\S]*\]/)
        if (arrayMatch) {
            return JSON.parse(arrayMatch[0])
        }
        
        // Try to find JSON object
        const objectMatch = jsonStr.match(/\{[\s\S]*\}/)
        if (objectMatch) {
            return JSON.parse(objectMatch[0])
        }
        
        // Try to parse as-is
        return JSON.parse(jsonStr)
    } catch (error) {
        console.error('Failed to parse AI JSON response:', error)
        return null
    }
}

/**
 * Clean and extract JSON from AI response
 */
export function extractJsonFromAI(response: string): string {
    let jsonStr = response.trim()
    
    // Remove markdown code blocks
    jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '')
    
    // Find array or object
    const arrayMatch = jsonStr.match(/\[[\s\S]*\]/)
    if (arrayMatch) return arrayMatch[0]
    
    const objectMatch = jsonStr.match(/\{[\s\S]*\}/)
    if (objectMatch) return objectMatch[0]
    
    return jsonStr
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
    body: Record<string, unknown>,
    requiredFields: string[]
): { valid: boolean; missing: string[] } {
    const missing = requiredFields.filter(
        field => body[field] === undefined || body[field] === null || body[field] === ''
    )
    return {
        valid: missing.length === 0,
        missing
    }
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string | null | undefined, fallback: T): T {
    if (!json) return fallback
    try {
        return JSON.parse(json)
    } catch {
        return fallback
    }
}
