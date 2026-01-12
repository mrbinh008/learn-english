'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid var(--card-border)',
    borderRadius: '0.5rem',
    fontSize: '1rem'
}

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 500
}

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    /** Wrapper style */
    wrapperStyle?: React.CSSProperties
}

/**
 * Reusable form input component with consistent styling
 * 
 * @example
 * <FormInput 
 *   label="Topic" 
 *   placeholder="Enter topic..."
 *   value={topic}
 *   onChange={(e) => setTopic(e.target.value)}
 * />
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
    label,
    error,
    wrapperStyle,
    style,
    ...props
}, ref) => {
    return (
        <div style={{ marginBottom: '1.5rem', ...wrapperStyle }}>
            {label && (
                <label style={labelStyle}>
                    {label}
                </label>
            )}
            <input
                ref={ref}
                style={{ ...inputStyle, ...style }}
                {...props}
            />
            {error && (
                <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    {error}
                </p>
            )}
        </div>
    )
})

FormInput.displayName = 'FormInput'

export default FormInput
