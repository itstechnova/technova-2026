import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'


export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })
  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )
 
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims
  const pathname = request.nextUrl.pathname

  if (
    !user &&
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/auth') &&
    !pathname.startsWith('/forgot-password')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Optimistic role check: pre-filter users hitting a dashboard they're not
  // allowed on. The authoritative check lives in each dashboard page via
  // requireRole(), since Proxy shouldn't be the only line of defense.
  // Admins may view both dashboards; applicants may only view their own.
  if (user) {
    const role = user.app_metadata?.role
    if (pathname.startsWith('/admin') && role !== 'admin') {
      const destination = role === 'applicant' ? '/applicant/dashboard' : '/login'
      return NextResponse.redirect(new URL(destination, request.url))
    }
    if (pathname.startsWith('/applicant') && role !== 'applicant' && role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return supabaseResponse
}