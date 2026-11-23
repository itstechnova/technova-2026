import { EmailShell, Paragraph } from './shell'

type WelcomeEmailProps = {
  email: string
  loginUrl: string
}

export function WelcomeEmail({ email, loginUrl }: WelcomeEmailProps) {
  return (
    <EmailShell
      preview="Your TechNova account is ready"
      eyebrow="Account confirmed"
      title="Welcome to TechNova"
      action={{ label: 'Sign in', href: loginUrl }}
    >
      <Paragraph>
        Your email ({email}) is confirmed and your account is active. Sign in whenever you&apos;re ready to continue.
      </Paragraph>
    </EmailShell>
  )
}

export default function WelcomeEmailPreview() {
  return <WelcomeEmail email="jordan@example.com" loginUrl="https://itstechnova.org/login" />
}
