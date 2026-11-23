'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { requestPasswordReset } from '@/app/(auth)/forgot-password/actions'
import { SubmitButton } from '@/components/submit-button'
import { buttonPrimary, buttonSecondary, fieldInput, fieldLabel } from '@/components/portal/ui'
import { AuthBanner, AuthHeader } from './AuthShell'

export function ForgotPasswordForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  return (
    <>
      <AuthHeader title="Reset your password">Enter your email to request a reset link.</AuthHeader>

      {error && <AuthBanner tone="error">{error}</AuthBanner>}
      {message && <AuthBanner tone="message">{message}</AuthBanner>}

      <form action={requestPasswordReset} className="flex w-full flex-col items-start gap-6">
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
            className={fieldInput}
          />
        </div>
        <SubmitButton
          label="Send reset link"
          pendingLabel="Sending…"
          className={`${buttonPrimary} w-full max-w-[440px] sm:w-auto`}
        />
      </form>

      <Link href="/login" className={`${buttonSecondary} w-full max-w-[440px] sm:w-auto`}>
        Back to log in
      </Link>
    </>
  )
}
