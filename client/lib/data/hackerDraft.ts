import 'server-only'

import { hackerForm } from '@/lib/application/forms/hacker'
import type { AnswerValue, Answers } from '@/lib/application/types'
import { requireRole } from '@/lib/auth/dal'
import { createClient } from '@/lib/supabase/server'

// The unfinished application saved to the applicant's account (public.hacker_draft): one jsonb row
// per user, written when they switch sections or save and exit, deleted when they submit.

export type SavedDraft = {
  answers: Answers
  /** Id of the step the applicant was on (a section id, or "review"). */
  step: string
  /** ISO time of the last save. */
  savedAt: string
}

const QUESTION_IDS = new Set(hackerForm.flatMap((section) => section.questions).map((question) => question.id))
const MAX_TEXT = 5000
const MAX_ITEMS = 60

function cleanValue(value: unknown): AnswerValue | undefined {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.slice(0, MAX_TEXT)
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .slice(0, MAX_ITEMS)
      .map((item) => item.slice(0, MAX_TEXT))
  }
  return undefined
}

/** Keeps only this form's questions, in the shapes the form uses. Never trusts what it is given. */
export function cleanDraftAnswers(input: unknown): Answers {
  const answers: Answers = {}
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return answers
  for (const [id, value] of Object.entries(input)) {
    if (!QUESTION_IDS.has(id)) continue
    const clean = cleanValue(value)
    if (clean !== undefined) answers[id] = clean
  }
  return answers
}

/** The signed-in user's saved draft, or null. A failed read is treated as "no draft". */
export async function getMyHackerDraft(): Promise<SavedDraft | null> {
  const user = await requireRole(['applicant', 'admin'])
  if (!user) return null
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('hacker_draft')
    .select('answers, step, updated_at')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    console.error('getMyHackerDraft: failed to load draft', error)
    return null
  }
  if (!data) return null

  return {
    answers: cleanDraftAnswers(data.answers),
    step: typeof data.step === 'string' ? data.step : '',
    savedAt: typeof data.updated_at === 'string' ? data.updated_at : '',
  }
}
