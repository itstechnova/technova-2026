import 'server-only'

import type { Answers } from '@/lib/application/types'
import { PROFILE_FIELDS } from '@/lib/profile/fields'
import { createClient } from '@/lib/supabase/server'

/**
 * The details on the user's own public.user row (Profile & settings), as application answers.
 * Empty columns are left out. A failed read is treated as "nothing saved".
 */
export async function getProfileAnswers(userId: string): Promise<Answers> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user')
    .select(PROFILE_FIELDS.map((field) => field.id).join(','))
    .eq('user_id', userId)
    .maybeSingle()

  if (error) console.error('getProfileAnswers: failed to load user row', error)
  const row = (data ?? {}) as unknown as Record<string, unknown>

  const answers: Answers = {}
  for (const { id } of PROFILE_FIELDS) {
    const value = row[id]
    if (typeof value === 'string' && value !== '') answers[id] = value
  }
  return answers
}
