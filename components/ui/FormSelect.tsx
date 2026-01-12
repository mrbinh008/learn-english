'use client'

import { SelectHTMLAttributes, forwardRef } from 'react'

const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid var(--card-border)',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    backgroundColor: 'var(--card-bg)'
}

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 500
}

interface SelectOption {
    value: string
    label: string
}

interface FormSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    label?: string
    options: SelectOption[]
    error?: string
    /** Wrapper style */
    wrapperStyle?: React.CSSProperties
}

/**
 * Reusable form select component with consistent styling
 * 
 * @example
 * <FormSelect 
 *   label="Level" 
 *   value={level}
 *   onChange={(e) => setLevel(e.target.value)}
 *   options={[
 *     { value: 'beginner', label: 'Beginner' },
 *     { value: 'intermediate', label: 'Intermediate' },
 *     { value: 'advanced', label: 'Advanced' }
 *   ]}
 * />
 */
export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(({
    label,
    options,
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
            <select
                ref={ref}
                style={{ ...selectStyle, ...style }}
                {...props}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    {error}
                </p>
            )}
        </div>
    )
})

FormSelect.displayName = 'FormSelect'

export default FormSelect
