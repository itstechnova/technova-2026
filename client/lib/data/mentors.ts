import { createClient } from '@/lib/supabase/server'

export type AcceptanceStatus = 'Accepted' | 'Pending' | 'Rejected' | 'Waitlisted'

export type MentorApplication = {
  id: string
  name: string
  email: string
  organization: string
  acceptanceStatus: AcceptanceStatus
  applicationDate: string
  avatarColor: string
  initials: string
  score: number | null
  mentor_question1: string
  location?: string
}


export async function getMentorApplications() {
  const supabase = await createClient()

  const { data: mentors, error } = await supabase
    .from('mentor')
    .select(`
      *,
      user:mentor_id (
        first_name,
        last_name,
        email,
        accepted,
        created_at
      )
    `)

    console.log('mentor:', mentors)
    console.log('error:', error)

  if (error || !mentors) return []

  return mentors.map((mentor) => ({
    id: mentor.mentor_id,
    name: `${mentor.user?.first_name ?? ''} ${mentor.user?.last_name ?? ''}`.trim() || 'Unknown',
    email: mentor.user?.email ?? '',
    organization: mentor.organization,
    acceptanceStatus: (mentor.user?.accepted === true ? 'Accepted' : mentor.user?.accepted === false ? 'Rejected' : 'Pending') as AcceptanceStatus,
    applicationDate: mentor.user?.created_at?.split('T')[0] ?? '',
    avatarColor: stringToColor(`${mentor.user?.first_name ?? ''} ${mentor.user?.last_name ?? ''}`),
    initials: getInitials(`${mentor.user?.first_name ?? ''} ${mentor.user?.last_name ?? ''}`),
    score: mentor.score,
    mentor_question1: mentor.question_1,
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