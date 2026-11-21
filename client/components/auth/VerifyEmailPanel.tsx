'use client'

import Link from 'next/link'
import { useActionState, useMemo, useSyncExternalStore } from 'react'
import { resendVerificationEmail } from '@/app/(auth)/verify-email/actions'
import { Eyebrow, buttonPrimary, buttonSecondary, fieldInput, fieldLabel, heading } from '@/components/portal/ui'
import { AuthBanner, AuthHeader } from './AuthShell'
import { SIGNUP_STORAGE_KEY, safeNextPath } from './safeNext'

// What the signup form left behind in this tab. Read as an external store so the server render
// (which can't see it) and hydration agree, then the stored email appears.
const subscribe = () => () => {}
const readStored = () => {
  try {
    return sessionStorage.getItem(SIGNUP_STORAGE_KEY)
  } catch {
    return null
  }
}
const readOnServer = () => null

function parseStored(raw: string | null): { email: string | null; next: string | null } {
  if (!raw) return { email: null, next: null }
  try {
    const value: unknown = JSON.parse(raw)
    if (typeof value !== 'object' || value === null) return { email: null, next: null }
    const { email, next } = value as { email?: unknown; next?: unknown }
    return {
      email: typeof email === 'string' && email ? email : null,
      next: safeNextPath(next),
    }
  } catch {
    return { email: null, next: null }
  }
}

export function VerifyEmailPanel() {
  const raw = useSyncExternalStore(subscribe, readStored, readOnServer)
  const { email, next } = useMemo(() => parseStored(raw), [raw])
  const [state, formAction, isPending] = useActionState(resendVerificationEmail, null)

  return (
    <>
      <AuthHeader title="Check your email">
        {email ? (
          <>
            Open the verification link we sent to <span className="break-words text-tn-ink">{email}</span>, then
            return here.
          </>
        ) : (
          'Open the verification link we sent you, then return here.'
        )}
      </AuthHeader>

      <div className="flex w-full max-w-[440px] flex-col gap-3 py-2 sm:py-7">
        <Eyebrow>Email verification</Eyebrow>
        <h2 className={`${heading} text-[26px] leading-[1.35]`}>Verify your email</h2>
        <p className="text-lg leading-[1.35] text-tn-muted">Link expired? Request a new one below.</p>
      </div>

      <Link href={next ?? '/applicant/application'} className={`${buttonPrimary} w-full max-w-[440px] sm:w-auto`}>
        Continue to application
      </Link>

      <form action={formAction} className="flex w-full flex-col items-start gap-6">
        {next && <input type="hidden" name="next" value={next} />}
        {email ? (
          <input type="hidden" name="email" value={email} />
        ) : (
          // Arrived without a signup in this tab (new tab, another device): ask for the address.
          <div className="flex w-full max-w-[440px] flex-col gap-2">
            <label htmlFor="email" className={fieldLabel}>
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="you@example.com"
              defaultValue={state?.email ?? ''}
              aria-describedby="email-hint"
              className={fieldInput}
            />
            <p id="email-hint" className="text-sm leading-[1.35] text-tn-muted">
              Enter the email you signed up with to get a new verification link.
            </p>
          </div>
        )}

        <button type="submit" disabled={isPending} className={`${buttonSecondary} w-full max-w-[440px] sm:w-auto`}>
          {isPending ? 'Sending…' : 'Resend verification email'}
        </button>
      </form>

      {state?.error && <AuthBanner tone="error">{state.error}</AuthBanner>}
      {state?.message && <AuthBanner tone="message">{state.message}</AuthBanner>}
    </>
  )
}
