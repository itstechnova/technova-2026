'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function signInWithGoogle() {
  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
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
} | null

export async function authenticate(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const mode = formData.get('mode') as string

  if (mode === 'signup') {
    const headersList = await headers()
    const origin = headersList.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) return { error: error.message }
    return { message: 'Check your email to confirm your account' }
  } else {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) return { error: error.message }

    const role = data.user?.app_metadata?.role
    if (role === 'applicant') redirect('/applicant/dashboard')
    if (role === 'admin') redirect('/admin/dashboard')

    await supabase.auth.signOut()
    return { error: 'Account has no role assigned' }
  }
}
