import 'server-only'
import { requireRole } from '@/lib/auth/dal'
import { getInitials, stringToColor } from '@/lib/data/format'
import { createClient } from '@/lib/supabase/server'

export type EmailStatus = 'Opened' | 'Sent' | 'Bounced' | 'Unknown'
export type AccountStatus = 'Verified' | 'Not Verified' | 'Unknown'

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
  await requireRole(['admin'])
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

  if (error) throw new Error("Unable to load email logs. Please try again.")

  return (users ?? []).map((user) => ({
    id: user.user_id,
    name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || 'Unknown',
    email: user.email ?? '',
    email_date: user.email_date?.split('T')[0] ?? '',
    email_status: normalizeEmailStatus(user.email_status),
    account_status: normalizeAccountStatus(user.account_status),
    avatarColor: stringToColor(`${user.first_name ?? ''} ${user.last_name ?? ''}`),
    initials: getInitials(`${user.first_name ?? ''} ${user.last_name ?? ''}`),
  }))
}

function normalizeEmailStatus(status: unknown): EmailStatus {
  return status === 'Opened' || status === 'Sent' || status === 'Bounced' ? status : 'Unknown';
}

function normalizeAccountStatus(status: unknown): AccountStatus {
  return status === 'Verified' || status === 'Not Verified' ? status : 'Unknown';
}
