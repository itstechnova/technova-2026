import { firstName, lastName, pronouns, shirtSize } from '@/lib/application/forms/shared'

// Profile & settings: the details kept on the hacker's own public.user row. They are the same
// columns the application's "About you" questions write to.

export const PROFILE_FIELDS = [firstName, lastName, pronouns, shirtSize] as const
export type ProfileField = (typeof PROFILE_FIELDS)[number]['id']
export type ProfileValues = Record<ProfileField, string>

export type ProfileState = {
  values: ProfileValues
  errors?: Partial<Record<ProfileField, string>>
  /** A problem that isn't about one field. */
  error?: string
  saved?: boolean
}

export const PROFILE_MAX_LENGTH = 100
const SHIRT_SIZES = new Set(shirtSize.options.map((option) => option.value))

/** Whether `value` can be stored for `field`: short enough, and a real size for the t-shirt. */
export function validProfileValue(field: ProfileField, value: string): boolean {
  if (value.length > PROFILE_MAX_LENGTH) return false
  return field !== 'shirt_size' || value === '' || SHIRT_SIZES.has(value)
}

/**
 * The profile columns found in a set of application answers, ready for public.user. Only
 * questions the applicant has touched are included (so an untouched step never blanks the
 * profile); a cleared answer is stored as null, and an answer the profile wouldn't accept is left out.
 */
export function profileColumns(answers: Record<string, unknown>): Partial<Record<ProfileField, string | null>> {
  const row: Partial<Record<ProfileField, string | null>> = {}
  for (const { id } of PROFILE_FIELDS) {
    const value = answers[id]
    if (typeof value !== 'string') continue
    const trimmed = value.trim()
    if (validProfileValue(id, trimmed)) row[id] = trimmed || null
  }
  return row
}
