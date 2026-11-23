'use client'

import { useSearchParams } from 'next/navigation'
import { updatePassword } from '@/app/(auth)/reset-password/actions'
import { SubmitButton } from '@/components/submit-button'
import { buttonPrimary } from '@/components/portal/ui'
import { AuthBanner, AuthHeader } from './AuthShell'
import { PasswordField } from './PasswordField'

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <>
      <AuthHeader title="Set a new password">Choose a new password for your account.</AuthHeader>

      {error && <AuthBanner tone="error">{error}</AuthBanner>}

      <form action={updatePassword} className="flex w-full flex-col items-start gap-6">
        <PasswordField
          label="New password"
          placeholder="Create a password"
          autoComplete="new-password"
          minLength={6}
          hint="At least 6 characters."
        />
        <SubmitButton
          label="Update password"
          pendingLabel="Updating…"
          className={`${buttonPrimary} w-full max-w-[440px] sm:w-auto`}
        />
      </form>
    </>
  )
}
