import 'server-only'
import { requireRole } from '@/lib/auth/dal'
import { getInitials, stringToColor } from '@/lib/data/format'
import { createClient } from '@/lib/supabase/server'

export type AcceptanceStatus = 'Accepted' | 'Pending' | 'Rejected'

export type VolunteerApplication = {
  id: string
  name: string
  email: string
  acceptanceStatus: AcceptanceStatus
  applicationDate: string
  rolePreference: string
  avatarColor: string
  initials: string
  score: number | null
  volunteer_question1: string
  location?: string
}

export async function getVolunteerApplications() {
  await requireRole(['admin'])
  const supabase = await createClient()

  const { data: volunteers, error } = await supabase
    .from('volunteer')
    .select(`
      *,
      user:volunteer_id (
        first_name,
        last_name,
        email,
        accepted,
        created_at
      )
    `)

  if (error) throw new Error("Unable to load volunteer applications. Please try again.")

  return (volunteers ?? []).map((volunteer) => ({
    id: volunteer.volunteer_id,
    name: `${volunteer.user?.first_name ?? ''} ${volunteer.user?.last_name ?? ''}`.trim() || 'Unknown',
    email: volunteer.user?.email ?? '',
    acceptanceStatus: (volunteer.user?.accepted === true ? 'Accepted' : volunteer.user?.accepted === false ? 'Rejected' : 'Pending') as AcceptanceStatus,
    applicationDate: volunteer.user?.created_at?.split('T')[0] ?? '',
    rolePreference: volunteer.role_preference,
    avatarColor: stringToColor(`${volunteer.user?.first_name ?? ''} ${volunteer.user?.last_name ?? ''}`),
    initials: getInitials(`${volunteer.user?.first_name ?? ''} ${volunteer.user?.last_name ?? ''}`),
    score: volunteer.score,
    volunteer_question1: volunteer.question_1,
  }))
}
