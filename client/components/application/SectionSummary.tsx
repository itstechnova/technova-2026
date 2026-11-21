import type { ReactNode } from "react";
import { heading } from "@/components/portal/ui";
import { formatAnswer } from "@/lib/application/format";
import type { Answers, FormSection } from "@/lib/application/types";
import { isVisible } from "@/lib/application/validate";

/**
 * One section's answers, read-only: "01 / WELCOME", the title, then each visible question with
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
    <section className="flex flex-col gap-4 border-t border-tn-line/70 pt-7 leading-[1.35]">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="flex min-w-0 flex-col gap-3">
          <p className="text-[13px] font-semibold tracking-wide text-tn-cyan uppercase">
            {String(number).padStart(2, "0")} / {section.shortTitle ?? section.title}
          </p>
          <h2 className={`${heading} text-[26px]`}>{section.title}</h2>
        </div>
        {action}
      </div>
      <dl className="flex flex-col gap-5">
        {questions.map((question) => (
          <div key={question.id} className="flex flex-col gap-1">
            <dt className="text-base text-tn-muted">{question.prompt}</dt>
            <dd className="text-lg break-words whitespace-pre-line text-tn-ink">
              {formatAnswer(question, answers[question.id])}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
