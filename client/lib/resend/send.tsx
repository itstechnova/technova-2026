import type { ReactNode } from 'react'
import { render } from '@react-email/render'
import { getResendClient } from './client'
import { AcceptanceEmail } from './emails/acceptance'
import { ConfirmSignupEmail } from './emails/confirm-signup'
import { ResetPasswordEmail } from './emails/reset-password'
import { WelcomeEmail } from './emails/welcome'

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

type SendEmailArgs = {
  to: string
  subject: string
  react: ReactNode
}

export async function sendEmail({ to, subject, react }: SendEmailArgs) {
  if (!process.env.RESEND_API_KEY) {
    const html = await render(react)
    console.log(`[email:dev] to=${to} subject="${subject}"\n${html}`)
    return
  }

  const resend = getResendClient()
  const { error } = await resend.emails.send({ from: FROM_EMAIL, to, subject, react })

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

export async function sendConfirmSignupEmail(to: string, confirmUrl: string) {
  await sendEmail({
    to,
    subject: 'Confirm your TechNova account',
    react: <ConfirmSignupEmail email={to} confirmUrl={confirmUrl} />,
  })
}

export async function sendResetPasswordEmail(to: string, resetUrl: string) {
  await sendEmail({
    to,
    subject: 'Reset your TechNova password',
    react: <ResetPasswordEmail resetUrl={resetUrl} />,
  })
}

export async function sendAcceptanceEmail(to: string, loginUrl: string) {
  await sendEmail({
    to,
    subject: "You've been accepted to TechNova",
    react: <AcceptanceEmail loginUrl={loginUrl} />,
  })
}

export async function sendWelcomeEmail(to: string, loginUrl: string) {
  await sendEmail({
    to,
    subject: 'Welcome to TechNova',
    react: <WelcomeEmail email={to} loginUrl={loginUrl} />,
  })
}
