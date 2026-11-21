import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthShell } from '@/components/auth/AuthShell'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

export const metadata: Metadata = { title: 'Set a new password · TechNova' }

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  )
}
