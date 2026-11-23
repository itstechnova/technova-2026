'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { fieldError, fieldInput, fieldLabel } from '@/components/portal/ui'

type Props = {
  id?: string
  name?: string
  label: string
  placeholder?: string
  autoComplete: 'current-password' | 'new-password'
  minLength?: number
  /** Helper text under the field. */
  hint?: string
  /** Problem with what was typed, shown under the field. */
  error?: string
  /** Replaces the wrapper's classes (default: a 440px-wide column). */
  className?: string
  /** Replaces the input's classes (default: the shared `fieldInput`). */
  inputClassName?: string
}

/** Password input with a show/hide toggle. */
export function PasswordField({
  id = 'password',
  name = 'password',
  label,
  placeholder,
  autoComplete,
  minLength,
  hint,
  error,
  className = 'flex w-full max-w-[440px] flex-col gap-2',
  inputClassName = fieldInput,
}: Props) {
  const [visible, setVisible] = useState(false)
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={className}>
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          className={`${inputClassName} pr-14`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute top-1/2 right-1.5 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-tn-muted transition hover:text-tn-ink focus-visible:outline-2 focus-visible:outline-white"
        >
          {visible ? <EyeOff size={20} aria-hidden /> : <Eye size={20} aria-hidden />}
        </button>
      </div>
      {error && (
        <p id={errorId} role="alert" className={fieldError}>
          {error}
        </p>
      )}
      {hint && (
        <p id={hintId} className="text-sm leading-[1.35] text-tn-muted">
          {hint}
        </p>
      )}
    </div>
  )
}
