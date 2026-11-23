import { fieldInput } from "@/components/portal/ui";
import type { ParagraphQuestion } from "@/lib/application/types";

import { describedBy, QuestionShell, useFieldIds } from "./QuestionShell";
import { WordCount } from "./WordCount";

export type ParagraphFieldProps = {
  question: ParagraphQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

export function ParagraphField({ question, value = "", onChange, error, disabled }: ParagraphFieldProps) {
  const ids = useFieldIds(question);
  const hasCounter = question.maxWords !== undefined;

  return (
    <QuestionShell
      question={question}
      ids={ids}
      error={error}
      hint={hasCounter && <WordCount id={ids.hint} text={value} max={question.maxWords!} />}
    >
      <textarea
        id={ids.control}
        name={question.id}
        rows={5}
        // Grows with its content where `field-sizing` is supported; elsewhere it is a
        // comfortable fixed height the applicant can drag taller.
        className={`${fieldInput} field-sizing-content block min-h-40 resize-y`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={question.placeholder}
        aria-required={question.required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(question, ids, { error, hint: hasCounter })}
        disabled={disabled}
      />
    </QuestionShell>
  );
}
