'use server'

export type SignupState = {
  status: 'idle' | 'success' | 'duplicate' | 'error'
  message?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function joinInterestList(_prev: SignupState, formData: FormData): Promise<SignupState> {
  // Honeypot: real visitors never see or fill this field, so bots get a silent "success".
  if (formData.get('company')) return { status: 'success' }

  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  // interest_signup has RLS enabled with no public insert policy, so this runs server-side with the secret key.
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!baseUrl || !secretKey) {
    console.error('interest signup: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY')
    return { status: 'error', message: 'Signups are temporarily unavailable. Please try again later.' }
  }

  const endpoint = `${baseUrl}/rest/v1/interest_signup`
  // Supabase's API gateway reads the key from the `apikey` header; this request is server-to-server only.
  const headers = {
    apikey: secretKey,
    'Content-Type': 'application/json',
  }

  try {
    const existing = await fetch(
      `${endpoint}?select=id&email=eq.${encodeURIComponent(email)}&limit=1`,
      { headers, cache: 'no-store' },
    )
    if (existing.ok && ((await existing.json()) as unknown[]).length > 0) {
      return { status: 'duplicate', message: "You're already on the list — we'll be in touch!" }
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify({ email }),
      cache: 'no-store',
    })

    if (res.status === 409) {
      return { status: 'duplicate', message: "You're already on the list — we'll be in touch!" }
    }
    if (!res.ok) {
      console.error('interest signup insert failed', res.status, await res.text())
      return { status: 'error', message: 'Something went wrong. Please try again.' }
    }
  } catch (err) {
    console.error('interest signup request failed', err)
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }

  return { status: 'success', message: "You're on the list ✦ We'll email you with updates." }
}
