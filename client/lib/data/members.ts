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

  console.log('members:', users)
  console.log('error:', error)

  if (error || !users) return []

  return users.map((user) => ({
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

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function stringToColor(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return `hsl(${hash % 360}, 60%, 45%)`
}