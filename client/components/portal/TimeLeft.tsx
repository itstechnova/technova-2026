"use client";

import { useEffect, useState } from "react";
import { APPLICATIONS_CLOSE_AT } from "@/lib/application/config";

// A one-line countdown to the application deadline for the hacker dashboard ("11 days 4 hr left").
// The Overview page has the full clock (components/auth/DeadlineCountdown.tsx).

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "11 days 4 hr", "4 hr 12 min", "12 min", "less than a minute". */
export function timeLeftLabel(ms: number): string {
  const days = Math.floor(ms / DAY);
  const hours = Math.floor((ms % DAY) / HOUR);
  const minutes = Math.floor((ms % HOUR) / MINUTE);
  if (days > 0) return `${days} ${days === 1 ? "day" : "days"} ${hours} hr`;
  if (hours > 0) return `${hours} hr ${minutes} min`;
  return minutes > 0 ? `${minutes} min` : "less than a minute";
}

/**
 * Time left until applications close, e.g. "11 days 4 hr left". It runs on the visitor's clock, so
 * nothing is rendered on the server or the first paint, and nothing once the deadline has passed.
 */
export function TimeLeft({ prefix, className }: { prefix?: string; className?: string }) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(APPLICATIONS_CLOSE_AT.getTime() - Date.now());
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  if (remaining === null || remaining <= 0) return null;
  const label = timeLeftLabel(remaining);
  return <p className={className}>{prefix ? `${prefix} ${label}` : `${label} left`}</p>;
}
