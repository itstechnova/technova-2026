import { Body, Button, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'

type ApplicationReceivedEmailProps = {
  /** The applicant's first name, when they gave one. */
  firstName?: string
  applicationUrl: string
  eventDates: string
  supportEmail: string
}

export function ApplicationReceivedEmail({
  firstName,
  applicationUrl,
  eventDates,
  supportEmail,
}: ApplicationReceivedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>We received your TechNova application</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Thank you for applying to TechNova</Heading>
          <Text style={text}>
            {firstName ? `Hi ${firstName}, we` : 'We'} received your hacker application for TechNova ({eventDates}).
            There is nothing more you need to do for now.
          </Text>
          <Text style={text}>
            We will email you at this address once a decision has been made. Until then, you can sign in any time
            to see exactly what you submitted.
          </Text>
          <Button style={button} href={applicationUrl}>
            View my application
          </Button>
          <Text style={text}>
            Answers can&apos;t be changed after submitting. If something is wrong, or you have questions, email us at{' '}
            {supportEmail}.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default function ApplicationReceivedEmailPreview() {
  return (
    <ApplicationReceivedEmail
      firstName="Jordan"
      applicationUrl="https://itstechnova.org/applicant/application"
      eventDates="January 22-24, 2027"
      supportEmail="hello@itstechnova.org"
    />
  )
}

const main = {
  fontFamily: 'sans-serif',
}

const container = {
  maxWidth: '480px',
  margin: '0 auto',
}

const heading = {
  fontSize: '24px',
}

const text = {
  fontSize: '16px',
  lineHeight: '24px',
}

const button = {
  backgroundColor: '#4f46e5',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  padding: '12px 20px',
  textDecoration: 'none',
  display: 'inline-block',
}
