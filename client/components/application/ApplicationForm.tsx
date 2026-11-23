"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { FormAside } from "@/components/application/FormAside";
import { QuestionList, focusQuestion } from "@/components/application/QuestionList";
import { ReviewStep } from "@/components/application/ReviewStep";
import { StepTabs, type Step } from "@/components/application/StepTabs";
import {
  savedLabel,
  useApplicationDraft,
  useNow,
  useStoredDraft,
  type Draft,
} from "@/components/application/useApplicationDraft";
import { PageHeading, PortalPage, textLink } from "@/components/portal/PortalPage";
import { buttonPrimary, buttonSecondary } from "@/components/portal/ui";
import { cn } from "@/lib/utils";
import { SUPPORT_EMAIL } from "@/lib/application/config";
import { hackerForm } from "@/lib/application/forms/hacker";
import { submitHackerApplication } from "@/lib/application/submit";
import type { AnswerValue, Answers } from "@/lib/application/types";
import {
  isAnswered,
  reviewSections,
  stepSections,
  validateForm,
  validateSection,
  visibleAnswers,
} from "@/lib/application/validate";

// The action bar's buttons: the portal buttons, a size down so three fit a phone's width.
const compactButton = "min-h-11 px-5 py-2.5 text-base";

// The hacker application as a stepper: one step per form section, then Review. The current step
// is in the URL (`?step=<section id | review>`); answers are a localStorage draft until submitted.

const DASHBOARD = "/applicant/dashboard";
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

/** Index of the first step whose answers don't validate; the Review step when they all do. */
function firstInvalidStep(answers: Answers): number {
  const index = SECTIONS.findIndex((section) => Object.keys(validateSection(section, answers)).length > 0);
  return index === -1 ? REVIEW_INDEX : index;
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
      <PageHeading eyebrow="Application / Closed" title="Applications are closed">
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
          Back to overview
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
  /** True once the application deadline has passed. */
  closed: boolean;
};

export default function ApplicationForm({ userId, prefill, closed }: FormProps) {
  const stored = useStoredDraft(userId);

  if (closed) return <ClosedState />;
  // Not known on the server or during hydration: localStorage is read after that.
  if (stored === undefined) return <FormSkeleton />;
  return <Stepper userId={userId} prefill={prefill} stored={stored} />;
}

function Stepper({ userId, prefill, stored }: Omit<FormProps, "closed"> & { stored: Draft | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // `stored` is only the starting point; the hook owns the draft from here on.
  const draft = useApplicationDraft(
    userId,
    { answers: withPrefill(stored?.answers ?? {}, prefill), step: stored?.step || STEPS[0].id },
    stored?.savedAt || null,
  );
  const { answers } = draft;
  const now = useNow();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  // The step to show: the one in the URL (else where the draft left off), but never past the
  // first step that still has invalid answers.
  const requested = searchParams.get("step");
  const requestedIndex = STEPS.findIndex((step) => step.id === (requested ?? draft.step));
  const reachable = firstInvalidStep(answers);
  const current = Math.min(Math.max(requestedIndex, 0), reachable);
  const stepId = STEPS[current].id;
  const section = current < REVIEW_INDEX ? SECTIONS[current] : null;

  // Keep the URL in step with what is shown (no step given, an unknown one, or one out of reach).
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
    draft.setStep(id);
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

  function continueToNext() {
    if (!section) return;
    const sectionErrors = validateSection(section, answers);
    if (Object.keys(sectionErrors).length > 0) showErrors(sectionErrors);
    else goTo(current + 1);
  }

  function saveAndExit() {
    draft.save();
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
        const result = await submitHackerApplication(visibleAnswers(hackerForm, answers));
        if (result.ok) {
          setSubmitted(true);
          draft.clear();
          router.push(DASHBOARD);
          return;
        }
        setSubmitError(result.error);
        if (result.fieldErrors) showErrors(result.fieldErrors);
      } catch {
        setSubmitError(SUBMIT_FAILED);
      }
    });
  }

  const saveStatus = draft.saveFailed
    ? "Couldn’t save your draft on this device"
    : draft.savedAt
      ? savedLabel(draft.savedAt, now)
      : "Not saved yet";
  const errorCount = Object.keys(errors).length;

  return (
    <PortalPage>
      <div ref={containerRef} className="flex flex-col gap-5 xl:gap-[30px]">
        <PageHeading
          eyebrow={`Application / ${section ? (section.shortTitle ?? section.title) : "Review"}`}
          title={section ? section.title : "Review your application"}
        >
          {!section && <p>Check your answers before submitting.</p>}
          <p>
            Step {current + 1} of {STEPS.length} · {saveStatus}
          </p>
        </PageHeading>

        <StepTabs steps={STEPS} current={current} reachable={reachable} onSelect={(index) => goTo(index)} />

        {section ? (
          <div className="flex items-start gap-10">
            <form
              noValidate
              className="flex max-w-[820px] min-w-0 flex-1 flex-col gap-5 xl:gap-[30px]"
              onSubmit={(event) => {
                event.preventDefault();
                continueToNext();
              }}
            >
              {section.description && (
                <p className="text-base leading-[1.45] whitespace-pre-line text-tn-muted xl:text-lg">{section.description}</p>
              )}
              <QuestionList
                questions={section.questions}
                answers={answers}
                errors={errors}
                onChange={changeAnswer}
              />
              {errorCount > 0 && (
                <p role="alert" className="text-base text-tn-error">
                  {errorCount === 1
                    ? "Please fix the highlighted question to continue."
                    : `Please fix the ${errorCount} highlighted questions to continue.`}
                </p>
              )}
              {/* Pinned to the bottom of the window, so the way forward is in view on long steps. */}
              <div className="sticky bottom-0 z-10 -mx-5 flex flex-wrap items-center gap-2.5 border-t border-tn-line/60 bg-tn-bg/75 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:gap-3 sm:px-8 md:mx-0 md:rounded-t-2xl md:border-x md:px-4">
                <button type="submit" className={cn(buttonPrimary, compactButton)}>
                  {current === REVIEW_INDEX - 1 ? "Review application" : "Continue"}
                </button>
                {current > 0 && (
                  <button type="button" onClick={() => goTo(current - 1)} className={cn(buttonSecondary, compactButton)}>
                    Back
                  </button>
                )}
                <button type="button" onClick={saveAndExit} className={cn(buttonSecondary, compactButton, "ml-auto")}>
                  Save &amp; exit
                </button>
              </div>
            </form>
            <FormAside />
          </div>
        ) : (
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
        )}
      </div>
    </PortalPage>
  );
}
