import { Body, Button, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'

type WelcomeEmailProps = {
  email: string
  loginUrl: string
}

export function WelcomeEmail({ email, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your TechNova account is ready</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Welcome to TechNova</Heading>
          <Text style={text}>
            Your email ({email}) is confirmed and your account is active. Sign in whenever you&apos;re ready to
            continue.
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

export default function WelcomeEmailPreview() {
  return <WelcomeEmail email="jordan@example.com" loginUrl="https://itstechnova.org/login" />
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
