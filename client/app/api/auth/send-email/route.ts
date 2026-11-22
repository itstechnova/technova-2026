import { Webhook } from 'standardwebhooks'
import { sendConfirmSignupEmail, sendResetPasswordEmail } from '@/lib/resend/send'

const hookSecret = (process.env.SEND_EMAIL_HOOK_SECRET ?? '').replace('v1,whsec_', '')

type HookPayload = {
  user: { email: string }
  email_data: {
    token_hash: string
    redirect_to: string
    email_action_type: string
    site_url: string
  }
}

function appOrigin(email_data: HookPayload['email_data']) {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (fromEnv) return fromEnv

  if (email_data.redirect_to) {
    try {
      return new URL(email_data.redirect_to).origin
    } catch {
      // ignore invalid redirect_to
    }
  }

  return email_data.site_url.replace(/\/$/, '')
}

function verifyPayload(payload: string, headers: Record<string, string>) {
  const wh = new Webhook(hookSecret)
  return wh.verify(payload, headers) as HookPayload
}

export async function POST(request: Request) {
  if (!hookSecret) {
    console.error('send-email hook: SEND_EMAIL_HOOK_SECRET is not set')
    return Response.json(
      { error: { http_code: 500, message: 'Email hook is not configured' } },
      { status: 500 }
    )
  }

  const payload = await request.text()
  const headers = Object.fromEntries(request.headers)

  let hookPayload: HookPayload

  try {
    hookPayload = verifyPayload(payload, headers)
  } catch (error) {
    console.error('send-email hook: signature verification failed', error)
    return Response.json(
      { error: { http_code: 401, message: 'Invalid webhook signature' } },
      { status: 401 }
    )
  }

  const { user, email_data } = hookPayload

  try {
    const confirmParams = new URLSearchParams({
      token_hash: email_data.token_hash,
      type: email_data.email_action_type,
      next: email_data.redirect_to,
    })
    const confirmUrl = `${appOrigin(email_data)}/auth/confirm?${confirmParams.toString()}`

    if (email_data.email_action_type === 'signup') {
      await sendConfirmSignupEmail(user.email, confirmUrl)
    } else if (email_data.email_action_type === 'recovery') {
      await sendResetPasswordEmail(user.email, confirmUrl)
    } else {
      throw new Error(`Unsupported email_action_type: ${email_data.email_action_type}`)
    }

    return Response.json({}, { status: 200 })
  } catch (error) {
    console.error('send-email hook: failed to send email', error)
    return Response.json(
      { error: { http_code: 500, message: error instanceof Error ? error.message : 'Unknown error' } },
      { status: 500 }
    )
  }
}
