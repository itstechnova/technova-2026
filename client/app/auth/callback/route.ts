import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      if (next === '/reset-password') {
        return NextResponse.redirect(`${origin}/reset-password`)
      }
      const { data: { user } } = await supabase.auth.getUser()
      const role = user?.app_metadata?.role
      if (role === 'applicant') return NextResponse.redirect(`${origin}/applicant/dashboard`)
      if (role === 'admin') return NextResponse.redirect(`${origin}/admin/dashboard`)

      await supabase.auth.signOut()
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
