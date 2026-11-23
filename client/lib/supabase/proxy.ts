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

  // Supabase's Send Email hook calls this server-to-server with no session;
  // the route authenticates the request itself via the webhook signature.
  if (pathname === '/api/auth/send-email') {
    return supabaseResponse
  }

  // /reset-password is deliberately not public: the recovery link signs the visitor in through
  // /auth/confirm before sending them there, and the page needs that session to set a password.
  if (
    !user &&
    pathname !== '/' &&
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/signup') &&
    !pathname.startsWith('/verify-email') &&
    !pathname.startsWith('/auth') &&
    !pathname.startsWith('/forgot-password')
  ) {
    // no user: send them to the login page, remembering which applicant page they were after
    // (the login flow re-validates `next` before using it).
    const loginUrl = new URL('/login', request.url)
    if (pathname.startsWith('/applicant/')) loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
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

    // Already signed in: the login and signup screens (where "Apply now" points) go straight to the
    // dashboard. Accounts without a role stay put, so the screen can explain what went wrong.
    if (pathname === '/login' || pathname === '/signup') {
      const next = request.nextUrl.searchParams.get('next')
      const destination =
        role === 'applicant'
          ? next?.startsWith('/applicant/') && !next.includes('//') && !next.includes('\\')
            ? next
            : '/applicant/dashboard'
          : role === 'admin'
            ? '/admin/dashboard'
            : null
      if (destination) {
        const response = NextResponse.redirect(new URL(destination, request.url))
        // Keep any session cookies refreshed on this request.
        supabaseResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie))
        return response
      }
    }
  }

  return supabaseResponse
}