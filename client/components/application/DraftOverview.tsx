"use client";

import Link from "next/link";
import { savedLabel, useNow, useStoredDraft } from "@/components/application/useApplicationDraft";
import { InfoCard, PageHeading, textLink } from "@/components/portal/PortalPage";
import { buttonPrimary } from "@/components/portal/ui";
import {
  APPLICATIONS_CLOSE_DATE_LABEL,
  APPLICATIONS_CLOSE_TIME_LABEL,
  SUPPORT_EMAIL,
} from "@/lib/application/config";
import { hackerForm } from "@/lib/application/forms/hacker";
import { stepSections } from "@/lib/application/validate";

// The Overview page before submitting (Figma frame 12). The draft is in localStorage, so which
// version to show (continue / start) is only known in the browser.

const STEP_IDS = [...stepSections(hackerForm).map((section) => section.id), "review"];

type Copy = { title: string; subtitle: string; status: string; detail: string; button?: string; next: string };

const CLOSED: Copy = {
  title: "Applications are closed",
  subtitle: "The deadline to apply has passed.",
  status: "Not submitted",
  detail: "New applications can no longer be submitted.",
  next: "Follow TechNova for future events.",
};

const NOT_STARTED: Copy = {
  title: "Start your application",
  subtitle: "You haven’t started yet. Your answers are saved on this device as you go.",
  status: "Not started",
  detail: `Applications close ${APPLICATIONS_CLOSE_DATE_LABEL} at ${APPLICATIONS_CLOSE_TIME_LABEL}.`,
  button: "Start application",
  next: "Answer each section, then review and submit.",
};

export default function DraftOverview({ userId, closed }: { userId: string; closed: boolean }) {
  const draft = useStoredDraft(userId);
  const now = useNow();

  // Not known on the server or during hydration.
  if (draft === undefined) {
    return (
      <div aria-busy="true" className="flex max-w-[820px] animate-pulse flex-col gap-[30px]">
        <span className="sr-only">Loading your application status…</span>
        <div className="h-4 w-40 rounded bg-white/10" />
        <div className="h-12 w-3/4 rounded bg-white/10" />
        <div className="h-6 w-72 max-w-full rounded bg-white/10" />
      </div>
    );
  }

  const step = Math.max(STEP_IDS.indexOf(draft?.step ?? ""), 0) + 1;
  const copy: Copy = closed
    ? CLOSED
    : draft
      ? {
          title: "Continue your application",
          subtitle: "Your draft is saved. It has not been submitted.",
          status: `Draft · step ${step} of ${STEP_IDS.length}`,
          detail: `${savedLabel(draft.savedAt, now)}. Review and submit when you’re ready.`,
          button: "Continue application",
          next: "Complete the remaining steps, then review and submit.",
        }
      : NOT_STARTED;

  return (
    <>
      <PageHeading eyebrow="Your dashboard" title={copy.title}>
        {copy.subtitle}
      </PageHeading>
      <InfoCard eyebrow="Application status" title={copy.status}>
        {copy.detail}
      </InfoCard>
      {copy.button && (
        <div>
          <Link href="/applicant/application" className={buttonPrimary}>
            {copy.button}
          </Link>
        </div>
      )}
      <div className="grid gap-x-6 sm:grid-cols-2">
        <InfoCard eyebrow="Up next" title={closed ? "Stay in touch" : "Finish your application"}>
          {copy.next}
        </InfoCard>
        <InfoCard eyebrow="Need help?" title="Need help?">
          <a href={`mailto:${SUPPORT_EMAIL}`} className={textLink}>
            {SUPPORT_EMAIL}
          </a>
        </InfoCard>
      </div>
    </>
  );
}
