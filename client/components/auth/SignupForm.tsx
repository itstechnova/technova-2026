'use client'

import Link from 'next/link'
import { useActionState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signUp } from '@/app/(auth)/signup/actions'
import { buttonPrimary, fieldInput, fieldLabel } from '@/components/portal/ui'
import { AuthBanner, AuthHeader, authLink } from './AuthShell'
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
    <>
      <AuthHeader title="Create an account">Save your application and check its status.</AuthHeader>

      {state?.error && <AuthBanner tone="error">{state.error}</AuthBanner>}

      <form action={formAction} className="flex w-full flex-col items-start gap-6">
        {next && <input type="hidden" name="next" value={next} />}

        <div className="flex w-full max-w-[440px] flex-col gap-2">
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
            className={fieldInput}
          />
        </div>

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

        <PasswordField
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
          minLength={6}
          hint="At least 6 characters."
        />

        <button type="submit" disabled={moving} className={`${buttonPrimary} w-full max-w-[440px] sm:w-auto`}>
          {moving ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <Link href={withNext('/login', next)} className={authLink}>
        Already have an account? Log in
      </Link>
    </>
  )
}
