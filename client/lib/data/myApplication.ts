import 'server-only'

import { APPLICATIONS, type ApplicationType } from '@/lib/application/applicationTypes'
import type { Answers, AnswerValue, Form, Question } from '@/lib/application/types'
import { requireRole } from '@/lib/auth/dal'
import { createClient } from '@/lib/supabase/server'

/** "application": the application type's own table (hacker, volunteer, …). "user": the shared profile row. */
export type ApplicationTable = 'application' | 'user'

/** A database row as returned by / sent to Supabase, keyed by column name. */
export type DbRow = Record<string, unknown>

/**
 * The questions of a form stored in `table`. A question's id is its column name, so this is the
 * single source of the column mapping: adding a question = adding config + a column.
 */
export function questionsForTable(form: Form, table: ApplicationTable): Question[] {
  return form
    .flatMap((section) => section.questions)
    .filter((question) => (question.table ?? 'application') === table)
}

/** Numeric short-text answers (e.g. `age`) are stored as integers. */
export function isNumberQuestion(question: Question): boolean {
  return question.type === 'short_text' && question.inputType === 'number'
}

/** Maps a stored column value back to the form's answer shape. `undefined` = no answer. */
function toAnswer(question: Question, value: unknown): AnswerValue | undefined {
  if (value === null || value === undefined) return undefined

  switch (question.type) {
    case 'consent':
      return typeof value === 'boolean' ? value : undefined
    case 'multi_choice':
    case 'checkbox_grid':
      return Array.isArray(value)
        ? value.filter((item): item is string => typeof item === 'string')
        : undefined
    default:
      if (typeof value === 'number') return String(value)
      return typeof value === 'string' ? value : undefined
  }
}

function rowToAnswers(questions: Question[], row: DbRow | null): Answers {
  const answers: Answers = {}
  if (!row) return answers

  for (const question of questions) {
    const answer = toAnswer(question, row[question.id])
    if (answer !== undefined) answers[question.id] = answer
  }
  return answers
}

/** A Supabase error's fields, for logging (logged as-is it can print as `{}`). */
function describe(error: { message?: string; code?: string; details?: string; hint?: string }) {
  return { message: error.message, code: error.code, details: error.details, hint: error.hint }
}

/** The signed-in user's submitted application of this type, or null when they have not submitted. */
export async function getMyApplication(applicationType: ApplicationType): Promise<{
  answers: Answers
  submittedAt: string | null
} | null> {
  const user = await requireRole(['applicant', 'admin'])
  if (!user) throw new Error('Not signed in.')
  const { form, table, idColumn } = APPLICATIONS[applicationType]
  const supabase = await createClient()

  const applicationQuestions = questionsForTable(form, 'application')
  const userQuestions = questionsForTable(form, 'user')

  const { data: applicationRow, error: applicationError } = await supabase
    .from(table)
    .select(['submitted_at', ...applicationQuestions.map((question) => question.id)].join(','))
    .eq(idColumn, user.id)
    .maybeSingle<DbRow>()

  if (applicationError) {
    console.error(`getMyApplication(${applicationType}): failed to load application row`, describe(applicationError))
    throw new Error('Could not load your application.')
  }
  if (!applicationRow) return null

  const { data: userRow, error: userError } = await supabase
    .from('user')
    .select(userQuestions.map((question) => question.id).join(','))
    .eq('user_id', user.id)
    .maybeSingle<DbRow>()

  if (userError) {
    console.error(`getMyApplication(${applicationType}): failed to load user row`, describe(userError))
    throw new Error('Could not load your application.')
  }

  const submittedAt = applicationRow.submitted_at

  return {
    answers: {
      ...rowToAnswers(userQuestions, userRow),
      ...rowToAnswers(applicationQuestions, applicationRow),
    },
    submittedAt: typeof submittedAt === 'string' ? submittedAt : null,
  }
}
