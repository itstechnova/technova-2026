'use server'

import { revalidatePath } from 'next/cache'

import { applicationsOpen } from '@/lib/application/config'
import { hackerForm } from '@/lib/application/forms/hacker'
import type { Answers, AnswerValue, Question, SubmitResult } from '@/lib/application/types'
import { isVisible, validateForm, visibleAnswers } from '@/lib/application/validate'
import { requireRole } from '@/lib/auth/dal'
import { isNumberQuestion, questionsForTable, type DbRow } from '@/lib/data/hackerApplication'
import { createClient } from '@/lib/supabase/server'

const GENERIC_ERROR = 'Something went wrong while submitting your application. Please try again.'
const ALREADY_SUBMITTED = 'You have already submitted your application.'
const INVALID = 'Some answers need your attention. Please review them and try again.'
const UNIQUE_VIOLATION = '23505'
const SMALLINT_MAX = 32767

/** Maps one cleaned answer to its column value. Unanswered questions are stored as null. */
function toColumn(
  question: Question,
  value: AnswerValue | undefined,
  visible: boolean
): string | string[] | boolean | number | null {
  switch (question.type) {
    case 'consent':
      // An unticked consent that was shown is an explicit "no".
      return visible ? value === true : null
    case 'multi_choice': {
      if (!Array.isArray(value)) return null
      const items = value.filter((item) => typeof item === 'string' && item !== '')
      return items.length > 0 ? items : null
    }
    default: {
      if (typeof value !== 'string' || value === '') return null
      return isNumberQuestion(question) ? Number.parseInt(value, 10) : value
    }
  }
}

/** Builds a row from the form's own question ids only; client input is never spread in. */
function buildRow(questions: Question[], answers: Answers): DbRow {
  const row: DbRow = {}
  for (const question of questions) {
    row[question.id] = toColumn(question, answers[question.id], isVisible(question, answers))
  }
  return row
}

export async function submitHackerApplication(answers: Answers): Promise<SubmitResult> {
  // Server Actions are public endpoints: re-check the session and treat `answers` as untrusted.
  const user = await requireRole(['applicant', 'admin'])
  if (!user) return { ok: false, error: 'Please sign in again.' }

  if (!applicationsOpen()) {
    return { ok: false, error: 'Applications are closed.' }
  }

  const input: Answers =
    typeof answers === 'object' && answers !== null && !Array.isArray(answers) ? answers : {}
  const cleaned = visibleAnswers(hackerForm, input)

  const fieldErrors = validateForm(hackerForm, cleaned)

  // Numeric answers must be whole numbers that fit their smallint column.
  for (const question of hackerForm.flatMap((section) => section.questions)) {
    const value = cleaned[question.id]
    if (!isNumberQuestion(question) || fieldErrors[question.id] || typeof value !== 'string') {
      continue
    }
    if (value !== '' && (!/^\d{1,5}$/.test(value) || Number(value) > SMALLINT_MAX)) {
      fieldErrors[question.id] = 'Enter a whole number.'
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: INVALID, fieldErrors }
  }

  const supabase = await createClient()

  // A hacker row exists only once an application has been submitted.
  const { data: existing, error: existingError } = await supabase
    .from('hacker')
    .select('hacker_id')
    .eq('hacker_id', user.id)
    .maybeSingle()

  if (existingError) {
    console.error('submitHackerApplication: failed to check for an existing application', existingError)
    return { ok: false, error: GENERIC_ERROR }
  }
  if (existing) {
    return { ok: false, error: ALREADY_SUBMITTED }
  }

  // 1. Profile answers go on the user's own public.user row (created by the signup trigger).
  const userRow = buildRow(questionsForTable(hackerForm, 'user'), cleaned)
  const { data: updatedUsers, error: userError } = await supabase
    .from('user')
    .update(userRow)
    .eq('user_id', user.id)
    .select('user_id')

  if (userError || !updatedUsers || updatedUsers.length === 0) {
    console.error(
      'submitHackerApplication: failed to update user row',
      userError ?? `no public.user row updated for ${user.id}`
    )
    return { ok: false, error: GENERIC_ERROR }
  }

  // 2. Everything else is the application itself. No RETURNING, so only the INSERT policy applies.
  const graduationYear = cleaned.graduation_year
  const hackerRow: DbRow = {
    ...buildRow(questionsForTable(hackerForm, 'hacker'), cleaned),
    // Legacy numeric column, kept in sync when the answer is a plain year (not "Other: ...").
    year:
      typeof graduationYear === 'string' && /^\d{4}$/.test(graduationYear)
        ? Number(graduationYear)
        : null,
    hacker_id: user.id,
    submitted_at: new Date().toISOString(),
  }

  const { error: hackerError } = await supabase.from('hacker').insert(hackerRow)

  if (hackerError) {
    // Two submissions raced: the primary key lets only one through.
    if (hackerError.code === UNIQUE_VIOLATION) {
      return { ok: false, error: ALREADY_SUBMITTED }
    }
    console.error('submitHackerApplication: failed to insert hacker row', hackerError)
    return { ok: false, error: GENERIC_ERROR }
  }

  revalidatePath('/applicant', 'layout')
  return { ok: true }
}
