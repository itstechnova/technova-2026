"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { StarMark, action } from "@/components/landing/shared";
import { heading } from "@/components/portal/ui";
import {
  APPLICATIONS_CLOSE_AT,
  APPLICATIONS_CLOSE_DATE_LABEL,
  APPLICATIONS_CLOSE_TIME_LABEL,
  EVENT_DATES_LABEL,
} from "@/lib/application/config";
import { EVENT_START_DATE } from "@/lib/site";

// Everything on the landing page that depends on the application deadline. It all runs on the
// visitor's clock, so the server (and the first paint) renders the "applications open" state with
// dashes for any ticking digits.

const CLOSE = APPLICATIONS_CLOSE_AT.getTime();
// The hackathon's first morning, Eastern time.
const EVENT_START = new Date(`${EVENT_START_DATE}T09:00:00-05:00`).getTime();

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
    <Link href={open ? "/signup" : "/login"} className={`${action} ${className}`}>
      {open ? "Apply now" : "Applicant portal"}
    </Link>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The hero's live countdown: to the application deadline, with the deadline itself written under
 * it; once that passes, to the start of the hackathon.
 */
export function Countdown() {
  const now = useNow(1000);
  const open = now === null || now <= CLOSE;
  const target = open ? CLOSE : EVENT_START;
  const seconds = now === null ? null : Math.max(0, Math.floor((target - now) / 1000));
  if (seconds === 0 && !open) return null;

  const digits = (n: number | null) => (n === null ? "––" : pad(n));
  const units = [
    { label: "days", value: digits(seconds === null ? null : Math.floor(seconds / 86400)) },
    { label: "hrs", value: digits(seconds === null ? null : Math.floor((seconds % 86400) / 3600)) },
    { label: "min", value: digits(seconds === null ? null : Math.floor((seconds % 3600) / 60)) },
    { label: "sec", value: digits(seconds === null ? null : seconds % 60) },
  ];
  const when = open
    ? `${APPLICATIONS_CLOSE_DATE_LABEL} · ${APPLICATIONS_CLOSE_TIME_LABEL}`
    : EVENT_DATES_LABEL;

  return (
    <div className="flex flex-col gap-2.5">
      {/* Screen readers get the date once; the ticking digits are hidden from them. */}
      <p className="sr-only">
        {open
          ? `Applications close on ${APPLICATIONS_CLOSE_DATE_LABEL} at ${APPLICATIONS_CLOSE_TIME_LABEL}.`
          : `The hackathon runs ${EVENT_DATES_LABEL}.`}
      </p>
      <p aria-hidden className="text-[15px] leading-none text-tn-muted">
        {open ? "Applications close in" : "The hackathon starts in"}
      </p>
      <dl aria-hidden className="flex gap-2 sm:gap-2.5">
        {units.map(({ label, value }) => (
          <div
            key={label}
            className="flex w-[4.5rem] flex-col items-center gap-1.5 rounded-xl border border-tn-line/80 bg-[#120838]/80 pt-3.5 pb-2.5 sm:w-[5.25rem]"
          >
            <dd className={`${heading} text-[clamp(1.875rem,1.4rem+1.8vw,2.5rem)] leading-none tabular-nums`}>{value}</dd>
            <dt className="text-xs leading-none text-tn-muted">{label}</dt>
          </div>
        ))}
      </dl>
      <p aria-hidden className="text-[17px] leading-[1.3] font-semibold text-tn-yellow">{when}</p>
    </div>
  );
}

/** The closing section's two dates in the open, a star between them; the deadline goes once it has passed. */
export function KeyDatesLine() {
  const open = useApplicationsOpen();
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-base leading-[1.4] font-semibold text-tn-ink sm:text-lg">
      {open && (
        <>
          <span>
            Apply by {APPLICATIONS_CLOSE_DATE_LABEL} · {APPLICATIONS_CLOSE_TIME_LABEL}
          </span>
          <StarMark />
        </>
      )}
      <span>Hack January 22–24, 2027</span>
    </p>
  );
}
