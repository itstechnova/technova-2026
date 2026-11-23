import { EmailShell, Paragraph } from './shell'

type ConfirmSignupEmailProps = {
  email: string
  confirmUrl: string
}

export function ConfirmSignupEmail({ email, confirmUrl }: ConfirmSignupEmailProps) {
  return (
    <EmailShell
      preview="Confirm your TechNova account"
      eyebrow="One more step"
      title="Confirm your email"
      action={{ label: 'Confirm my email', href: confirmUrl }}
    >
      <Paragraph>
        Thanks for signing up with {email}. Confirm your address to finish creating your TechNova account.
      </Paragraph>
      <Paragraph>If you didn&apos;t sign up, you can ignore this email.</Paragraph>
    </EmailShell>
  )
}

export default function ConfirmSignupEmailPreview() {
  return <ConfirmSignupEmail email="jordan@example.com" confirmUrl="https://itstechnova.org/auth/confirm?token_hash=example&type=signup" />
}
