'use client'

import { useActionState, useState } from 'react'
import { joinInterestList, type SignupState } from '@/lib/interest-signup/actions'
import { fx } from '@/lib/frame'

const initialState: SignupState = { status: 'idle' }

export function InterestSignupForm() {
  const [state, formAction, pending] = useActionState(joinInterestList, initialState)
  const [email, setEmail] = useState('')
  const joined = state.status === 'success' || state.status === 'duplicate'

  return (
    <form
      action={formAction}
      className="absolute"
      style={{ left: fx(113), top: fx(770), width: fx(966) }}
    >
      <div
        className="signup-pill flex items-center"
        style={{ height: fx(73), padding: fx(8), paddingLeft: joined ? fx(8) : fx(34) }}
      >
        {joined ? (
          <p
            className="w-full text-center text-white"
            style={{ fontFamily: 'var(--font-josefin)', fontSize: fx(30), lineHeight: 1 }}
          >
            {state.message}
          </p>
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
              className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/60"
              style={{ fontFamily: 'var(--font-josefin)', fontSize: fx(32), lineHeight: 1 }}
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
            <button
              type="submit"
              disabled={pending}
              className="signup-button h-full shrink-0"
              style={{ padding: `0 ${fx(40)}`, fontFamily: 'var(--font-josefin)', fontSize: fx(28) }}
            >
              {pending ? 'JOINING…' : 'JOIN'}
            </button>
          </>
        )}
      </div>

      <p
        id="interest-status"
        aria-live="polite"
        className="text-[#ffd0ec]"
        style={{ fontFamily: 'var(--font-josefin)', fontSize: fx(22), marginTop: fx(12), paddingLeft: fx(34) }}
      >
        {state.status === 'error' ? state.message : ''}
      </p>
    </form>
  )
}
