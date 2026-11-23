'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { confirmRedirectUrl, safeNextPath } from '@/components/auth/safeNext'

export type ResendState = {
  error?: string
  message?: string
  /** Echoed back so a typed address stays in the field. */
  email?: string
} | null

export async function resendVerificationEmail(prevState: ResendState, formData: FormData): Promise<ResendState> {
  const email = String(formData.get('email') ?? '').trim()
  const next = safeNextPath(formData.get('next'))

  if (!email) return { error: 'Enter the email address you signed up with.' }

  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    // Same destination as the original confirmation email (see signup/actions.ts).
    options: origin ? { emailRedirectTo: confirmRedirectUrl(origin, next) } : undefined,
  })

  if (error) return { error: error.message, email }

  // Deliberately the same answer whether or not the address has an account waiting.
  return {
    message: `If ${email} still needs verifying, a new link is on its way. Check your spam folder too.`,
    email,
  }
}
