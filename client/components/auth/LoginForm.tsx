'use client'

import Link from 'next/link'
import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { authenticate, signInWithGoogle } from '@/app/(auth)/(entry)/login/actions'
import { fieldError, fieldLabel } from '@/components/portal/ui'
import { SUPPORT_EMAIL } from '@/lib/application/config'
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
  cardLink,
  cardSwitchLink,
  cardTitle,
} from './card'
import { PasswordField } from './PasswordField'
import { SIGNUP_STORAGE_KEY, safeNextPath, withNext } from './safeNext'

/** Plain words for the errors that arrive in the URL (OAuth callback, role checks). */
function urlErrorText(error: string) {
  switch (error) {
    case 'auth':
      return 'We couldn’t log you in. Please try again.'
    case 'oauth':
      return 'We couldn’t start Google sign-in. Please try again.'
    case 'confirm-link':
      return 'That confirmation link has expired or was already used. If your email is confirmed, log in below. Otherwise, log in and we’ll send a new link.'
    case 'no-role':
      return `We couldn’t open your account. Email ${SUPPORT_EMAIL} and we’ll sort it out.`
    default:
      return error
  }
}

/** Plain words for the notices that arrive in the URL. */
function urlMessageText(message: string) {
  switch (message) {
    case 'session-expired':
      return 'Your session ended. Please log in again.'
    case 'email-confirmed':
      return 'Your email is confirmed. Log in to continue.'
    default:
      return message
  }
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, formAction] = useActionState(authenticate, null)

  // Read once: the error/message params are stripped from the URL below, and the banner (and
  // `next`) must outlive that.
  const [fromUrl] = useState(() => ({
    error: searchParams.get('error'),
    message: searchParams.get('message'),
    next: safeNextPath(searchParams.get('next')),
  }))
  const { next } = fromUrl

  const error = state?.error || (state || !fromUrl.error ? null : urlErrorText(fromUrl.error))
  const message = state?.message || (state || !fromUrl.message ? null : urlMessageText(fromUrl.message))
  const emailError = state?.fieldErrors?.email
  const unverified = Boolean(state?.unverified)

  useEffect(() => {
    if (!fromUrl.error && !fromUrl.message) return
    // Clear the error/message parameters so they don't persist on refresh (`next` stays).
    const params = new URLSearchParams(window.location.search)
    params.delete('error')
    params.delete('message')
    const query = params.toString()
    window.history.replaceState(null, '', window.location.pathname + (query ? `?${query}` : ''))
  }, [fromUrl])

  useEffect(() => {
    if (!state?.unverified) return
    // Unverified accounts go to Verify email, which reads the address from this tab's storage
    // (the same hand-off the signup form uses), so it never appears in the URL.
    try {
      sessionStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify({ email: state.email, next: state.next ?? null }))
    } catch {
      // Storage unavailable (e.g. private mode): /verify-email asks for the address instead.
    }
    router.push('/verify-email')
  }, [state, router])

  return (
    <div className={authPanel}>
      <div className={cardHeader}>
        <h1 className={cardTitle}>Log in</h1>
        <p className={cardIntro}>Welcome back to TechNova.</p>
      </div>

      {error && <AuthBanner tone="error">{error}</AuthBanner>}
      {message && <AuthBanner tone="message">{message}</AuthBanner>}

      {/* noValidate: problems are reported under each field in our own words, not browser bubbles. */}
      <form action={formAction} noValidate className="flex flex-col gap-5">
        {next && <input type="hidden" name="next" value={next} />}

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
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? 'email-error' : undefined}
            className={cardInput}
          />
          {emailError && (
            <p id="email-error" role="alert" className={fieldError}>
              {emailError}
            </p>
          )}
        </div>

        <PasswordField
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={state?.fieldErrors?.password}
          className={cardField}
          inputClassName={cardInput}
        />

        <Link href="/forgot-password" className={`${cardLink} -my-2.5 self-start text-[17px] leading-[1.35] font-semibold`}>
          Forgot password?
        </Link>

        <LoginButtons redirecting={unverified} />
      </form>

      <div aria-hidden className={cardDivider} />

      <Link
        href={withNext('/signup', next)}
        className={cardSwitchLink}
      >
        New to TechNova? Create an account
      </Link>
  </div>
)
}

const Spinner = () => <Loader2 aria-hidden size={20} className="animate-spin motion-reduce:animate-none" />

/** Log in + Continue with Google. Inside the form, so it can tell which of the two is running. */
function LoginButtons({ redirecting }: { redirecting: boolean }) {
  const { pending, action } = useFormStatus()
  const googlePending = pending && action === signInWithGoogle
  const loginPending = (pending && !googlePending) || redirecting
  const busy = pending || redirecting

  return (
    <div className="flex flex-col gap-3">
      <button type="submit" disabled={busy} aria-busy={loginPending} className={cardButtonPrimary}>
        {loginPending && <Spinner />}
        {loginPending ? 'Logging in…' : 'Log in'}
      </button>
      {/* Same form, different action: Google sign-in needs `next` but none of the fields. */}
      <button
        type="submit"
        formAction={signInWithGoogle}
        disabled={busy}
        aria-busy={googlePending}
        className={cardButtonSecondary}
      >
        {googlePending && <Spinner />}
        {googlePending ? 'Opening Google…' : 'Continue with Google'}
      </button>
    </div>
  )
}
