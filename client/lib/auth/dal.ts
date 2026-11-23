import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

type Role = 'admin' | 'applicant'

const DASHBOARD_BY_ROLE: Record<Role, string> = {
  admin: '/admin/dashboard',
  applicant: '/applicant/dashboard',
}

export async function requireRole(allowedRoles: Role[]) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userRole = user?.app_metadata?.role as Role | undefined

  if (userRole && allowedRoles.includes(userRole)) return user

  if (userRole && userRole in DASHBOARD_BY_ROLE) {
    redirect(DASHBOARD_BY_ROLE[userRole])
  }

  await supabase.auth.signOut()

  // No user: the session has expired or been revoked (the proxy only sees the cookie, which can
  // outlive it). Nothing is wrong with the account, so just ask them to log in again.
  if (!user) redirect('/login?message=session-expired')

  // Signed in, but the account has no role we know: that one needs an organizer to fix.
  redirect('/login?error=no-role')
}
