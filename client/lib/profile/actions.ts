'use server'

import { revalidatePath } from 'next/cache'
import { shirtSize } from '@/lib/application/forms/shared'
import { PROFILE_FIELDS, type ProfileState, type ProfileValues } from '@/lib/profile/fields'
import { requireRole } from '@/lib/auth/dal'
import { createClient } from '@/lib/supabase/server'

const MAX_LENGTH = 100
const SHIRT_SIZES = new Set(shirtSize.options.map((option) => option.value))

export async function saveProfile(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await requireRole(['applicant', 'admin'])
  if (!user) return { values: prevState.values, error: 'Please log in again.' }

  const values = Object.fromEntries(
    PROFILE_FIELDS.map((field) => [field.id, String(formData.get(field.id) ?? '').trim()])
  ) as ProfileValues

  const errors: ProfileState['errors'] = {}
  if (!values.first_name) errors.first_name = 'Enter your first name.'
  if (!values.last_name) errors.last_name = 'Enter your last name.'
  if (!values.phone_number) errors.phone_number = 'Enter your phone number.'
  if (values.shirt_size && !SHIRT_SIZES.has(values.shirt_size)) errors.shirt_size = 'Choose a size from the list.'
  for (const field of PROFILE_FIELDS) {
    if (!errors[field.id] && values[field.id].length > MAX_LENGTH) errors[field.id] = 'That’s too long.'
  }
  if (Object.keys(errors).length > 0) return { values, errors }

  const supabase = await createClient()
  // Empty optional answers are stored as null, like the application does.
  const row = Object.fromEntries(PROFILE_FIELDS.map((field) => [field.id, values[field.id] || null]))
  const { data, error } = await supabase.from('user').update(row).eq('user_id', user.id).select('user_id')

  if (error || !data || data.length === 0) {
    console.error('saveProfile: failed to update user row', error ?? `no public.user row updated for ${user.id}`)
    return { values, error: 'We couldn’t save your changes. Please try again.' }
  }

  revalidatePath('/applicant', 'layout')
  return { values, saved: true }
}
