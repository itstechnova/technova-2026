import { firstName, lastName, phoneNumber, pronouns, shirtSize } from '@/lib/application/forms/shared'

// Profile & settings: the details kept on the hacker's own public.user row. They are the same
// columns the application's "About you" questions write to.

export const PROFILE_FIELDS = [firstName, lastName, pronouns, phoneNumber, shirtSize] as const
export type ProfileField = (typeof PROFILE_FIELDS)[number]['id']
export type ProfileValues = Record<ProfileField, string>

export type ProfileState = {
  values: ProfileValues
  errors?: Partial<Record<ProfileField, string>>
  /** A problem that isn't about one field. */
  error?: string
  saved?: boolean
}
