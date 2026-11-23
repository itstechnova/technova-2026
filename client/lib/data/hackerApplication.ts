import 'server-only'

import { hackerForm } from '@/lib/application/forms/hacker'
import type { Answers, AnswerValue, Form, Question } from '@/lib/application/types'
import { requireRole } from '@/lib/auth/dal'
import { createClient } from '@/lib/supabase/server'

export type ApplicationTable = 'hacker' | 'user'

/** A database row as returned by / sent to Supabase, keyed by column name. */
export type DbRow = Record<string, unknown>

/**
 * The questions of a form stored in `table`. A question's id is its column name, so this is the
 * single source of the column mapping: adding a question = adding config + a column.
 */
export function questionsForTable(form: Form, table: ApplicationTable): Question[] {
  return form
    .flatMap((section) => section.questions)
    .filter((question) => (question.table ?? 'hacker') === table)
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

/** The signed-in user's submitted hacker application, or null when they have not submitted. */
export async function getMyHackerApplication(): Promise<{
  answers: Answers
  submittedAt: string | null
} | null> {
  const user = await requireRole(['applicant', 'admin'])
  if (!user) throw new Error('Not signed in.')
  const supabase = await createClient()

  const hackerQuestions = questionsForTable(hackerForm, 'hacker')
  const userQuestions = questionsForTable(hackerForm, 'user')

  const { data: hackerRow, error: hackerError } = await supabase
    .from('hacker')
    .select(['submitted_at', ...hackerQuestions.map((question) => question.id)].join(','))
    .eq('hacker_id', user.id)
    .maybeSingle<DbRow>()

  if (hackerError) {
    console.error('getMyHackerApplication: failed to load hacker row', hackerError)
    throw new Error('Could not load your application.')
  }
  if (!hackerRow) return null

  const { data: userRow, error: userError } = await supabase
    .from('user')
    .select(userQuestions.map((question) => question.id).join(','))
    .eq('user_id', user.id)
    .maybeSingle<DbRow>()

  if (userError) {
    console.error('getMyHackerApplication: failed to load user row', userError)
    throw new Error('Could not load your application.')
  }

  const submittedAt = hackerRow.submitted_at

  return {
    answers: {
      ...rowToAnswers(userQuestions, userRow),
      ...rowToAnswers(hackerQuestions, hackerRow),
    },
    submittedAt: typeof submittedAt === 'string' ? submittedAt : null,
  }
}
