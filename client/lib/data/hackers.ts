import { createClient } from '@/lib/supabase/server'

export type AcceptanceStatus = 'Accepted' | 'Pending' | 'Rejected' | 'Waitlisted'

export type HackerApplication = {
  id: string
  name: string
  email: string
  school: string
  gradYear: string
  major: string
  resumeFileName: string
  acceptanceStatus: AcceptanceStatus
  applicationDate: string
  avatarColor: string
  initials: string
  score: number | null
  hacker_question1: string
  hacker_question2: string
  hacker_question3: string
  location?: string
}

export async function getHackerApplications() {
  const supabase = await createClient()

  const { data: hackers, error } = await supabase
    .from('hacker')
    .select(`
      *,
      user:hacker_id (
        first_name,
        last_name,
        email,
        accepted,
        created_at
      )
    `)

    console.log('hackers:', hackers)
    console.log('error:', error)

  if (error || !hackers) return []

  return hackers.map((hacker) => ({
    id: hacker.hacker_id,
    name: `${hacker.user?.first_name ?? ''} ${hacker.user?.last_name ?? ''}`.trim() || 'Unknown',
    email: hacker.user?.email ?? '',
    school: hacker.school,
    gradYear: hacker.year,
    major: hacker.major,
    resumeFileName: hacker.resume_url,
    acceptanceStatus: hacker.user?.accepted === true ? 'Accepted' : hacker.user?.accepted === false ? 'Rejected' : 'Pending' as AcceptanceStatus,
    applicationDate: hacker.user?.created_at?.split('T')[0] ?? '',
    avatarColor: stringToColor(`${hacker.user?.first_name ?? ''} ${hacker.user?.last_name ?? ''}`),
    initials: getInitials(`${hacker.user?.first_name ?? ''} ${hacker.user?.last_name ?? ''}`),
    score: hacker.score,
    hacker_question1: hacker.question_1,
    hacker_question2: hacker.question_2,
    hacker_question3: hacker.question_3,
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