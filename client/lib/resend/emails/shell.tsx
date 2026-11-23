import type { ReactNode } from 'react'
import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Text } from '@react-email/components'
import { EVENT_DATES_SHORT_LABEL, SUPPORT_EMAIL } from '@/lib/application/config'

// The site's palette (app/globals.css), as plain values: email clients don't read CSS variables.
const BG = '#050026'
const INK = '#ffffff'
const MUTED = '#cfc4ff'
const CYAN = '#9edae6'
const LINE = '#4b3a72'
// Web fonts load in few email clients, so the site's typefaces are a first choice, not a promise.
const FONT = "'Josefin Sans', Helvetica, Arial, sans-serif"
const DISPLAY_FONT = `Righteous, ${FONT}`

type EmailShellProps = {
  /** The inbox preview line. */
  preview: string
  /** Small capitals above the title, like the site's section labels. */
  eyebrow: string
  title: string
  /** The one button, when the email has something to do. */
  action?: { label: string; href: string }
  children: ReactNode
}

/** The frame every TechNova email shares: wordmark, title, body, one button, footer. */
export function EmailShell({ preview, eyebrow, title, action, children }: EmailShellProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={wordmark}>TechNova</Text>
          <Text style={eyebrowStyle}>{eyebrow}</Text>
          <Heading style={heading}>{title}</Heading>
          {children}
          {action && (
            <Button style={button} href={action.href}>
              {action.label}
            </Button>
          )}
          <Hr style={rule} />
          <Text style={footer}>
            TechNova 6 · {EVENT_DATES_SHORT_LABEL} · Waterloo
            <br />
            Questions? Email{' '}
            <Link href={`mailto:${SUPPORT_EMAIL}`} style={footerLink}>
              {SUPPORT_EMAIL}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

/** A paragraph of body copy. */
export function Paragraph({ children }: { children: ReactNode }) {
  return <Text style={paragraph}>{children}</Text>
}

const body = {
  margin: 0,
  padding: '24px 12px',
  backgroundColor: BG,
  fontFamily: FONT,
}

const container = {
  maxWidth: '520px',
  margin: '0 auto',
  padding: '32px 28px',
  backgroundColor: BG,
}

const wordmark = {
  margin: '0 0 40px',
  color: INK,
  fontFamily: DISPLAY_FONT,
  fontSize: '20px',
  lineHeight: '24px',
}

const eyebrowStyle = {
  margin: '0 0 10px',
  color: CYAN,
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.12em',
  lineHeight: '16px',
  textTransform: 'uppercase' as const,
}

const heading = {
  margin: '0 0 20px',
  color: INK,
  fontFamily: DISPLAY_FONT,
  fontSize: '30px',
  fontWeight: 400,
  lineHeight: '36px',
}

const paragraph = {
  margin: '0 0 16px',
  color: MUTED,
  fontSize: '16px',
  lineHeight: '26px',
}

const button = {
  marginTop: '12px',
  padding: '13px 24px',
  borderRadius: '28px',
  backgroundColor: CYAN,
  color: BG,
  fontSize: '16px',
  fontWeight: 600,
  textDecoration: 'none',
  display: 'inline-block',
}

const rule = {
  margin: '40px 0 20px',
  borderColor: LINE,
}

const footer = {
  margin: 0,
  color: MUTED,
  fontSize: '13px',
  lineHeight: '22px',
}

const footerLink = {
  color: MUTED,
  textDecoration: 'underline',
}
