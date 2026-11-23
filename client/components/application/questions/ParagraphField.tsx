import { controlInput } from "@/components/portal/ui";
import type { ParagraphQuestion } from "@/lib/application/types";

import { wordLimitError } from "@/lib/application/validate";

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
  // A problem found at Submit, or else being over the word limit right now.
  const shownError = error ?? wordLimitError(question, value) ?? undefined;

  return (
    <QuestionShell
      question={question}
      ids={ids}
      error={shownError}
      hint={hasCounter && <WordCount id={ids.hint} text={value} max={question.maxWords!} />}
    >
      <textarea
        id={ids.control}
        name={question.id}
        rows={5}
        // Grows with its content where `field-sizing` is supported; elsewhere it is a
        // comfortable fixed height the applicant can drag taller.
        className={`${controlInput} field-sizing-content block min-h-40 resize-y`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={question.placeholder ?? "Your answer"}
        aria-required={question.required || undefined}
        aria-invalid={shownError ? true : undefined}
        aria-describedby={describedBy(question, ids, { error: shownError, hint: hasCounter })}
        disabled={disabled}
      />
    </QuestionShell>
  );
}
