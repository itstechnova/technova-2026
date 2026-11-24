import { NextResponse, type NextRequest } from 'next/server'

import { resume } from '@/lib/application/forms/shared'
import { requireRole } from '@/lib/auth/dal'
import { getResumePath } from '@/lib/data/profile'
import { createClient } from '@/lib/supabase/server'

const LINK_SECONDS = 60

// Opens the signed-in applicant's own resume. The bucket is private, so this hands the browser a
// short-lived link to the file; without a resume it goes to Profile & settings, where one is added.
export async function GET(request: NextRequest) {
  const user = await requireRole(['applicant', 'admin'])
  if (!user) return NextResponse.redirect(new URL('/login', request.url))
  const profile = new URL('/applicant/profile', request.url)

  const path = await getResumePath(user.id)
  if (!path) return NextResponse.redirect(profile)

  const supabase = await createClient()
  const { data, error } = await supabase.storage.from(resume.bucket).createSignedUrl(path, LINK_SECONDS)
  if (error || !data?.signedUrl) {
    console.error('applicant/resume: failed to sign the resume link', error)
    return NextResponse.redirect(profile)
  }

  return NextResponse.redirect(data.signedUrl)
}
