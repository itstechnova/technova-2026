'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { confirmRedirectUrl, safeNextPath } from '@/components/auth/safeNext'
import { SUPPORT_EMAIL } from '@/lib/application/config'

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

  if (error) {
    // Supabase limits how often one address can be emailed (once a minute by default).
    if (error.status === 429) {
      return { error: 'We sent a link a moment ago. Check your inbox and spam folder, or wait a minute and try again.', email }
    }
    console.error('resendVerificationEmail: failed', error)
    return { error: `We couldn’t send a new link just now. Please try again in a few minutes, or email ${SUPPORT_EMAIL}.`, email }
  }

  // Deliberately the same answer whether or not the address has an account waiting.
  return {
    message: `If ${email} still needs verifying, a new link is on its way. Check your spam folder too. Nothing is sent to an address that is already verified: log in instead.`,
    email,
  }
}
