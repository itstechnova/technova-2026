import { createClient } from '@/lib/supabase/server'

export type AcceptanceStatus = 'Accepted' | 'Pending' | 'Rejected' | 'Waitlisted'

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

    console.log('volunteer:', volunteers)
    console.log('error:', error)

  if (error || !volunteers) return []

  return volunteers.map((volunteer) => ({
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

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function stringToColor(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return `hsl(${hash % 360}, 60%, 45%)`
}