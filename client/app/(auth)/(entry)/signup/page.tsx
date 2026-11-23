import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SignupForm } from '@/components/auth/SignupForm'

export const metadata: Metadata = { title: 'Create an account · TechNova' }

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
