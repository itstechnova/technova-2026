'use server'

import { revalidatePath } from 'next/cache'

import { resume } from '@/lib/application/forms/shared'
import { fileOwner, validateFilePath } from '@/lib/application/validate'
import { requireRole } from '@/lib/auth/dal'
import { createClient } from '@/lib/supabase/server'

// The applicant's resume: a file in the private `resumes` bucket, under their own folder, and its
// path on their public.user row. The browser uploads the file straight to Storage (it is too big
// to pass through a Server Action); these actions then record it, or take it away.

export type ResumeResult = { ok: true; path: string } | { ok: false; error: string }

const SIGN_IN = 'Please log in again.'
const NOT_SAVED = 'We couldn’t save your resume. Please try again.'
const NOT_REMOVED = 'We couldn’t remove your resume. Please try again.'

const folderOf = (userId: string) => `${userId}/${resume.id}`

type Storage = Awaited<ReturnType<typeof createClient>>['storage']

/** Deletes every file in the applicant's resume folder except `keep`. Best effort. */
async function removeOtherFiles(storage: Storage, folder: string, names: string[], keep: string | null) {
  const stale = names.filter((name) => name !== keep).map((name) => `${folder}/${name}`)
  if (stale.length === 0) return
  const { error } = await storage.from(resume.bucket).remove(stale)
  if (error) console.error('resume: failed to remove replaced files', error)
}

/** Records a file the applicant has just uploaded as their resume, replacing any earlier one. */
export async function saveResume(path: unknown): Promise<ResumeResult> {
  // Server Actions are public endpoints: re-check the session and treat `path` as untrusted.
  const user = await requireRole(['applicant', 'admin'])
  if (!user) return { ok: false, error: SIGN_IN }

  if (typeof path !== 'string' || validateFilePath(resume, path) !== null || fileOwner(path) !== user.id) {
    return { ok: false, error: NOT_SAVED }
  }

  const supabase = await createClient()
  const folder = folderOf(user.id)
  const name = path.slice(folder.length + 1)

  // The upload has to be there, and within the size limit, before the profile points at it.
  const { data: files, error: listError } = await supabase.storage.from(resume.bucket).list(folder, { limit: 100 })
  const uploaded = files?.find((file) => file.name === name)
  const size = uploaded?.metadata?.size
  if (listError || !uploaded || (typeof size === 'number' && size > resume.maxBytes)) {
    if (listError) console.error('saveResume: failed to list the resume folder', listError)
    return { ok: false, error: NOT_SAVED }
  }

  const { data, error } = await supabase
    .from('user')
    .update({ [resume.id]: path })
    .eq('user_id', user.id)
    .select('user_id')

  if (error || !data || data.length === 0) {
    console.error('saveResume: failed to update user row', error ?? `no public.user row updated for ${user.id}`)
    return { ok: false, error: NOT_SAVED }
  }

  await removeOtherFiles(
    supabase.storage,
    folder,
    files.map((file) => file.name),
    name
  )

  revalidatePath('/applicant', 'layout')
  return { ok: true, path }
}

/** Takes the resume off the applicant's profile and deletes the file. */
export async function removeResume(): Promise<ResumeResult> {
  const user = await requireRole(['applicant', 'admin'])
  if (!user) return { ok: false, error: SIGN_IN }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user')
    .update({ [resume.id]: null })
    .eq('user_id', user.id)
    .select('user_id')

  if (error || !data || data.length === 0) {
    console.error('removeResume: failed to update user row', error ?? `no public.user row updated for ${user.id}`)
    return { ok: false, error: NOT_REMOVED }
  }

  const folder = folderOf(user.id)
  const { data: files, error: listError } = await supabase.storage.from(resume.bucket).list(folder, { limit: 100 })
  if (listError) console.error('removeResume: failed to list the resume folder', listError)
  await removeOtherFiles(supabase.storage, folder, (files ?? []).map((file) => file.name), null)

  revalidatePath('/applicant', 'layout')
  return { ok: true, path: '' }
}
