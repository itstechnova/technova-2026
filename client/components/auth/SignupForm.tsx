'use client'

import Link from 'next/link'
import { useActionState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithGoogle } from '@/app/(auth)/(entry)/login/actions'
import { signUp } from '@/app/(auth)/(entry)/signup/actions'
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
import { PasswordField } from './PasswordField'
import { SIGNUP_STORAGE_KEY, safeNextPath, withNext } from './safeNext'

export function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = safeNextPath(searchParams.get('next'))
  const [state, formAction, isPending] = useActionState(signUp, null)

  useEffect(() => {
    if (!state?.success) return
    // Hand the email to /verify-email without putting it in the URL.
    try {
      sessionStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify({ email: state.email, next: state.next ?? null }))
    } catch {
      // Storage unavailable (e.g. private mode): /verify-email asks for the address instead.
    }
    router.push('/verify-email')
  }, [state, router])

  const moving = isPending || Boolean(state?.success)

  return (
    <div className={authPanel}>
      <div className={cardHeader}>
        <h1 className={cardTitle}>Create an account</h1>
        <p className={cardIntro}>Save your application and check its status.</p>
      </div>

      {state?.error && <AuthBanner tone="error">{state.error}</AuthBanner>}
      {state?.existing && (
        <AuthBanner tone="message">
          You already have an account with this email.{' '}
          <Link href={withNext('/login', state.next ?? next)} className="underline underline-offset-4">
            Log in
          </Link>{' '}
          instead, or{' '}
          <Link href="/forgot-password" className="underline underline-offset-4">
            reset your password
          </Link>{' '}
          if you’ve forgotten it. If you signed up with Google, use the Google button.
        </AuthBanner>
      )}

      <form action={formAction} className="flex flex-col gap-5">
        {next && <input type="hidden" name="next" value={next} />}

        <div className={cardField}>
          <label htmlFor="name" className={fieldLabel}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            defaultValue={state?.name ?? ''}
            className={cardInput}
          />
        </div>

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
            className={cardInput}
          />
        </div>

        <PasswordField
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
          minLength={6}
          hint="At least 6 characters."
          className={cardField}
          inputClassName={cardInput}
        />

        <div className="flex flex-col gap-3">
          <button type="submit" disabled={moving} className={cardButtonPrimary}>
            {moving ? 'Creating account…' : 'Create account'}
          </button>
          {/* Same form, different action: a first Google sign-in creates the account, so it needs
              `next` but none of the fields. */}
          <button type="submit" formAction={signInWithGoogle} formNoValidate disabled={moving} className={cardButtonSecondary}>
            Sign up with Google
          </button>
        </div>
      </form>

      <div aria-hidden className={cardDivider} />

      <Link href={withNext('/login', next)} className={cardSwitchLink}>
        Already have an account? Log in
      </Link>
    </div>
  )
}
