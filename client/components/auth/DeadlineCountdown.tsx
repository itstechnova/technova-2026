'use client'

import { useEffect, useState } from 'react'
import {
  APPLICATIONS_CLOSE_AT,
  APPLICATIONS_CLOSE_DATE_LABEL,
  APPLICATIONS_CLOSE_DAY_LABEL,
  APPLICATIONS_CLOSE_TIME_LABEL,
  APPLICATIONS_CLOSE_YEAR_LABEL,
} from '@/lib/application/config'

const pad = (n: number) => String(n).padStart(2, '0')

const caps = 'font-semibold uppercase leading-none tracking-[0.12em]'

/**
 * The yellow "Applications close" card (Figma frame 142:655) with a mission-clock countdown to the
 * deadline ("T– 11 : 23 : 04 : 12") in place of the design's days-left badge.
 * The clock runs on the visitor's clock, so the server (and the first paint) shows dashes for the
 * digits. Once the deadline passes the card says so and the clock goes.
 */
export function DeadlineCountdown({ className = '' }: { className?: string }) {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setRemaining(APPLICATIONS_CLOSE_AT.getTime() - Date.now())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const closed = remaining !== null && remaining <= 0
  const seconds = remaining === null ? null : Math.floor(remaining / 1000)
  const days = seconds === null ? null : Math.floor(seconds / 86400)
  const digits = (n: number | null) => (n === null ? '--' : pad(n))
  const units = [
    { label: 'Days', value: digits(days) },
    { label: 'Hrs', value: digits(seconds && Math.floor((seconds % 86400) / 3600)) },
    { label: 'Min', value: digits(seconds && Math.floor((seconds % 3600) / 60)) },
    { label: 'Sec', value: digits(seconds && seconds % 60) },
  ]
  // Read out once, in days: the ticking digits are hidden from screen readers.
  const spoken = closed
    ? `Applications closed on ${APPLICATIONS_CLOSE_DATE_LABEL}.`
    : days === null || days > 0
      ? `Applications close ${days === null ? '' : `in ${days} ${days === 1 ? 'day' : 'days'}, `}on ${APPLICATIONS_CLOSE_DATE_LABEL} at ${APPLICATIONS_CLOSE_TIME_LABEL}.`
      : `Applications close today at ${APPLICATIONS_CLOSE_TIME_LABEL}.`

  return (
    <div className={className}>
      <div className="inline-flex max-w-full flex-col items-start gap-1 rounded-xl bg-tn-yellow pt-5 pr-7 pb-[18px] pl-6 text-tn-bg shadow-[0_0_40px_rgb(252_245_184_/_0.4)]">
        <p className="sr-only">{spoken}</p>
        <div aria-hidden className="contents">
          <p className={`${caps} text-[13px]`}>{closed ? 'Applications closed' : 'Applications close'}</p>
          <p className="font-[family-name:var(--font-righteous)] text-[clamp(2.5rem,3.9vw,3.5rem)] leading-[1.25]">
            {APPLICATIONS_CLOSE_DAY_LABEL}
          </p>
          <p className="text-[17px] leading-none font-semibold tracking-[0.04em]">
            {APPLICATIONS_CLOSE_YEAR_LABEL} · {APPLICATIONS_CLOSE_TIME_LABEL}
          </p>

          {!closed && (
            <div className="mt-4 flex items-start gap-[0.3em] self-stretch border-t border-tn-bg/20 pt-4 font-mono text-[clamp(1.5rem,2.4vw,2rem)] leading-none font-semibold tabular-nums">
              <span className="opacity-60">T–</span>
              {units.map(({ label, value }, i) => (
                <span key={label} className="flex items-start gap-[0.3em]">
                  {i > 0 && <span className="opacity-40">:</span>}
                  <span className="flex flex-col items-center gap-1.5">
                    {value}
                    <span className={`${caps} font-[family-name:var(--font-josefin)] text-[10px] opacity-70`}>{label}</span>
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
