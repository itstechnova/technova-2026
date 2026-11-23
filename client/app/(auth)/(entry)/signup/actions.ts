'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { confirmRedirectUrl, safeNextPath } from '@/components/auth/safeNext'

export type SignupState = {
  error?: string
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

  if (error) return { error: error.message, name, email }

  // Only when email confirmation is switched off in Supabase: the account is already signed in.
  if (data.session) redirect(next ?? '/applicant/application')

  return { success: true, email, next }
}
