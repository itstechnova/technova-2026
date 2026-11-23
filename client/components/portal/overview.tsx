"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { DeadlineCountdown } from "@/components/auth/DeadlineCountdown";
import { Section, textLink } from "@/components/portal/PortalPage";
import { Planet, buttonPrimary, buttonSecondary, heading } from "@/components/portal/ui";
import { EVENT_DATES_SHORT_LABEL, EVENT_LOCATION_LABEL, SUPPORT_EMAIL } from "@/lib/application/config";
import { EVENT_START_DATE } from "@/lib/site";

// Blocks of the dashboard's Overview page (Figma "02 · Hacker dashboard"). Only the deadline and
// the event are cards; everything else sits on the page under a thin rule.

/** The yellow deadline card with its countdown, and the page's main action beside it. */
export function DeadlineBlock({ action, note }: { action?: { href: string; label: string }; note: string }) {
  return (
    <div className="flex max-w-[820px] flex-wrap items-center gap-x-8 gap-y-5">
      <DeadlineCountdown />
      <div className="flex min-w-[220px] flex-1 flex-col items-start gap-4">
        <p className="text-base leading-[1.45] text-tn-muted sm:text-lg">{note}</p>
        {action && (
          <Link href={action.href} className={buttonPrimary}>
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}

const MISSION = [
  { name: "Create account", note: "Done" },
  { name: "Apply", note: "By Dec 4" },
  { name: "Review", note: "After Dec 4" },
  { name: "Decision", note: "By email" },
  { name: "RSVP", note: "Confirm your place" },
  { name: "Hack", note: EVENT_DATES_SHORT_LABEL },
];

/** Where the hacker is on the way to the event. `current` is the index of the step in progress. */
export function MissionTracker({ current }: { current: number }) {
  return (
    <Section title="Your mission">
      <ol className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
        {MISSION.map((step, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li key={step.name} aria-current={active ? "step" : undefined} className="flex flex-col gap-1.5">
              <span
                className={`flex size-8 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums ${
                  done
                    ? "bg-tn-cyan/20 text-tn-cyan"
                    : active
                      ? "bg-tn-yellow text-tn-bg"
                      : "border border-dashed border-tn-muted/60 text-tn-muted"
                }`}
              >
                {done ? "✓" : index + 1}
              </span>
              <span className={`text-base leading-[1.3] font-semibold ${active || done ? "text-tn-ink" : "text-tn-muted"}`}>
                {step.name}
              </span>
              <span className="text-sm leading-[1.3] text-tn-muted">
                {done ? "Done" : active ? "In progress" : step.note}
              </span>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

// Days until the event starts, on the visitor's clock (so nothing on the server or first paint).
const subscribe = () => () => {};
const daysToGo = () => Math.ceil((new Date(`${EVENT_START_DATE}T00:00:00-05:00`).getTime() - Date.now()) / 86_400_000);

/** The event card: dates, a days-to-go tag and the planet. */
export function EventCard() {
  const days = useSyncExternalStore(subscribe, daysToGo, () => null);

  return (
    <div className="relative flex max-w-[820px] flex-col gap-2 overflow-clip rounded-xl border border-tn-cyan/60 bg-tn-surface p-6 pr-[38%] sm:p-7 sm:pr-[38%]">
      <p className="text-sm text-tn-muted">TechNova 6 · hackathon weekend</p>
      <p className={`${heading} text-[clamp(2rem,1.4rem+2vw,3rem)] leading-[1.1]`}>Jan 22–24</p>
      <p className="text-base text-tn-muted">2027 · Friday to Sunday · in person at {EVENT_LOCATION_LABEL}</p>
      {days !== null && days > 0 && (
        <p className="mt-1 w-fit rounded-full bg-tn-cyan px-3 pt-1.5 pb-1 text-[13px] leading-none font-semibold text-tn-bg">
          {days} {days === 1 ? "day" : "days"} to go
        </p>
      )}
      <Planet kind="pink" className="absolute! top-1/2 -right-[12%] w-[44%] -translate-y-1/2" />
    </div>
  );
}

/** "While you wait": where to get help. */
export function HelpBlock() {
  return (
    <Section title="Need help?">
      <p className="text-base leading-[1.45] text-tn-muted sm:text-lg">
        Answers to common questions are on{" "}
        <Link href="/applicant/help" className={textLink}>
          Help &amp; support
        </Link>
        , or email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className={textLink}>
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
    </Section>
  );
}

export { buttonSecondary };
