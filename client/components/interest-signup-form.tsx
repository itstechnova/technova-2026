'use client'

import { useActionState, useState } from 'react'
import { joinInterestList, type SignupState } from '@/lib/interest-signup/actions'

const initialState: SignupState = { status: 'idle' }

// Sized per layout in globals.css (`.signup-*`).
export function InterestSignupForm() {
  const [state, formAction, pending] = useActionState(joinInterestList, initialState)
  const [email, setEmail] = useState('')
  const joined = state.status === 'success' || state.status === 'duplicate'

  return (
    <form action={formAction} className="signup-form">
      <div className="signup-pill" data-joined={joined || undefined}>
        {joined ? (
          <p className="signup-joined w-full text-center text-white">{state.message}</p>
        ) : (
          <>
            <label htmlFor="interest-email" className="sr-only">
              Email address
            </label>
            <input
              id="interest-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={state.status === 'error'}
              aria-describedby="interest-status"
              className="signup-input min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/60"
            />
            {/* Honeypot for bots; hidden from people and assistive tech. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="absolute -left-[9999px] h-px w-px opacity-0"
            />
            <button type="submit" disabled={pending} className="signup-button h-full shrink-0">
              {pending ? 'JOINING…' : 'JOIN'}
            </button>
          </>
        )}
      </div>

      <p id="interest-status" aria-live="polite" className="signup-status text-[#ffd0ec]">
        {state.status === 'error' ? state.message : ''}
      </p>
    </form>
  )
}
