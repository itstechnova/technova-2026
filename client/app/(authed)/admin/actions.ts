'use server'

import { createClient } from '@/lib/supabase/server'
import { sendAcceptanceEmail } from '@/lib/resend/send'
import { headers } from 'next/headers'

export type AcceptApplicantState = {
  error?: string
  message?: string
} | null

export async function acceptApplicant(
  prevState: AcceptApplicantState,
  formData: FormData
): Promise<AcceptApplicantState> {
  // Server Actions are public endpoints, so re-check the role here rather than
  // relying on the button only being rendered on the admin dashboard.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user?.app_metadata?.role !== 'admin') {
    return { error: 'Not authorized' }
  }

  const email = formData.get('email')
  if (typeof email !== 'string' || !email.includes('@')) {
    return { error: 'Invalid applicant email' }
  }

  const headersList = await headers()
  const origin = headersList.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL

  try {
    await sendAcceptanceEmail(email, `${origin}/login`)
  } catch (error) {
    console.error('acceptApplicant: failed to send acceptance email', error)
    return { error: error instanceof Error ? error.message : 'Failed to send email' }
  }

  return { message: `Acceptance email sent to ${email}` }
}
