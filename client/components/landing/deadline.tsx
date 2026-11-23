"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Chip, caps } from "@/components/landing/shared";
import { buttonPrimary, heading } from "@/components/portal/ui";
import {
  APPLICATIONS_CLOSE_AT,
  APPLICATIONS_CLOSE_DATE_LABEL,
  APPLICATIONS_CLOSE_DAY_LABEL,
  APPLICATIONS_CLOSE_TIME_LABEL,
  APPLICATIONS_CLOSE_YEAR_LABEL,
  EVENT_DATES_LABEL,
} from "@/lib/application/config";
import { EVENT_START_DATE } from "@/lib/site";

// Everything on the landing page that depends on the application deadline. It all runs on the
// visitor's clock, so the server (and the first paint) renders the "applications open" state with
// dashes for any ticking digits.

const CLOSE = APPLICATIONS_CLOSE_AT.getTime();
// The hackathon's first morning, Eastern time.
const EVENT_START = new Date(`${EVENT_START_DATE}T09:00:00-05:00`).getTime();
const DAY = 86_400_000;

/** The current time, refreshed every `ms`; null on the server and while hydrating. */
function useNow(ms: number): number | null {
  return useSyncExternalStore(
    (onChange) => {
      const id = window.setInterval(onChange, ms);
      return () => window.clearInterval(id);
    },
    () => Math.floor(Date.now() / ms) * ms,
    () => null,
  );
}

/** True until the deadline passes (and before the visitor's clock is known). */
function useApplicationsOpen(): boolean {
  const now = useNow(30_000);
  return now === null || now <= CLOSE;
}

/**
 * "Apply now": to the sign-up screen (signed-in visitors are sent on to their application from
 * there). After the deadline it becomes "Applicant portal" and goes to the login screen.
 */
export function ApplyLink({ className = "" }: { className?: string }) {
  const open = useApplicationsOpen();
  return (
    <Link href={open ? "/signup" : "/login"} className={`${buttonPrimary} whitespace-nowrap ${className}`}>
      {open ? "Apply now" : "Applicant portal"}
    </Link>
  );
}

/** The navigation's yellow "Apply by Dec 4" note; "Closes today" on the last day, gone after. */
export function DeadlineChip({ className = "" }: { className?: string }) {
  const now = useNow(30_000);
  if (now !== null && now > CLOSE) return null;
  const lastDay = now !== null && CLOSE - now < DAY;
  return (
    <span className={`text-[15px] leading-none font-semibold whitespace-nowrap text-tn-yellow ${className}`}>
      {lastDay ? "Closes today" : `Apply by ${APPLICATIONS_CLOSE_DAY_LABEL}`}
    </span>
  );
}

/**
 * The hero's yellow deadline card, the next thing a visitor has to act on. (The hackathon's own
 * dates are the subheader under the title.) Once applications close it turns muted and says so.
 */
export function DeadlineCard() {
  const now = useNow(30_000);
  const open = now === null || now <= CLOSE;
  const daysLeft = now === null ? null : Math.ceil((CLOSE - now) / DAY);

  return (
    <div
      className={`flex w-fit max-w-full flex-col gap-1 rounded-3xl px-6 pt-5 pb-[18px] ${
        open
          ? "bg-tn-yellow text-tn-bg shadow-[0_0_40px_rgb(253_244_184_/_0.35)]"
          : "border border-tn-line bg-[#120838]/70 text-tn-muted"
      }`}
    >
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className={`${caps} text-[13px]`}>{open ? "Applications close" : "Applications closed"}</span>
        {open && daysLeft !== null && (
          <span className={`${caps} rounded-full bg-tn-bg px-2.5 pt-1.5 pb-1 text-xs tracking-[0.1em] text-tn-yellow`}>
            {daysLeft <= 1 ? "Last day" : `${daysLeft} days left`}
          </span>
        )}
      </p>
      <p className={`${heading} text-[clamp(2.5rem,1.9rem+2.4vw,3.75rem)] leading-[1.05] whitespace-nowrap text-current!`}>
        {APPLICATIONS_CLOSE_DAY_LABEL}
      </p>
      <p className="text-[17px] leading-none font-semibold">
        {APPLICATIONS_CLOSE_YEAR_LABEL} · {APPLICATIONS_CLOSE_TIME_LABEL}
      </p>
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

/** The hero's live countdown: to the deadline, then to the start of the hackathon. */
export function Countdown() {
  const now = useNow(1000);
  const open = now === null || now <= CLOSE;
  const target = open ? CLOSE : EVENT_START;
  const seconds = now === null ? null : Math.max(0, Math.floor((target - now) / 1000));
  if (seconds === 0 && !open) return null;

  const digits = (n: number | null) => (n === null ? "––" : pad(n));
  const units = [
    { label: "Days", value: digits(seconds === null ? null : Math.floor(seconds / 86400)) },
    { label: "Hours", value: digits(seconds === null ? null : Math.floor((seconds % 86400) / 3600)) },
    { label: "Minutes", value: digits(seconds === null ? null : Math.floor((seconds % 3600) / 60)) },
    { label: "Seconds", value: digits(seconds === null ? null : seconds % 60) },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Screen readers get the date once; the ticking digits are hidden from them. */}
      <p className="sr-only">
        {open
          ? `Applications close on ${APPLICATIONS_CLOSE_DATE_LABEL} at ${APPLICATIONS_CLOSE_TIME_LABEL}.`
          : `The hackathon runs ${EVENT_DATES_LABEL}.`}
      </p>
      <p aria-hidden className={`${caps} text-[13px] text-tn-muted`}>
        {open ? "Applications close in" : "Hackathon starts in"}
      </p>
      <dl aria-hidden className="grid w-full max-w-[436px] grid-cols-4 gap-2 sm:gap-3">
        {units.map(({ label, value }) => (
          <div
            key={label}
            className="flex min-w-0 flex-col items-center gap-1 rounded-[20px] border border-tn-line bg-[#120838] pt-4 pb-3 backdrop-blur-[16px]"
          >
            <dd className={`${heading} text-[clamp(2rem,1.4rem+2.4vw,2.75rem)] leading-[1.05] tabular-nums`}>{value}</dd>
            <dt className={`${caps} text-[10px] tracking-[0.08em] text-tn-muted sm:text-[13px] sm:tracking-[0.12em]`}>{label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** The closing section's two date chips; the deadline one goes once it has passed. */
export function DateChips() {
  const open = useApplicationsOpen();
  return (
    <p className="flex flex-wrap justify-center gap-3">
      {open && (
        <Chip>
          Apply by {APPLICATIONS_CLOSE_DATE_LABEL} · {APPLICATIONS_CLOSE_TIME_LABEL}
        </Chip>
      )}
      <Chip>Hack January 22–24, 2027</Chip>
    </p>
  );
}
