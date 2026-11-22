'use client'

import { useActionState } from 'react'
import { acceptApplicant } from '@/app/(authed)/admin/actions'

interface AcceptApplicantButtonProps {
  email: string
  className?: string
}

export function AcceptApplicantButton({ email, className }: AcceptApplicantButtonProps) {
  const [state, formAction, isPending] = useActionState(acceptApplicant, null)
  const sent = Boolean(state?.message)

  return (
    <form action={formAction} className="flex flex-col items-start gap-1">
      <input type="hidden" name="email" value={email} />
      <button
        type="submit"
        disabled={isPending || sent}
        className={
          className ??
          'rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50'
        }
      >
        {isPending ? 'Sending…' : sent ? 'Accepted' : 'Accept'}
      </button>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.message && <p className="text-sm text-green-600">{state.message}</p>}
    </form>
  )
}
