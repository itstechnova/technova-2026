'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { confirmRedirectUrl, safeNextPath } from '@/components/auth/safeNext'
import { SUPPORT_EMAIL } from '@/lib/application/config'

export type SignupState = {
  error?: string
  /** The email already has a verified account: the form points to login instead. */
  existing?: boolean
  /** Set once the confirmation email is on its way; the form then moves on to /verify-email. */
  success?: boolean
  // Echoed back so the fields keep their values after an error (and for /verify-email).
  name?: string
  email?: string
  next?: string | null
} | null

export async function signUp(prevState: SignupState, formData: FormData): Promise<SignupState> {
  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const next = safeNextPath(formData.get('next'))

  if (!name) return { error: 'Please enter your name.', name, email }
  if (!email) return { error: 'Please enter your email address.', name, email }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      // Where the confirmation link lands after Supabase verifies it (see confirmRedirectUrl).
      ...(origin ? { emailRedirectTo: confirmRedirectUrl(origin, next) } : {}),
    },
  })

  if (error) {
    // Supabase limits how often one address (and the project) can be emailed.
    if (error.status === 429) {
      return { error: 'We just sent an email to this address. Check your inbox, or wait a minute and try again.', name, email }
    }
    // Its wording for these is already about the visitor's own input.
    if (error.code === 'weak_password' || error.code === 'validation_failed' || error.code === 'email_address_invalid') {
      return { error: error.message, name, email }
    }
    console.error('signUp: failed', error)
    return {
      error: `We couldn’t create your account just now. Please try again in a few minutes, or email ${SUPPORT_EMAIL}.`,
      name,
      email,
    }
  }

  // Supabase answers a signup for an address that already has a verified account with a user that
  // has no identities, and sends nothing. Say so, or they would wait for an email that never comes.
  if (data.user && data.user.identities?.length === 0) {
    return { existing: true, name, email, next }
  }

  // Only when email confirmation is switched off in Supabase: the account is already signed in.
  if (data.session) redirect(next ?? '/applicant/application')

  return { success: true, email, next }
}
