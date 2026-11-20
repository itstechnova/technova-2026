import 'server-only'
import { requireRole } from '@/lib/auth/dal'
import { getInitials, stringToColor } from '@/lib/data/format'
import { createClient } from '@/lib/supabase/server'

export type MemberRole = 'Hacker' | 'Mentor' | 'Volunteer'

export type Member = {
  id: string
  name: string
  email: string
  role: MemberRole
  avatarColor: string
  initials: string
  shirt_size: string
}

export async function getMembers() {
  await requireRole(['admin'])
  const supabase = await createClient()

  const { data: users, error } = await supabase
    .from('user')
    .select(`
      user_id,
      first_name,
      last_name,
      email,
      role,
      shirt_size
    `)
    .eq('accepted', true)
    .in('role', ['hacker', 'mentor', 'volunteer'])

  if (error) throw new Error("Unable to load members. Please try again.")

  return (users ?? []).map((user) => ({
    id: user.user_id,
    name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || 'Unknown',
    email: user.email ?? '',
    role: capitalizeRole(user.role),
    avatarColor: stringToColor(`${user.first_name ?? ''} ${user.last_name ?? ''}`),
    initials: getInitials(`${user.first_name ?? ''} ${user.last_name ?? ''}`),
    shirt_size: user.shirt_size ?? '',
  }))
}

function capitalizeRole(role: string): MemberRole {
  const map: Record<string, MemberRole> = {
    hacker: 'Hacker',
    mentor: 'Mentor',
    volunteer: 'Volunteer',
  }
  return map[role?.toLowerCase()] ?? 'Hacker'
}
