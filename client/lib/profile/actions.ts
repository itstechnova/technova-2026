'use server'

import { revalidatePath } from 'next/cache'
import { PROFILE_FIELDS, validProfileValue, type ProfileState, type ProfileValues } from '@/lib/profile/fields'
import { requireRole } from '@/lib/auth/dal'
import { createClient } from '@/lib/supabase/server'

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
  for (const { id } of PROFILE_FIELDS) {
    if (errors[id] || validProfileValue(id, values[id])) continue
    errors[id] = id === 'shirt_size' ? 'Choose a size from the list.' : 'That’s too long.'
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

  // An unfinished application asks for the same details: carry the change into the saved draft.
  // Its save time is left alone, so it doesn't outrank newer answers still in the browser.
  const { data: draft, error: draftError } = await supabase
    .from('hacker_draft')
    .select('answers')
    .eq('user_id', user.id)
    .maybeSingle()
  if (draft) {
    const answers = typeof draft.answers === 'object' && draft.answers !== null ? draft.answers : {}
    const { error: patchError } = await supabase
      .from('hacker_draft')
      .update({ answers: { ...answers, ...values } })
      .eq('user_id', user.id)
    if (patchError) console.error('saveProfile: failed to update the saved draft', patchError)
  } else if (draftError) {
    console.error('saveProfile: failed to load the saved draft', draftError)
  }

  revalidatePath('/applicant', 'layout')
  return { values, saved: true }
}
