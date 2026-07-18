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
  redirect('/login?error=Account+has+no+role+assigned')
}
