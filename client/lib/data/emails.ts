import { createClient } from '@/lib/supabase/server'

export type EmailStatus = 'Opened' | 'Sent' | 'Bounced'
export type AccountStatus = 'Verified' | 'Not Verified'

export type EmailLog = {
  id: string
  name: string
  email: string
  email_date: string
  email_status: EmailStatus
  account_status: AccountStatus
  avatarColor: string
  initials: string
}

export async function getEmailLogs() {
  const supabase = await createClient()

  const { data: users, error } = await supabase
    .from('user')
    .select(`
      user_id,
      first_name,
      last_name,
      email,
      email_date,
      email_status,
      account_status
    `)

  console.log('email logs:', users)
  console.log('error:', error)

  if (error || !users) return []

  return users.map((user) => ({
    id: user.user_id,
    name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || 'Unknown',
    email: user.email ?? '',
    email_date: user.email_date?.split('T')[0] ?? '',
    email_status: (user.email_status as EmailStatus) ?? '',
    account_status: (user.account_status as AccountStatus) ?? '',
    avatarColor: stringToColor(`${user.first_name ?? ''} ${user.last_name ?? ''}`),
    initials: getInitials(`${user.first_name ?? ''} ${user.last_name ?? ''}`),
  }))
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function stringToColor(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return `hsl(${hash % 360}, 60%, 45%)`
}