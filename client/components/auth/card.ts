import { buttonPrimary, buttonSecondary, heading } from '@/components/portal/ui'
import { cn } from '@/lib/utils'

// The form column on the login and signup screens, in one place so the two match. It sits straight
// on the artwork (no card behind it).

export const authPanel = 'flex flex-col gap-5 lg:pt-2'

/** Title + intro at the top of the form, with a little more room before the first field. */
export const cardHeader = 'flex flex-col gap-2 pb-2'

export const cardTitle = `${heading} text-[clamp(2rem,1.8rem+0.8vw,2.25rem)] leading-[1.25]`

export const cardIntro = 'text-lg leading-[1.25] text-tn-muted sm:text-xl'

/** Inputs: 2px cyan ring on focus. */
export const cardInput =
  'w-full rounded-[10px] border border-tn-line bg-tn-bg px-[18px] py-4 text-lg leading-[1.35] text-tn-ink outline-none transition placeholder:text-tn-muted/70 focus:border-tn-cyan focus:ring-2 focus:ring-tn-cyan aria-[invalid=true]:border-tn-error disabled:opacity-70'

export const cardField = 'flex w-full flex-col gap-2'

// The shared pill buttons, full width.
export const cardButtonPrimary = cn(buttonPrimary, 'w-full gap-2.5')
export const cardButtonSecondary = cn(buttonSecondary, 'w-full gap-2.5')

export const cardLink =
  'inline-flex min-h-11 items-center rounded-sm text-tn-cyan hover:text-tn-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

/** The "New to TechNova? / Already have an account?" link under the divider. */
export const cardSwitchLink = `${cardLink} -my-2 self-start text-lg leading-[1.45] underline decoration-from-font underline-offset-4`

export const cardDivider = 'h-px w-full bg-tn-line'
