'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { safeNextPath } from '@/components/auth/safeNext'

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
  error?: string
  message?: string
  /** Echoed back so the email field keeps its value after a failed attempt. */
  email?: string
} | null

export async function authenticate(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const next = safeNextPath(formData.get('next'))

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message, email }

  const role = data.user?.app_metadata?.role
  if (role === 'applicant') redirect(next ?? '/applicant/dashboard')
  if (role === 'admin') redirect('/admin/dashboard')

  await supabase.auth.signOut()
  return { error: 'Account has no role assigned', email }
}
