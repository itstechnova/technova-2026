import 'server-only'

import { resume } from '@/lib/application/forms/shared'
import type { Answers } from '@/lib/application/types'
import { fileOwner, validateFilePath } from '@/lib/application/validate'
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

/**
 * The path of the resume on the user's own public.user row (see lib/resume/actions.ts), or null
 * when they have none. A failed read, or a path that isn't theirs, is treated as "no resume".
 */
export async function getResumePath(userId: string): Promise<string | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('user').select(resume.id).eq('user_id', userId).maybeSingle()

  if (error) console.error('getResumePath: failed to load user row', error)
  const path = (data as Record<string, unknown> | null)?.[resume.id]
  if (typeof path !== 'string' || validateFilePath(resume, path) !== null || fileOwner(path) !== userId) {
    return null
  }
  return path
}
