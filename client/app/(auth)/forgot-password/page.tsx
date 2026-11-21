import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthShell } from '@/components/auth/AuthShell'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export const metadata: Metadata = { title: 'Reset your password · TechNova' }

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </AuthShell>
  )
}
