import { Body, Button, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'

type AcceptanceEmailProps = {
  loginUrl: string
}

export function AcceptanceEmail({ loginUrl }: AcceptanceEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You&apos;ve been accepted to TechNova</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>You&apos;re in!</Heading>
          <Text style={text}>
            Congratulations — your application to TechNova has been accepted. We&apos;re excited to have you. Sign in
            to see the next steps.
          </Text>
          <Button style={button} href={loginUrl}>
            Sign in
          </Button>
          <Text style={text}>If you have questions, reply to this email or contact the TechNova team.</Text>
        </Container>
      </Body>
    </Html>
  )
}

export default function AcceptanceEmailPreview() {
  return <AcceptanceEmail loginUrl="https://itstechnova.org/login" />
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
