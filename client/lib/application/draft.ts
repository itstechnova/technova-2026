'use server'

import { applicationsOpen } from '@/lib/application/config'
import { requireRole } from '@/lib/auth/dal'
import { cleanDraftAnswers } from '@/lib/data/hackerDraft'
import { createClient } from '@/lib/supabase/server'

export type SaveDraftResult = { ok: true; savedAt: string } | { ok: false }

/**
 * Saves the unfinished application to the applicant's account. Called when they switch sections
 * or save and exit, not on every keystroke (the browser keeps those).
 */
export async function saveHackerDraft(answers: unknown, step: unknown): Promise<SaveDraftResult> {
  // Server Actions are public endpoints: re-check the session and treat the input as untrusted.
  const user = await requireRole(['applicant', 'admin'])
  if (!user || !applicationsOpen()) return { ok: false }

  const savedAt = new Date().toISOString()
  const supabase = await createClient()
  const { error } = await supabase.from('hacker_draft').upsert(
    {
      user_id: user.id,
      answers: cleanDraftAnswers(answers),
      step: typeof step === 'string' && /^[a-z0-9_-]{1,64}$/i.test(step) ? step : '',
      updated_at: savedAt,
    },
    { onConflict: 'user_id' }
  )

  if (error) {
    console.error('saveHackerDraft: failed to save draft', error)
    return { ok: false }
  }
  return { ok: true, savedAt }
}
