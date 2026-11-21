'use client'

import Link from 'next/link'
import { useActionState, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { authenticate, signInWithGoogle } from '@/app/(auth)/login/actions'
import { buttonPrimary, buttonSecondary, fieldInput, fieldLabel } from '@/components/portal/ui'
import { AuthBanner, AuthHeader, authLink } from './AuthShell'
import { PasswordField } from './PasswordField'
import { safeNextPath, withNext } from './safeNext'

function errorText(error: string) {
  switch (error) {
    case 'auth':
      return 'Authentication failed. Please try again.'
    case 'oauth':
      return 'We couldn’t start Google sign-in. Please try again.'
    case 'Invalid login credentials':
      return 'Incorrect email or password. Please try again.'
    case 'Email not confirmed':
      return 'Please verify your email before logging in.'
    default:
      return error
  }
}

export function LoginForm() {
  const searchParams = useSearchParams()
  const [state, formAction, isPending] = useActionState(authenticate, null)

  // Read once: the error/message params are stripped from the URL below, and the banner (and
  // `next`) must outlive that.
  const [fromUrl] = useState(() => ({
    error: searchParams.get('error'),
    message: searchParams.get('message'),
    next: safeNextPath(searchParams.get('next')),
  }))
  const { next } = fromUrl

  const error = state?.error || (state ? null : fromUrl.error)
  const message = state?.message || (state ? null : fromUrl.message)

  useEffect(() => {
    if (!fromUrl.error && !fromUrl.message) return
    // Clear the error/message parameters so they don't persist on refresh (`next` stays).
    const params = new URLSearchParams(window.location.search)
    params.delete('error')
    params.delete('message')
    const query = params.toString()
    window.history.replaceState(null, '', window.location.pathname + (query ? `?${query}` : ''))
  }, [fromUrl])

  return (
    <>
      <AuthHeader title="Log in">Welcome back to TechNova.</AuthHeader>

      {error && (
        <AuthBanner tone="error">
          {errorText(error)}
          {error === 'Email not confirmed' && (
            <>
              {' '}
              <Link href="/verify-email" className="font-semibold underline underline-offset-4">
                Resend verification email
              </Link>
            </>
          )}
        </AuthBanner>
      )}
      {message && <AuthBanner tone="message">{message}</AuthBanner>}

      <form action={formAction} className="flex w-full flex-col items-start gap-6">
        {next && <input type="hidden" name="next" value={next} />}

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
            className={fieldInput}
          />
        </div>

        <PasswordField label="Password" placeholder="Enter your password" autoComplete="current-password" />

        <div className="flex w-full max-w-[440px] flex-col items-stretch gap-3 sm:items-start">
          <button type="submit" disabled={isPending} className={buttonPrimary}>
            {isPending ? 'Logging in…' : 'Log in'}
          </button>
          {/* Same form, different action: Google sign-in needs `next` but none of the fields. */}
          <button type="submit" formAction={signInWithGoogle} formNoValidate className={buttonSecondary}>
            Continue with Google
          </button>
        </div>
      </form>

      <div className="flex flex-col items-start gap-1">
        <Link href="/forgot-password" className={`${authLink} text-[17px] font-semibold no-underline hover:underline`}>
          Forgot password?
        </Link>
        <Link href={withNext('/signup', next)} className={authLink}>
          New to TechNova? Create an account
        </Link>
      </div>
    </>
  )
}
