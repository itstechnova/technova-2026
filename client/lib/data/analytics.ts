import { createClient } from '@/lib/supabase/client'

export type CheckboxCount = {
  value: string
  count: number
}

export function countArrayValues(
  data: Record<string, string[] | null | undefined>[],
  field: string
): CheckboxCount[] {
  const counts: Record<string, number> = {}

  for (const row of data) {
    const values = row[field] ?? []

    for (const value of values) {
      counts[value] = (counts[value] ?? 0) + 1
    }
  }

  return Object.entries(counts).map(([value, count]) => ({
    value,
    count,
  }))
}

export async function getHackerCheckboxCounts() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('hacker')
    .select(`
      interested_tech_industries,
      interested_technical_sessions,
      interested_career_sessions,
      interested_community_sessions
    `)

    if (error) {
        console.error('Error fetching hacker checkbox data:', error)
      
        return {
          interested_tech_industries: [],
          interested_technical_sessions: [],
          interested_career_sessions: [],
          interested_community_sessions: [],
        }
      }

  return {
    interested_tech_industries: countArrayValues(data, 'interested_tech_industries'),
    interested_technical_sessions: countArrayValues(data, 'interested_technical_sessions'),
    interested_career_sessions: countArrayValues(data, 'interested_career_sessions'),
    interested_community_sessions: countArrayValues(data, 'interested_community_sessions'),
  }
}