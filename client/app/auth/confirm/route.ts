import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/resend/send'
import { NextRequest, NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { safeNextPath } from '@/components/auth/safeNext'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next')

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })

    if (!error) {
      if (next?.endsWith('/reset-password')) {
        return NextResponse.redirect(`${origin}/reset-password`)
      }

      const { data: { user } } = await supabase.auth.getUser()

      if (type === 'signup' && user?.email) {
        try {
          await sendWelcomeEmail(user.email, `${origin}/login`)
        } catch (welcomeError) {
          console.error('auth/confirm: failed to send welcome email', welcomeError)
        }
      }
      const role = user?.app_metadata?.role
      if (role === 'applicant') {
        // `next` is the email's redirect_to: a full URL, of which only an /applicant/ path is used.
        const nextPath = safeNextPath(next, { allowAbsolute: true })
        return NextResponse.redirect(`${origin}${nextPath ?? '/applicant/dashboard'}`)
      }
      if (role === 'admin') return NextResponse.redirect(`${origin}/admin/dashboard`)

      await supabase.auth.signOut()
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
