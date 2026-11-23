import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AuthHeader, AuthShell } from '@/components/auth/AuthShell'
import { buttonPrimary } from '@/components/portal/ui'
import { SubmitButton } from '@/components/submit-button'
import { confirmEmailLink } from './actions'

export const metadata: Metadata = {
  title: 'Confirm your email · TechNova',
  robots: { index: false, follow: false },
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? ''

/**
 * Where the links in auth emails land (`?token_hash=...&type=signup|recovery`).
 *
 * Opening the page does nothing on its own: the token is only spent when the visitor presses the
 * button. Mail security scanners (school and work inboxes especially) open every link in a message
 * before its reader does, and a link that verified on load was used up by the scanner, leaving the
 * reader with "link expired".
 */
export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const token_hash = first(params.token_hash)
  const type = first(params.type)
  const next = first(params.next)

  if (!token_hash || !type) redirect('/login?error=confirm-link')

  const recovery = type === 'recovery'

  return (
    <AuthShell>
      <AuthHeader title={recovery ? 'Reset your password' : 'Confirm your email'}>
        {recovery
          ? 'One more step: continue to choose a new password.'
          : 'One more step: confirm your email to finish creating your TechNova account.'}
      </AuthHeader>

      <form action={confirmEmailLink} className="flex w-full flex-col items-start gap-6">
        <input type="hidden" name="token_hash" value={token_hash} />
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="next" value={next} />
        <SubmitButton
          label={recovery ? 'Continue' : 'Confirm my email'}
          pendingLabel={recovery ? 'Continuing…' : 'Confirming…'}
          className={`${buttonPrimary} w-full max-w-[440px] sm:w-auto`}
        />
      </form>
    </AuthShell>
  )
}
