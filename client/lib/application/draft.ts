'use server'

import { applicationsOpen } from '@/lib/application/config'
import { decodeAnswers } from '@/lib/application/wire'
import { requireRole } from '@/lib/auth/dal'
import { cleanDraftAnswers } from '@/lib/data/hackerDraft'
import { profileColumns } from '@/lib/profile/fields'
import { createClient } from '@/lib/supabase/server'

export type SaveDraftResult = { ok: true; savedAt: string } | { ok: false }

/**
 * Saves the unfinished application to the applicant's account. Called when they switch sections
 * or save and exit, not on every keystroke (the browser keeps those). The profile answers in it
 * are also written to their public.user row.
 */
export async function saveHackerDraft(encodedAnswers: unknown, step: unknown): Promise<SaveDraftResult> {
  // Server Actions are public endpoints: re-check the session and treat the input as untrusted.
  const user = await requireRole(['applicant', 'admin'])
  if (!user || !applicationsOpen()) return { ok: false }

  const savedAt = new Date().toISOString()
  const supabase = await createClient()
  // The answers arrive encoded (see lib/application/wire.ts).
  const cleaned = cleanDraftAnswers(decodeAnswers(encodedAnswers))
  const { error } = await supabase.from('hacker_draft').upsert(
    {
      user_id: user.id,
      answers: cleaned,
      step: typeof step === 'string' && /^[a-z0-9_-]{1,64}$/i.test(step) ? step : '',
      updated_at: savedAt,
    },
    { onConflict: 'user_id' }
  )

  if (error) {
    console.error('saveHackerDraft: failed to save draft', error)
    return { ok: false }
  }

  // Name, pronouns and t-shirt size are the applicant's profile: keep Profile & settings
  // showing what they have typed here. Best effort; submitting writes them again.
  const profile = profileColumns(cleaned)
  if (Object.keys(profile).length > 0) {
    const { error: profileError } = await supabase.from('user').update(profile).eq('user_id', user.id)
    if (profileError) console.error('saveHackerDraft: failed to update the profile', profileError)
  }

  return { ok: true, savedAt }
}
