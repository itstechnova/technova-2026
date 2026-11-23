import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { BrandLockup, Planet, TwinkleStar, heading } from '@/components/portal/ui'
import { SiteFooter, contentWidth } from '@/components/SiteFooter'
import { EVENT_DATES_SHORT_LABEL } from '@/lib/application/config'
import { DeadlineCountdown } from './DeadlineCountdown'

// The redesigned login and signup screens (Figma "06 · Login & dashboards · redesign v2", frame 142:655):
// welcome + deadline countdown on the left, the form card on the right, the planet scene behind both,
// and the site footer over the same backdrop.

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'

/** Rendered by app/(auth)/(entry)/layout.tsx around both pages; `children` is the page's form. */
export function LoginShell({ children }: { children: ReactNode }) {
  return (
    // The backdrop and scene scroll with the page and carry on under the (see-through) footer.
    <div className="relative isolate flex min-h-dvh w-full flex-col overflow-clip bg-tn-bg text-tn-ink">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        aria-hidden
        src="/images/bg.webp"
        alt=""
        className="pointer-events-none absolute inset-0 -z-10 size-full object-cover select-none"
      />
      <DesktopScene />
      {/* Decorative, phones and tablets only: the planet, cropped behind the title. */}
      <div className="absolute top-16 left-[calc(50%-125px)] -z-10 w-[min(150vw,640px)] lg:hidden">
        <Planet kind="pink" className="w-full" />
      </div>

      {/* From lg up this part is at least as tall as the artwork (the planet ends about 78% of the
          width down), so scrolling shows all of it before the footer. */}
      <div className="flex flex-1 flex-col lg:min-h-[82vw]">
        <header className={`${contentWidth} flex items-center justify-between gap-4 py-3 lg:pt-[clamp(0.75rem,3.2vh,1.9375rem)]`}>
          <BrandLockup className={`min-h-11 rounded-sm ${focusRing}`} />
          <Link
            href="/"
            className={`inline-flex min-h-11 items-center rounded-sm text-base leading-[1.35] font-semibold whitespace-nowrap text-tn-muted transition hover:text-tn-ink sm:text-lg ${focusRing}`}
          >
            Back to website
          </Link>
        </header>

        {/* Phones and tablets: title, then the form, then the countdown. From lg up the title and
            countdown share the left column and the form sits on the right. */}
        <main className={`${contentWidth} flex flex-col gap-8 pt-4 pb-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-[clamp(2rem,6vw,5rem)] lg:gap-y-7 lg:pt-[clamp(1rem,6.5vh,3.9375rem)]`}>
          <div className={`${column} flex flex-col items-start gap-6 lg:gap-7`}>
            <p className={`${heading} title-shade w-fit pb-[0.08em] text-[clamp(3rem,6.1vw,5rem)] leading-none`}>
              See you at
              <br />
              TechNova.
            </p>

            <p className="-mt-2 text-[clamp(1.375rem,2.1vw,1.875rem)] leading-none font-semibold tracking-[0.04em] text-tn-cyan lg:-mt-3">
              {EVENT_DATES_SHORT_LABEL}
            </p>
          </div>

          <div className={`${column} lg:col-start-2 lg:row-span-2 lg:row-start-1`}>{children}</div>

          <DeadlineCountdown className={`${column} lg:mt-5`} />
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}

/** One column on phones and tablets (the form card's width); a grid cell from lg up. */
const column = 'mx-auto w-full max-w-[440px] lg:mx-0 lg:max-w-none'

/** A box in the 1440 x 960 Figma frame, as shares of the scene. */
const at = (x: number, y: number, w: number): CSSProperties => ({
  left: `${(x / 1440) * 100}%`,
  top: `${(y / 960) * 100}%`,
  width: `${(w / 1440) * 100}%`,
})

const float = (dur: number, delay: number, y: string, x = '0', rotate = '0deg') =>
  ({ '--dur': `${dur}s`, '--delay': `${delay}s`, '--float-y': y, '--float-x': x, '--float-rotate': rotate }) as CSSProperties

// The planet's box in the 1440 x 960 Figma frame.
const PLANET = { x: 103.64, y: 313.24, size: 1000 }

// The ring is an ellipse. The artwork draws it centred on (470, 800); here it is moved so that
// its centre is the planet's, and its long axis runs through the middle of the planet.
const RING = {
  drawnCx: 470,
  drawnCy: 800,
  cx: PLANET.x + PLANET.size / 2,
  cy: PLANET.y + PLANET.size / 2,
}
// Both halves of the ring get this: moved onto the planet, and rocking about its centre.
const ringStyle = {
  translate: `${((RING.cx - RING.drawnCx) / 1440) * 100}% ${((RING.cy - RING.drawnCy) / 960) * 100}%`,
  transformOrigin: `${(RING.drawnCx / 1440) * 100}% ${(RING.drawnCy / 960) * 100}%`,
  '--dur': '22s',
  '--float-y': '0',
  '--float-rotate': '12deg',
} as CSSProperties
// The moon circles the planet on a path of its own (the satellite drifts free: see DesktopScene).
// `width` is the image's width and `orbit` the ellipse it follows (its box and tilt), in frame px;
// `seconds` is one lap; `start` is how far round it begins (0 = the right-hand end, then across the
// front of the planet). With reduced motion it stays at its starting point.
const ORBITERS = [
  // The file is 174px for an 84px moon: the rest is its glow.
  { src: '/images/cratered-moon.svg', width: 174, orbit: { width: 820, height: 220, tilt: 10 }, seconds: 46, start: 0.2 },
]

/** One pass of the moon: the `front` copy shows on the near half of its orbit. */
function Orbiters({ side }: { side: 'front' | 'back' }) {
  return ORBITERS.map(({ src, width, orbit, seconds, start }) => {
    const timing = { '--dur': `${seconds}s`, '--delay': `${-start * seconds}s` } as CSSProperties
    const angle = start * 2 * Math.PI
    const onNearHalf = start % 1 < 0.5
    return (
      <div
        key={src}
        className="absolute"
        style={{
          left: `${((RING.cx - orbit.width / 2) / 1440) * 100}%`,
          top: `${((RING.cy - orbit.height / 2) / 960) * 100}%`,
          width: `${(orbit.width / 1440) * 100}%`,
          aspectRatio: `${orbit.width} / ${orbit.height}`,
          rotate: `${orbit.tilt}deg`,
        }}
      >
        {/* The transforms and opacity set here are the starting point; the animations take over. */}
        <div
          className="anim-orbit-x absolute inset-0"
          style={{ ...timing, transform: `translateX(${(Math.cos(angle) * 50).toFixed(2)}%)` }}
        >
          <div
            className="anim-orbit-y absolute inset-0"
            style={{ ...timing, transform: `translateY(${(Math.sin(angle) * 50).toFixed(2)}%)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className={`anim-orbit-${side} absolute top-1/2 left-1/2 h-auto max-w-none -translate-1/2`}
              style={{
                ...timing,
                width: `${(width / orbit.width) * 100}%`,
                rotate: `${-orbit.tilt}deg`,
                opacity: onNearHalf === (side === 'front') ? 1 : 0,
              }}
            />
          </div>
        </div>
      </div>
    )
  })
}

/**
 * The planet scene behind the desktop layout. Decorative: the planet drifts, its ring rocks, and
 * the moon circles it and the satellite drifts across the page. For visitors who prefer reduced motion everything holds still
 * (`.anim-float`, `.anim-orbit-*`, `.anim-spin`, `.anim-twinkle` in globals.css).
 * Everything is placed as a share of the 1440 x 960 frame, so the scene scales with the window.
 */
function DesktopScene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden select-none lg:block">
      <div className="absolute top-0 left-0 aspect-[1440/960] w-full">
        {/* eslint-disable @next/next/no-img-element */}
        <div className="anim-float absolute inset-0" style={float(16, 0, '-3.5%', '1.5%', '1.5deg')}>
          <img src="/images/orbit-ring-back.svg" alt="" className="anim-float absolute inset-0 size-full" style={ringStyle} />
          <Orbiters side="back" />
          <div className="absolute" style={at(PLANET.x, PLANET.y, PLANET.size)}>
            <Planet kind="pink" className="w-full" />
          </div>
          <img src="/images/orbit-ring-front.svg" alt="" className="anim-float absolute inset-0 size-full" style={ringStyle} />
          <Orbiters side="front" />
        </div>

        {/* Free-floating: wanders across the lower part of the page (`satellite-drift` in globals.css)
            from where the design has it, which is also where it rests with reduced motion. */}
        <img src="/images/satellite.svg" alt="" className="anim-satellite-drift absolute h-auto" style={at(60, 820, 200)} />
        {/* eslint-enable @next/next/no-img-element */}

        <TwinkleStar className="absolute" dur={4.2} style={at(720, 150, 64)} />
        <TwinkleStar className="absolute" dur={5.1} style={at(40, 500, 41.6)} />
        <TwinkleStar className="absolute" dur={3.6} style={at(770, 470, 35.2)} />
        <TwinkleStar className="absolute" dur={4.7} style={at(1380, 880, 48)} />
        <TwinkleStar className="absolute" dur={5.6} style={at(1300, 110, 35.2)} />
      </div>
    </div>
  )
}
