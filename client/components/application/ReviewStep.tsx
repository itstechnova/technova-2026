"use client";

import { QuestionList } from "@/components/application/QuestionList";
import { SectionSummary } from "@/components/application/SectionSummary";
import { buttonPrimary, buttonSecondary } from "@/components/portal/ui";
import { textLink } from "@/components/portal/PortalPage";
import type { AnswerValue, Answers, FormSection } from "@/lib/application/types";

/**
 * The last step (Figma "07 · My application / Review"): every step's answers with an Edit link,
 * then the "Before you submit" agreements (the form's review-placement sections) and Submit.
 */
export function ReviewStep({
  steps,
  agreements,
  answers,
  errors,
  submitError,
  pending,
  onChange,
  onEdit,
  onSubmit,
}: {
  steps: FormSection[];
  agreements: FormSection[];
  answers: Answers;
  errors: Record<string, string>;
  submitError: string | null;
  pending: boolean;
  onChange: (id: string, value: AnswerValue) => void;
  /** Opens the step with this index. */
  onEdit: (index: number) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      noValidate
      className="flex max-w-[820px] flex-col gap-7"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      {steps.map((section, index) => (
        <SectionSummary
          key={section.id}
          number={index + 1}
          section={section}
          answers={answers}
          action={
            <button
              type="button"
              disabled={pending}
              onClick={() => onEdit(index)}
              className={`${textLink} flex min-h-11 cursor-pointer items-center text-[15px] font-semibold`}
            >
              Edit<span className="sr-only"> {section.title}</span>
            </button>
          }
        />
      ))}

      <section className="flex flex-col gap-6 border-t border-tn-line/70 pt-6">
        <h2 className="text-xl leading-[1.35] font-semibold text-tn-ink">Before you submit</h2>
        {agreements.map((section) => (
          <div key={section.id} className="flex flex-col gap-4">
            {section.description && (
              <p className="text-[15px] leading-[1.45] whitespace-pre-line text-tn-muted">{section.description}</p>
            )}
            <QuestionList
              questions={section.questions}
              answers={answers}
              errors={errors}
              disabled={pending}
              onChange={onChange}
            />
          </div>
        ))}
      </section>

      {submitError && (
        <p role="alert" className="rounded-[10px] border border-tn-error px-[18px] py-3 text-base text-tn-error">
          {submitError}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => onEdit(steps.length - 1)}
          className={buttonSecondary}
        >
          Back
        </button>
        <button type="submit" disabled={pending} className={buttonPrimary}>
          {pending ? "Submitting…" : "Submit application"}
        </button>
      </div>
    </form>
  );
}
