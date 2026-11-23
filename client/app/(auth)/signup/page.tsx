import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthShell } from '@/components/auth/AuthShell'
import { SignupForm } from '@/components/auth/SignupForm'

export const metadata: Metadata = { title: 'Create an account · TechNova' }

export default function SignupPage() {
  return (
    <AuthShell>
      <Suspense>
        <SignupForm />
      </Suspense>
    </AuthShell>
  )
}
