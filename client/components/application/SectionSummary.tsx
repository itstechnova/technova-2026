import type { ReactNode } from "react";
import { formatAnswer } from "@/lib/application/format";
import type { Answers, FormSection } from "@/lib/application/types";
import { isVisible } from "@/lib/application/validate";

/**
 * One section's answers, read-only: its number and name, then each visible question with
 * its answer. Used by the Review step (with an Edit `action`) and the submitted view.
 */
export function SectionSummary({
  number,
  section,
  answers,
  action,
}: {
  number: number;
  section: FormSection;
  answers: Answers;
  action?: ReactNode;
}) {
  const questions = section.questions.filter((question) => isVisible(question, answers));

  return (
    <section className="flex flex-col gap-4 border-t border-tn-line/70 pt-6 leading-[1.35]">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <h2 className="flex min-w-0 items-baseline gap-3.5 text-xl font-semibold text-tn-ink">
          <span aria-hidden className="text-[13px] text-tn-cyan tabular-nums">
            {String(number).padStart(2, "0")}
          </span>
          {section.shortTitle ?? section.title}
        </h2>
        {action}
      </div>
      <dl className="flex flex-col gap-5">
        {questions.map((question) => (
          <div key={question.id} className="flex flex-col gap-1">
            <dt className="text-[15px] text-tn-muted">{question.prompt}</dt>
            <dd className="text-lg break-words whitespace-pre-line text-tn-ink">
              {formatAnswer(question, answers[question.id])}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
