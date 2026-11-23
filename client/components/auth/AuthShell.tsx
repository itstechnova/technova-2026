'use client'
// A client component on purpose: components/portal/ui.tsx builds its image URLs with `layerUrl`,
// which lives in a "use client" module and so can't be called during a server-only render.

import Link from 'next/link'
import type { ReactNode } from 'react'
import { BrandLockup, Planet, SpaceBackdrop, TwinkleStar, heading } from '@/components/portal/ui'
import { EVENT_DATES_LABEL } from '@/lib/application/config'

/** Text link used under the auth forms (44px tall tap target). */
export const authLink =
  'inline-flex min-h-11 items-center rounded-sm text-lg leading-[1.45] text-tn-cyan underline decoration-from-font underline-offset-4 hover:text-tn-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

/**
 * The two-column layout shared by the login, signup, verify-email and password screens
 * (Figma "02 · Login & participant", frames 01–04). Positions inside the art are shares of its
 * 640 x 700 Figma box, and its type is sized in container units, so the whole piece scales.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-dvh w-full flex-col text-tn-ink">
      <SpaceBackdrop />

      <header className="flex items-center justify-between gap-4 px-5 py-3 sm:px-10 md:py-[clamp(0.75rem,2.5vh,1.75rem)] xl:px-16">
        <BrandLockup className="min-h-11 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" />
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-sm text-base leading-[1.35] font-semibold whitespace-nowrap text-tn-muted transition hover:text-tn-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-lg"
        >
          Back to website
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-12 px-5 pt-4 pb-12 sm:px-10 md:flex-row md:items-start md:justify-center md:gap-[clamp(2rem,4vw,3.75rem)] md:pt-[clamp(0.5rem,4vh,3rem)] md:pb-10 xl:px-20">
        {/* On phones the art follows the form, so the form comes first. Beside the form it is sized
            from the window's height as well as its width, so the pair fits a laptop screen. */}
        <div className="@container order-last mx-auto w-full max-w-[340px] min-w-0 md:order-none md:mx-0 md:max-w-[min(640px,calc((100dvh_-_9rem)*0.914))] md:flex-[0_1_640px]">
          <AuthArt />
        </div>

        <div className="mx-auto w-full max-w-[520px] min-w-0 md:mx-0 md:flex-[0_0_min(460px,50%)] md:py-[clamp(0rem,3vh,2.5rem)]">
          <div className="flex flex-col items-start gap-[clamp(0.875rem,2.4vh,1.5rem)]">{children}</div>
        </div>
      </main>
    </div>
  )
}

/** Figma node 24:686 — "Account / floating planets and community". */
function AuthArt() {
  return (
    <div className="relative aspect-[640/700] w-full overflow-hidden">
      <div aria-hidden className="absolute top-[17.8%] left-[1.1%] w-[87.5%] rotate-[10deg]">
        <Planet kind="pink" className="w-full" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/community-photo.webp"
        alt=""
        width={512}
        height={342}
        decoding="async"
        className="absolute top-[48.6%] left-[9.6%] aspect-[419/274] w-[65.5%] -rotate-[5deg] rounded-[15cqw] object-cover"
      />
      <TwinkleStar className="absolute top-[40%] left-[75%] w-[13.3%]" />
      <p className={`${heading} absolute top-0 left-0 text-[length:10cqw] leading-[1.24]`}>
        See you at
        <br />
        TechNova.
      </p>
      <p className="absolute top-[91.4%] left-[7.8%] text-[length:max(14px,3.125cqw)] leading-[1.45] text-tn-cyan">
        {EVENT_DATES_LABEL.toUpperCase()}
      </p>
    </div>
  )
}

/** Screen title + one-line intro at the top of the form column. */
export function AuthHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <>
      <h1 className={`${heading} text-[clamp(1.75rem,1.3rem+1.2vw,2.25rem)] leading-[1.25]`}>{title}</h1>
      {children && (
        <p className="w-full max-w-[440px] text-base leading-[1.35] text-tn-muted sm:text-lg 2xl:text-xl">{children}</p>
      )}
    </>
  )
}

/** Error / confirmation banner for the dark theme. Errors are announced immediately. */
export function AuthBanner({ tone, children }: { tone: 'error' | 'message'; children: ReactNode }) {
  const colours =
    tone === 'error'
      ? 'border-tn-error/60 bg-tn-error/10 text-tn-error'
      : 'border-tn-cyan/50 bg-tn-cyan/10 text-tn-cyan'
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`w-full max-w-[440px] rounded-[10px] border px-[18px] py-3 text-base leading-[1.35] ${colours}`}
    >
      {children}
    </div>
  )
}
