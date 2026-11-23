import { EmailShell, Paragraph } from './shell'

type ApplicationReceivedEmailProps = {
  /** The applicant's first name, when they gave one. */
  firstName?: string
  applicationUrl: string
}

export function ApplicationReceivedEmail({ firstName, applicationUrl }: ApplicationReceivedEmailProps) {
  return (
    <EmailShell
      preview="We received your TechNova application"
      eyebrow="Application received"
      title="Thank you for applying"
      action={{ label: 'View my application', href: applicationUrl }}
    >
      <Paragraph>
        {firstName ? `Hi ${firstName}, we` : 'We'} received your hacker application for TechNova. There is nothing
        more you need to do for now.
      </Paragraph>
      <Paragraph>
        We will email you at this address once a decision has been made. Until then, you can sign in any time to see
        exactly what you submitted. Answers can&apos;t be changed after submitting.
      </Paragraph>
    </EmailShell>
  )
}

export default function ApplicationReceivedEmailPreview() {
  return <ApplicationReceivedEmail firstName="Jordan" applicationUrl="https://itstechnova.org/applicant/application" />
}
