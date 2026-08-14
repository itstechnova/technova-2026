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
  essayWhyAttend: string
  essayHopeToLearn: string
  essayProudProject: string
  location?: string
}

export async function getHackerApplications() {
  const supabase = await createClient()

  const { data: hackers, error } = await supabase
    .from('hacker')
    .select(`
      *,
      user:hacker_id (
        name,
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
    name: hacker.user?.name ?? 'Unknown',
    email: hacker.user?.email ?? '',
    school: hacker.school,
    gradYear: hacker.year,
    major: hacker.major,
    resumeFileName: hacker.resume_url,
    acceptanceStatus: hacker.user?.accepted ?? 'Pending',
    applicationDate: hacker.user?.created_at?.split('T')[0] ?? '',
    avatarColor: stringToColor(hacker.user?.name ?? ''),
    initials: getInitials(hacker.user?.name ?? ''),
    score: hacker.score,
    essayWhyAttend: hacker.question_1,
    essayProudProject: hacker.question_2,
    essayHopeToLearn: hacker.question_3,
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