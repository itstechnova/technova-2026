"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { StarMark, action } from "@/components/landing/shared";
import {
  APPLICATIONS_CLOSE_AT,
  APPLICATIONS_CLOSE_DATE_LABEL,
  APPLICATIONS_CLOSE_TIME_LABEL,
} from "@/lib/application/config";

// Everything on the landing page that depends on the application deadline. It all runs on the
// visitor's clock, so the server (and the first paint) renders the "applications open" state with
// dashes for any ticking digits.

const CLOSE = APPLICATIONS_CLOSE_AT.getTime();
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
