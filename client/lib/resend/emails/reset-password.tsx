import { EmailShell, Paragraph } from './shell'

type ResetPasswordEmailProps = {
  resetUrl: string
}

export function ResetPasswordEmail({ resetUrl }: ResetPasswordEmailProps) {
  return (
    <EmailShell
      preview="Reset your TechNova password"
      eyebrow="Password reset"
      title="Reset your password"
      action={{ label: 'Choose a new password', href: resetUrl }}
    >
      <Paragraph>We received a request to reset your TechNova password.</Paragraph>
      <Paragraph>If this wasn&apos;t you, you can ignore this email and your password stays the same.</Paragraph>
    </EmailShell>
  )
}

export default function ResetPasswordEmailPreview() {
  return <ResetPasswordEmail resetUrl="https://itstechnova.org/auth/confirm?token_hash=example&type=recovery" />
}
