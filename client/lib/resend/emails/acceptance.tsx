import { EmailShell, Paragraph } from './shell'

type AcceptanceEmailProps = {
  loginUrl: string
}

export function AcceptanceEmail({ loginUrl }: AcceptanceEmailProps) {
  return (
    <EmailShell
      preview="You've been accepted to TechNova"
      eyebrow="Application update"
      title="You're in!"
      action={{ label: 'Sign in', href: loginUrl }}
    >
      <Paragraph>
        Congratulations! Your application to TechNova has been accepted, and we&apos;re excited to have you. Sign in
        to see the next steps.
      </Paragraph>
    </EmailShell>
  )
}

export default function AcceptanceEmailPreview() {
  return <AcceptanceEmail loginUrl="https://itstechnova.org/login" />
}
