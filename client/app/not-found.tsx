import type { Metadata } from 'next'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { SiteFooter, contentWidth } from '@/components/SiteFooter'
import {
  BrandLockup,
  EyebrowPill,
  Planet,
  TwinkleStar,
  buttonPrimary,
  buttonSecondary,
  heading,
} from '@/components/portal/ui'

export const metadata: Metadata = { title: 'Page not found' }

// The 404 page (Figma "09 · 404 · page not found"): a giant "4 0 4" whose zero is the ringed planet,
// the message and two ways out beneath it, over the same backdrop and footer as the login screens.

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'

// The hero is 913 x 400 in the 1440px frame; everything inside is a share of that box, and the
// digits are sized in container units, so the whole piece scales with the screen.
const HERO = { width: 913, height: 400 }
const box = (x: number, y: number, w: number): CSSProperties => ({
  left: `${(x / HERO.width) * 100}%`,
  top: `${(y / HERO.height) * 100}%`,
  width: `${(w / HERO.width) * 100}%`,
})

// The ring artwork is a 1440 x 960 sheet with the ring centred on (470, 800). Here it is drawn at
// 48.54% and moved so that point is the middle of the hero, where the planet sits.
const RING_SCALE = 300 / 618
const ringStyle = {
  ...box(HERO.width / 2 - 470 * RING_SCALE, HERO.height / 2 - 800 * RING_SCALE, 1440 * RING_SCALE),
  transformOrigin: `${(470 / 1440) * 100}% ${(800 / 960) * 100}%`,
  '--dur': '22s',
  '--float-y': '0',
  '--float-rotate': '12deg',
} as CSSProperties

const digit = `${heading} absolute top-0 text-[length:43.8cqw] leading-none`

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-dvh w-full flex-col overflow-clip bg-tn-bg text-tn-ink">
      {/* eslint-disable @next/next/no-img-element */}
      <img
        aria-hidden
        src="/images/bg.webp"
        alt=""
        className="pointer-events-none absolute inset-0 -z-10 size-full object-cover select-none"
      />

      {/* Decorative: stars, and the satellite drifting off in the corner. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 select-none">
        <TwinkleStar className="absolute top-[150px] left-[16%] w-[clamp(36px,4.4vw,64px)]" dur={4.2} />
        <TwinkleStar className="absolute top-[520px] left-[4%] w-[clamp(24px,2.9vw,42px)]" dur={5.1} />
        <TwinkleStar className="absolute top-[560px] right-[14%] w-[clamp(22px,2.4vw,35px)]" dur={3.6} />
        <TwinkleStar className="absolute top-[780px] right-[2%] w-[clamp(28px,3.3vw,48px)]" dur={4.7} />
        <TwinkleStar className="absolute top-[96px] right-[6.5%] w-[clamp(22px,2.4vw,35px)]" dur={5.6} />
        <img
          src="/images/satellite.svg"
          alt=""
          className="anim-float absolute top-[150px] right-[9%] hidden h-auto w-[clamp(120px,13.9vw,200px)] rotate-[18deg] md:block"
          style={{ '--dur': '15s', '--float-y': '-40%', '--float-x': '-18%', '--float-rotate': '-6deg' } as CSSProperties}
        />
      </div>

      <header className={`${contentWidth} flex items-center py-3 lg:pt-[clamp(0.75rem,3.2vh,1.9375rem)]`}>
        <BrandLockup className={`min-h-11 rounded-sm ${focusRing}`} />
      </header>

      <main className={`${contentWidth} flex flex-1 flex-col items-center justify-center gap-8 pt-10 pb-4 text-center lg:gap-10`}>
        {/* "4 0 4", with the planet as the zero. The message below says it in words. */}
        <div aria-hidden className="@container pointer-events-none w-full max-w-[913px] select-none">
          <div className="relative aspect-[913/400] w-full">
            <img src="/images/orbit-ring-back.svg" alt="" className="anim-float absolute max-w-none" style={ringStyle} />
            <span className={`${digit} left-0`}>4</span>
            <span className={`${digit} right-0`}>4</span>
            {/* The planet's art is 1000px for a 618px globe (the rest is its halo). */}
            <div className="absolute" style={box(HERO.width / 2 - 500 * RING_SCALE, HERO.height / 2 - 500 * RING_SCALE, 1000 * RING_SCALE)}>
              <Planet kind="pink" className="w-full" />
            </div>
            <img src="/images/orbit-ring-front.svg" alt="" className="anim-float absolute max-w-none" style={ringStyle} />
            {/* The moon's file is 174px for an 84px moon (the rest is its glow); drawn at 60%. */}
            <img
              src="/images/cratered-moon.svg"
              alt=""
              className="anim-float absolute h-auto max-w-none -translate-1/2"
              style={{ ...box(363.5, 274, 174 * 0.6), '--dur': '11s', '--float-y': '-14%', '--float-x': '10%' } as CSSProperties}
            />
          </div>
        </div>
        {/* eslint-enable @next/next/no-img-element */}

        <div className="flex flex-col items-center gap-6">
          <EyebrowPill>Page not found</EyebrowPill>
          <div className="flex flex-col items-center gap-4">
            <h1 className={`${heading} title-shade w-fit pb-[0.08em] text-[clamp(2.5rem,4.5vw,4rem)] leading-none`}>Lost in space.</h1>
            <p className="max-w-[560px] text-lg leading-[1.4] text-tn-muted sm:text-[22px]">
              This page drifted out of orbit, or was never here. Let’s get you back to TechNova.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link href="/" className={buttonPrimary}>
              Back to website
            </Link>
            <Link href="/login" className={buttonSecondary}>
              Log in
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
