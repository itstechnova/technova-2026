'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { safeNextPath } from '@/components/auth/safeNext'
import { SUPPORT_EMAIL } from '@/lib/application/config'

// Single sign-on. A first Google sign-in creates the account (the database gives it the applicant
// role, like an email signup), so the same button serves the login and signup screens.
export async function signInWithGoogle(formData: FormData) {
  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL
  const next = safeNextPath(formData.get('next'))

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: next
        ? `${origin}/auth/callback?next=${encodeURIComponent(next)}`
        : `${origin}/auth/callback`,
    },
  })

  if (error || !data.url) {
    redirect('/login?error=oauth')
  }

  redirect(data.url)
}

export type AuthState = {
  /** A problem that isn't about one field (shown above the form). */
  error?: string
  /** Problems shown under the field they belong to. */
  fieldErrors?: { email?: string; password?: string }
  message?: string
  /** Echoed back so the email field keeps its value after a failed attempt. */
  email?: string
  /** The account exists but its email isn't verified yet: the form moves on to /verify-email. */
  unverified?: boolean
  next?: string | null
} | null

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function authenticate(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const next = safeNextPath(formData.get('next'))

  const fieldErrors: NonNullable<NonNullable<AuthState>['fieldErrors']> = {}
  if (!email) fieldErrors.email = 'Enter your email address.'
  else if (!EMAIL_PATTERN.test(email)) fieldErrors.email = 'Enter an email address like you@example.com.'
  if (!password) fieldErrors.password = 'Enter your password.'
  if (fieldErrors.email || fieldErrors.password) return { fieldErrors, email }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.code === 'email_not_confirmed') return { unverified: true, email, next }
    if (error.code === 'invalid_credentials') {
      return {
        fieldErrors: { password: 'That email and password don’t match. Try again, or reset your password.' },
        email,
      }
    }
    if (error.status === 429) {
      return { error: 'Too many attempts. Wait a minute, then try again.', email }
    }
    return { error: 'We couldn’t log you in just now. Please try again.', email }
  }

  // The account role decides the destination; there is no role picker.
  const role = data.user?.app_metadata?.role
  if (role === 'applicant') redirect(next ?? '/applicant/dashboard')
  if (role === 'admin') redirect('/admin/dashboard')

  await supabase.auth.signOut()
  return { error: `We couldn’t open your account. Email ${SUPPORT_EMAIL} and we’ll sort it out.`, email }
}
