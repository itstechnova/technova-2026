import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/resend/send'
import { NextRequest, NextResponse } from 'next/server'
import { safeNextPath } from '@/components/auth/safeNext'

// Where Supabase sends the browser back with a one-time `code`: after Google sign-in, and after a
// new account opens the link in its confirmation email (`type=signup`, see confirmRedirectUrl).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')
  const isSignupConfirmation = searchParams.get('type') === 'signup'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      if (next === '/reset-password') {
        return NextResponse.redirect(`${origin}/reset-password`)
      }
      const { data: { user } } = await supabase.auth.getUser()

      // Tell a new account its email is verified. Best effort: they are signed in either way.
      if (isSignupConfirmation && user?.email) {
        try {
          await sendWelcomeEmail(user.email, `${origin}/login`)
        } catch (welcomeError) {
          console.error('auth/callback: failed to send welcome email', welcomeError)
        }
      }

      const role = user?.app_metadata?.role
      if (role === 'applicant') {
        return NextResponse.redirect(`${origin}${safeNextPath(next) ?? '/applicant/dashboard'}`)
      }
      if (role === 'admin') return NextResponse.redirect(`${origin}/admin/dashboard`)

      await supabase.auth.signOut()
    } else if (isSignupConfirmation) {
      // Supabase verified the email before redirecting here; only the sign-in failed, which happens
      // when the link is opened in a different browser from the one that signed up.
      return NextResponse.redirect(`${origin}/login?message=email-confirmed`)
    }
  } else if (isSignupConfirmation) {
    // No code: Supabase rejected the link (expired, or already used).
    return NextResponse.redirect(`${origin}/login?error=confirm-link`)
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
