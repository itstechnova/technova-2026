import { Body, Button, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'

type ConfirmSignupEmailProps = {
  email: string
  confirmUrl: string
}

export function ConfirmSignupEmail({ email, confirmUrl }: ConfirmSignupEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your TechNova account</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Confirm your email</Heading>
          <Text style={text}>
            Thanks for signing up with {email}. Use the button below to confirm your address and finish creating
            your account.
          </Text>
          <Button style={button} href={confirmUrl}>
            Confirm email
          </Button>
          <Text style={text}>Or paste this link into your browser: {confirmUrl}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export default function ConfirmSignupEmailPreview() {
  return <ConfirmSignupEmail email="jordan@example.com" confirmUrl="https://itstechnova.org/auth/confirm?token_hash=example&type=signup" />
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
