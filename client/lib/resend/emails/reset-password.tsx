import { Body, Button, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'

type ResetPasswordEmailProps = {
  resetUrl: string
}

export function ResetPasswordEmail({ resetUrl }: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your TechNova password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Reset your password</Heading>
          <Text style={text}>
            We received a request to reset your TechNova password. If this wasn&apos;t you, you can ignore this email.
          </Text>
          <Button style={button} href={resetUrl}>
            Reset password
          </Button>
          <Text style={text}>Or paste this link into your browser: {resetUrl}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export default function ResetPasswordEmailPreview() {
  return <ResetPasswordEmail resetUrl="https://itstechnova.org/auth/confirm?token_hash=example&type=recovery" />
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
