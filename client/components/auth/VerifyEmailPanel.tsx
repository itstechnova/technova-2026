'use client'

import Link from 'next/link'
import { useActionState, useMemo, useSyncExternalStore } from 'react'
import { resendVerificationEmail } from '@/app/(auth)/(entry)/verify-email/actions'
import { fieldLabel } from '@/components/portal/ui'
import { AuthBanner } from './AuthShell'
import {
  authPanel,
  cardButtonPrimary,
  cardButtonSecondary,
  cardDivider,
  cardField,
  cardHeader,
  cardInput,
  cardIntro,
  cardSwitchLink,
  cardTitle,
} from './card'
import { SIGNUP_STORAGE_KEY, safeNextPath, withNext } from './safeNext'

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

/** The step after signup, in the same column and scene as the login and signup forms. */
export function VerifyEmailPanel() {
  const raw = useSyncExternalStore(subscribe, readStored, readOnServer)
  const { email, next } = useMemo(() => parseStored(raw), [raw])
  const [state, formAction, isPending] = useActionState(resendVerificationEmail, null)

  return (
    <div className={authPanel}>
      <div className={cardHeader}>
        <h1 className={cardTitle}>Check your email</h1>
        <p className={cardIntro}>
          {email ? (
            <>
              Open the verification link we sent to <span className="break-words text-tn-ink">{email}</span>, then
              come back here.
            </>
          ) : (
            'Open the verification link we sent you, then come back here.'
          )}
        </p>
      </div>

      {state?.error && <AuthBanner tone="error">{state.error}</AuthBanner>}
      {state?.message && <AuthBanner tone="message">{state.message}</AuthBanner>}

      <Link href={next ?? '/applicant/application'} className={cardButtonPrimary}>
        Continue to application
      </Link>

      <form action={formAction} className="flex flex-col gap-5">
        {next && <input type="hidden" name="next" value={next} />}
        {email ? (
          <input type="hidden" name="email" value={email} />
        ) : (
          // Arrived without a signup in this tab (new tab, another device): ask for the address.
          <div className={cardField}>
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
              className={cardInput}
            />
            <p id="email-hint" className="text-sm leading-[1.35] text-tn-muted">
              Enter the email you signed up with to get a new verification link.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button type="submit" disabled={isPending} className={cardButtonSecondary}>
            {isPending ? 'Sending…' : 'Resend verification email'}
          </button>
          <p className="text-sm leading-[1.35] text-tn-muted">Link expired or missing? Send a new one.</p>
        </div>
      </form>

      <div aria-hidden className={cardDivider} />

      <Link href={withNext('/login', next)} className={cardSwitchLink}>
        Already verified? Log in
      </Link>
    </div>
  )
}
