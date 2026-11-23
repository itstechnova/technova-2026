"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { QuestionList, focusQuestion } from "@/components/application/QuestionList";
import { ReviewStep } from "@/components/application/ReviewStep";
import { StepTabs, type Step } from "@/components/application/StepTabs";
import {
  savedLabel,
  useApplicationDraft,
  newerDraft,
  useNow,
  useStoredDraft,
  type Draft,
} from "@/components/application/useApplicationDraft";
import { PageHeading, PortalPage, textLink } from "@/components/portal/PortalPage";
import { TimeLeft } from "@/components/portal/TimeLeft";
import { buttonPrimary, buttonSecondary, heading } from "@/components/portal/ui";
import { SUPPORT_EMAIL } from "@/lib/application/config";
import { hackerForm } from "@/lib/application/forms/hacker";
import { saveHackerDraft } from "@/lib/application/draft";
import { submitHackerApplication } from "@/lib/application/submit";
import { encodeAnswers } from "@/lib/application/wire";
import type { AnswerValue, Answers } from "@/lib/application/types";
import {
  isAnswered,
  reviewSections,
  stepSections,
  validateForm,
  validateSection,
  visibleAnswers,
} from "@/lib/application/validate";

// "My application" in the hacker dashboard (Figma "07 · Hacker application · redesign v2"): a
// stepper with one step per form section, then Review. The current step is in the URL
// (`?step=<section id | review>`); answers are a localStorage draft until submitted.

// The welcome step's extras, under its introduction (Figma "01 · My application / Welcome").
const KEY_DATES = [
  { label: "Hackathon", value: "Jan 22-24", note: "2027 · in person, Waterloo" },
  { label: "Applications opened", value: "Nov 16", note: "2026" },
];
const OPPORTUNITIES = [
  "Bring your ideas to life and build a project.",
  "Receive mentorship and learn from others.",
  "Connect with fellow students and industry professionals.",
  "Showcase and demo your submission.",
  "Build meaningful connections within the Women+ in Tech community.",
];

const DASHBOARD = "/applicant/dashboard";
// Where a successful submit lands: the confirmation, on the application page.
const SUBMITTED = "/applicant/application?submitted=1";
const REVIEW = "review";
const SUBMIT_FAILED = "Something went wrong while submitting your application. Please try again.";

const SECTIONS = stepSections(hackerForm);
const AGREEMENTS = reviewSections(hackerForm);
const STEPS: Step[] = [
  ...SECTIONS.map((section) => ({ id: section.id, label: section.shortTitle ?? section.title })),
  { id: REVIEW, label: "Review" },
];
const REVIEW_INDEX = SECTIONS.length;
const QUESTIONS = hackerForm.flatMap((section) => section.questions);

/** Which sections have every required answer, in order. */
function completedSteps(answers: Answers): boolean[] {
  return SECTIONS.map((section) => Object.keys(validateSection(section, answers)).length === 0);
}

/** The step holding the first question (in form order) that has an error, and that question. */
function firstError(errors: Record<string, string>): { step: number; question: string } | null {
  const question = QUESTIONS.find((candidate) => errors[candidate.id]);
  if (!question) return null;
  const step = SECTIONS.findIndex((section) => section.questions.includes(question));
  return { step: step === -1 ? REVIEW_INDEX : step, question: question.id };
}

/** Account details fill in the matching questions the draft hasn't answered yet. */
function withPrefill(answers: Answers, prefill: Answers): Answers {
  const merged = { ...answers };
  for (const question of QUESTIONS) {
    const value = prefill[question.id];
    if (value !== undefined && !isAnswered(question, merged[question.id])) merged[question.id] = value;
  }
  return merged;
}

function FormSkeleton() {
  return (
    <PortalPage>
      <div aria-busy="true" className="flex max-w-[820px] animate-pulse flex-col gap-[30px]">
        <span className="sr-only">Loading your application…</span>
        <div className="h-4 w-40 rounded bg-white/10" />
        <div className="h-12 w-3/4 rounded bg-white/10" />
        <div className="h-6 w-56 rounded bg-white/10" />
        {[0, 1, 2].map((row) => (
          <div key={row} className="h-[58px] rounded-[10px] bg-white/10" />
        ))}
      </div>
    </PortalPage>
  );
}

function ClosedState() {
  return (
    <PortalPage>
      <PageHeading title="Applications are closed">
        The deadline to apply to TechNova has passed, so new applications can no longer be submitted.
      </PageHeading>
      <p className="text-lg text-tn-muted">
        Questions? Email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className={textLink}>
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
      <div>
        <Link href={DASHBOARD} className={buttonSecondary}>
          Back to dashboard
        </Link>
      </div>
    </PortalPage>
  );
}

type FormProps = {
  /** Keys the localStorage draft. */
  userId: string;
  /** Answers known from the account (email, name), used where the draft has none. */
  prefill: Answers;
  /** What Profile & settings has saved (name, pronouns, t-shirt size). These win over the draft. */
  profile: Answers;
  /** The draft saved to the applicant's account, if any. */
  accountDraft: Draft | null;
  /** True once the application deadline has passed. */
  closed: boolean;
};

export default function ApplicationForm({ userId, prefill, profile, accountDraft, closed }: FormProps) {
  const stored = useStoredDraft(userId);

  if (closed) return <ClosedState />;
  // Not known on the server or during hydration: localStorage is read after that.
  if (stored === undefined) return <FormSkeleton />;
  // Start from whichever copy was saved last: this browser's, or the one on their account.
  return (
    <Stepper
      userId={userId}
      prefill={prefill}
      profile={profile}
      stored={newerDraft(stored, accountDraft)}
      accountSavedAt={accountDraft?.savedAt || null}
    />
  );
}

type StepperProps = Pick<FormProps, "userId" | "prefill" | "profile"> & {
  stored: Draft | null;
  /** When the account copy was last saved. */
  accountSavedAt: string | null;
};

function Stepper({ userId, prefill, profile, stored, accountSavedAt }: StepperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // `stored` is only the starting point; the hook owns the draft from here on.
  const draft = useApplicationDraft(
    userId,
    { answers: { ...withPrefill(stored?.answers ?? {}, prefill), ...profile }, step: stored?.step || STEPS[0].id },
    stored?.savedAt || null,
  );
  const { answers } = draft;
  const now = useNow();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  // The copy on the applicant's account, saved at milestones (switching step, save and exit).
  const [account, setAccount] = useState<{ savedAt: string | null; failed: boolean }>({
    savedAt: accountSavedAt,
    failed: false,
  });
  const accountSave = useRef(0);
  async function saveToAccount(step: string) {
    const attempt = ++accountSave.current;
    let result: Awaited<ReturnType<typeof saveHackerDraft>> = { ok: false };
    try {
      result = await saveHackerDraft(encodeAnswers(answers), step);
    } catch {
      // Offline or the request failed: the browser copy is still there.
    }
    // Only the latest save decides what is shown.
    if (attempt !== accountSave.current) return;
    setAccount((previous) => (result.ok ? { savedAt: result.savedAt, failed: false } : { ...previous, failed: true }));
  }

  // The step to show: the one in the URL, else where the draft left off. Any step can be opened
  // in any order; what is still missing is checked when the application is submitted.
  const requested = searchParams.get("step");
  const requestedIndex = STEPS.findIndex((step) => step.id === (requested ?? draft.step));
  const done = completedSteps(answers);
  const incomplete = SECTIONS.map((_, index) => index).filter((index) => !done[index]);
  const current = Math.max(requestedIndex, 0);
  const stepId = STEPS[current].id;
  const section = current < REVIEW_INDEX ? SECTIONS[current] : null;

  // Keep the URL in step with what is shown (no step given, or an unknown one).
  useEffect(() => {
    if (requested !== stepId) window.history.replaceState(null, "", `?step=${stepId}`);
  }, [requested, stepId]);

  // After a step change, move to the top of the new step, or to the question that needs fixing.
  const containerRef = useRef<HTMLDivElement>(null);
  const shownStep = useRef(stepId);
  const focusAfterStep = useRef<string | null>(null);
  useEffect(() => {
    if (shownStep.current === stepId) return;
    shownStep.current = stepId;
    const question = focusAfterStep.current;
    focusAfterStep.current = null;
    if (question) {
      focusQuestion(question);
    } else {
      window.scrollTo({ top: 0 });
      containerRef.current?.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
    }
  }, [stepId]);

  function goTo(index: number, keepErrors = false) {
    const id = STEPS[index].id;
    if (!keepErrors) setErrors({});
    setSubmitError(null);
    // Leaving a step saves it, finished or not.
    draft.setStep(id);
    draft.save();
    if (id !== stepId) void saveToAccount(id);
    if (id !== stepId) window.history.pushState(null, "", `?step=${id}`);
  }

  /** Shows validation errors and takes the applicant to the first one. */
  function showErrors(next: Record<string, string>) {
    setErrors(next);
    const first = firstError(next);
    if (!first) return;
    if (first.step === current) {
      // Wait for the error messages to render before moving focus.
      requestAnimationFrame(() => focusQuestion(first.question));
    } else {
      focusAfterStep.current = first.question;
      goTo(first.step, true);
    }
  }

  function changeAnswer(id: string, value: AnswerValue) {
    draft.setAnswer(id, value);
    if (!errors[id]) return;
    const rest = { ...errors };
    delete rest[id];
    setErrors(rest);
  }

  /**
   * "Save and continue": saves the section either way, but only moves on once its required
   * questions are answered and nothing is over a limit. The tabs still open any section, so an
   * applicant who wants to come back to this one later can.
   */
  function continueToNext() {
    if (!section) return;
    const sectionErrors = validateSection(section, answers);
    if (Object.keys(sectionErrors).length > 0) {
      draft.save();
      void saveToAccount(stepId);
      showErrors(sectionErrors);
      return;
    }
    goTo(current + 1);
  }

  async function saveAndExit() {
    draft.save();
    await saveToAccount(stepId);
    router.push(DASHBOARD);
  }

  function submit() {
    setSubmitError(null);
    const formErrors = validateForm(hackerForm, answers);
    if (Object.keys(formErrors).length > 0) {
      showErrors(formErrors);
      return;
    }
    startTransition(async () => {
      try {
        const result = await submitHackerApplication(encodeAnswers(visibleAnswers(hackerForm, answers)));
        if (result.ok) {
          setSubmitted(true);
          draft.clear();
          router.push(SUBMITTED);
          return;
        }
        setSubmitError(result.error);
        if (result.fieldErrors) showErrors(result.fieldErrors);
      } catch {
        setSubmitError(SUBMIT_FAILED);
      }
    });
  }

  // What the header says about the draft. The account copy is the one that follows them around.
  const saveStatus = account.failed
    ? draft.saveFailed
      ? "Couldn’t save your draft"
      : "Saved on this device only. We’ll try your account again when you switch sections"
    : account.savedAt
      ? `${savedLabel(account.savedAt, now)} to your account`
      : draft.saveFailed
        ? "Not saved yet"
        : draft.savedAt
          ? `${savedLabel(draft.savedAt, now)} on this device`
          : "Not saved yet";
  const errorCount = Object.keys(errors).length;

  const title = section ? section.title : "Review and submit";
  const intro = section
    ? section.description
    : "Thanks so much for your interest in applying to TechNova! Check your answers, then submit.";

  return (
    <PortalPage>
      <div ref={containerRef} className="flex flex-col gap-6 xl:gap-8">
        {/* This page of the dashboard: its name, the draft's state, and the way back. */}
        <div className="flex max-w-[988px] flex-col gap-3.5">
          <div className="flex flex-wrap items-center justify-between gap-x-6">
            <p className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
              <span className={`${heading} text-2xl leading-[1.25]`}>My application</span>
              <span className="text-sm text-tn-muted">Draft · {saveStatus}</span>
            </p>
            <button
              type="button"
              onClick={saveAndExit}
              className={`${textLink} flex min-h-11 cursor-pointer items-center text-[15px] font-semibold`}
            >
              Save and exit to dashboard
            </button>
          </div>
          {/* On phones the sidebar's deadline is behind the menu button. */}
          <TimeLeft prefix="Applications close in" className="text-sm font-semibold text-tn-yellow md:hidden" />
          <StepTabs steps={STEPS} current={current} done={done} onSelect={(index) => goTo(index)} />
        </div>

        <div className="flex max-w-[820px] flex-col gap-3">
          <h1
            tabIndex={-1}
            className={`${heading} title-shade w-fit pb-[0.08em] text-[clamp(1.875rem,1.2rem+2vw,3rem)] leading-[1.15] text-balance outline-none`}
          >
            {title}
          </h1>
          {intro && <p className="text-base leading-[1.45] whitespace-pre-line text-tn-muted xl:text-lg">{intro}</p>}
        </div>

        {current === 0 && (
          <div className="flex max-w-[820px] flex-col gap-6">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
              {KEY_DATES.map(({ label, value, note }) => (
                <div key={label} className="flex flex-col gap-1">
                  <dt className="text-xs text-tn-muted">{label}</dt>
                  <dd className="flex flex-col gap-1">
                    <span className={`${heading} text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-[1.1]`}>{value}</span>
                    <span className="text-[13px] text-tn-muted">{note}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-3">
              <p className="text-[17px] font-semibold text-tn-ink">
                Join us for an in-person hackathon where you&apos;ll have the opportunity to:
              </p>
              <ul className="flex flex-col gap-2 text-base text-tn-ink">
                {OPPORTUNITIES.map((item) => (
                  <li key={item} className="flex items-baseline gap-3">
                    <span aria-hidden className="size-2 shrink-0 -translate-y-px rounded-full bg-tn-yellow" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[15px] leading-[1.45] text-tn-muted">
                Applications will be reviewed on a rolling basis, so we encourage you to apply early! If you require
                accommodations or have any questions, please email us at{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`} className={textLink}>
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>
            </div>
          </div>
        )}

        {section ? (
          <form
            noValidate
            className="flex max-w-[820px] min-w-0 flex-col gap-6"
            onSubmit={(event) => {
              event.preventDefault();
              continueToNext();
            }}
          >
            <QuestionList questions={section.questions} answers={answers} errors={errors} onChange={changeAnswer} />
            {errorCount > 0 && (
              <p role="alert" className="text-base text-tn-error">
                {errorCount === 1
                  ? "Please review the highlighted question before continuing."
                  : `Please review the ${errorCount} highlighted questions before continuing.`}{" "}
                Your answers so far are saved.
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              {current > 0 && (
                <button type="button" onClick={() => goTo(current - 1)} className={buttonSecondary}>
                  Back
                </button>
              )}
              <button type="submit" className={buttonPrimary}>
                {current === REVIEW_INDEX - 1 ? "Save and review" : "Save and continue"}
              </button>
            </div>
          </form>
        ) : (
          <>
            {incomplete.length > 0 && (
              <div className="flex max-w-[820px] flex-col gap-2 rounded-[10px] border border-tn-yellow/70 px-[18px] py-3.5">
                <p className="text-base font-semibold text-tn-ink">
                  {incomplete.length === 1
                    ? "One section still has required questions to answer:"
                    : `${incomplete.length} sections still have required questions to answer:`}
                </p>
                <ul className="flex flex-wrap gap-x-5 gap-y-1">
                  {incomplete.map((index) => (
                    <li key={STEPS[index].id}>
                      <button
                        type="button"
                        onClick={() => goTo(index)}
                        className={`${textLink} flex min-h-9 cursor-pointer items-center text-[15px] font-semibold`}
                      >
                        {index + 1}. {STEPS[index].label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <ReviewStep
            steps={SECTIONS}
            agreements={AGREEMENTS}
            answers={answers}
            errors={errors}
            submitError={submitError}
            pending={pending || submitted}
            onChange={changeAnswer}
            onEdit={(index) => goTo(index)}
            onSubmit={submit}
          />
          </>
        )}
      </div>
    </PortalPage>
  );
}
