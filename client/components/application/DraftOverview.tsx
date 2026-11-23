"use client";

import Link from "next/link";
import { savedLabel, useNow, useStoredDraft } from "@/components/application/useApplicationDraft";
import { DeadlineBlock, EventCard, HelpBlock, MissionTracker } from "@/components/portal/overview";
import { PageHeading, Section } from "@/components/portal/PortalPage";
import { hackerForm } from "@/lib/application/forms/hacker";
import type { Answers, FormSection } from "@/lib/application/types";
import { isAnswered, isVisible, stepSections, validateSection } from "@/lib/application/validate";

// The Overview page before submitting (Figma "02 · Hacker dashboard"). The draft is in
// localStorage, so its progress is only known in the browser.

const SECTIONS = stepSections(hackerForm);
const TOTAL = SECTIONS.length + 1; // + Review

type Progress = { state: "complete" | "started" | "empty"; answered: number; of: number };

function progressOf(section: FormSection, answers: Answers): Progress {
  const questions = section.questions.filter((question) => isVisible(question, answers));
  const answered = questions.filter((question) => isAnswered(question, answers[question.id])).length;
  const complete = answered > 0 && Object.keys(validateSection(section, answers)).length === 0;
  return { state: complete ? "complete" : answered > 0 ? "started" : "empty", answered, of: questions.length };
}

const marker = {
  complete: "bg-tn-cyan/20 text-tn-cyan",
  started: "bg-tn-yellow text-tn-bg",
  empty: "border border-tn-muted/60",
};

export default function DraftOverview({ userId, closed }: { userId: string; closed: boolean }) {
  const draft = useStoredDraft(userId);
  const now = useNow();

  // Not known on the server or during hydration.
  if (draft === undefined) {
    return (
      <div aria-busy="true" className="flex max-w-[820px] animate-pulse flex-col gap-[30px]">
        <span className="sr-only">Loading your dashboard…</span>
        <div className="h-12 w-1/2 rounded bg-white/10" />
        <div className="h-6 w-72 max-w-full rounded bg-white/10" />
        <div className="h-40 rounded-xl bg-white/10" />
      </div>
    );
  }

  const answers = draft?.answers ?? {};
  const progress = SECTIONS.map((section) => progressOf(section, answers));
  const complete = progress.filter((item) => item.state === "complete").length;
  const started = Boolean(draft) && progress.some((item) => item.state !== "empty");

  const note = closed
    ? "The deadline to apply has passed, so new applications can no longer be submitted."
    : started && draft
      ? `Your draft is saved on this device (${savedLabel(draft.savedAt, now).toLowerCase()}). It has not been submitted.`
      : "You haven’t started yet. Your answers are saved on this device as you go.";

  return (
    <>
      <PageHeading title="Overview">
        {closed ? "Applications are closed." : "Finish your application before the deadline."}
      </PageHeading>

      <DeadlineBlock
        note={note}
        action={
          closed
            ? undefined
            : { href: "/applicant/application", label: started ? "Continue application" : "Start application" }
        }
      />

      <MissionTracker current={1} />

      {!closed && (
        <Section title={`My application · ${complete} of ${TOTAL} sections complete`}>
          <div aria-hidden className="h-1.5 overflow-hidden rounded-full bg-tn-line/70">
            <div className="h-full rounded-full bg-tn-cyan" style={{ width: `${(complete / TOTAL) * 100}%` }} />
          </div>
          <ol className="flex flex-col">
            {SECTIONS.map((section, index) => {
              const item = progress[index];
              return (
                <li key={section.id} className="border-b border-tn-line/60">
                  <Link
                    href={`/applicant/application?step=${section.id}`}
                    className="flex min-h-12 items-center gap-3.5 py-2.5 text-base transition hover:text-tn-cyan focus-visible:outline-2 focus-visible:outline-tn-cyan"
                  >
                    <span aria-hidden className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${marker[item.state]}`}>
                      {item.state === "complete" ? "✓" : ""}
                    </span>
                    <span className="min-w-0 flex-1 font-semibold">
                      {index + 1}. {section.shortTitle ?? section.title}
                    </span>
                    <span className={`shrink-0 text-sm ${item.state === "started" ? "text-tn-yellow" : "text-tn-muted"}`}>
                      {item.state === "complete"
                        ? "Complete"
                        : item.state === "started"
                          ? `In progress · ${item.answered} of ${item.of} answered`
                          : "Not started"}
                    </span>
                  </Link>
                </li>
              );
            })}
            <li className="flex min-h-12 items-center gap-3.5 py-2.5 text-base">
              <span aria-hidden className={`size-6 shrink-0 rounded-full ${marker.empty}`} />
              <span className="min-w-0 flex-1 font-semibold">{TOTAL}. Review</span>
              <span className="shrink-0 text-sm text-tn-muted">Unlocks when the rest is done</span>
            </li>
          </ol>
        </Section>
      )}

      <EventCard />
      <HelpBlock />
    </>
  );
}
