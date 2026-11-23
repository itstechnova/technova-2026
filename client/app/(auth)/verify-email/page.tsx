import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/AuthShell'
import { VerifyEmailPanel } from '@/components/auth/VerifyEmailPanel'

export const metadata: Metadata = { title: 'Check your email · TechNova' }

export default function VerifyEmailPage() {
  return (
    <AuthShell>
      <VerifyEmailPanel />
    </AuthShell>
  )
}
