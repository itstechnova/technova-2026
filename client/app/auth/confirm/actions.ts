'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { EmailOtpType } from '@supabase/supabase-js'
import { safeNextPath } from '@/components/auth/safeNext'
import { sendWelcomeEmail } from '@/lib/resend/send'
import { SITE_URL } from '@/lib/site'
import { createClient } from '@/lib/supabase/server'

/** The applicant page an email link was heading to, from the link's `next` (its redirect URL). */
function destinationFrom(next: string): string | null {
  const direct = safeNextPath(next, { allowAbsolute: true })
  if (direct) return direct
  // Signup links carry the /auth/callback URL (see confirmRedirectUrl), with the page inside it.
  try {
    return safeNextPath(new URL(next, SITE_URL).searchParams.get('next'))
  } catch {
    return null
  }
}

/** Runs when the visitor presses the button on /auth/confirm: spends the link's one-time token. */
export async function confirmEmailLink(formData: FormData) {
  const token_hash = String(formData.get('token_hash') ?? '')
  const type = String(formData.get('type') ?? '') as EmailOtpType
  const next = String(formData.get('next') ?? '')

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({ type, token_hash })
  if (error) redirect(type === 'signup' ? '/login?error=confirm-link' : '/login?error=auth')

  if (type === 'recovery' || next.endsWith('/reset-password')) redirect('/reset-password')

  const { data: { user } } = await supabase.auth.getUser()

  // Tell a new account its email is verified. Best effort: they are signed in either way.
  if (type === 'signup' && user?.email) {
    try {
      const origin = (await headers()).get('origin') ?? SITE_URL
      await sendWelcomeEmail(user.email, `${origin}/login`)
    } catch (welcomeError) {
      console.error('auth/confirm: failed to send welcome email', welcomeError)
    }
  }

  const role = user?.app_metadata?.role
  if (role === 'applicant') redirect(destinationFrom(next) ?? '/applicant/dashboard')
  if (role === 'admin') redirect('/admin/dashboard')

  await supabase.auth.signOut()
  redirect('/login?error=no-role')
}
