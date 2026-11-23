import type { Metadata } from 'next'
import { VerifyEmailPanel } from '@/components/auth/VerifyEmailPanel'

export const metadata: Metadata = { title: 'Check your email · TechNova' }

export default function VerifyEmailPage() {
  return <VerifyEmailPanel />
}
