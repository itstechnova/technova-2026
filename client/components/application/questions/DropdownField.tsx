import { fieldInput } from "@/components/portal/ui";
import type { DropdownQuestion } from "@/lib/application/types";

import { describedBy, QuestionShell, useFieldIds } from "./QuestionShell";

export type DropdownFieldProps = {
  question: DropdownQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

/** A native select (right for 100+ options and for phones), dressed as the Figma input. */
export function DropdownField({ question, value = "", onChange, error, disabled }: DropdownFieldProps) {
  const ids = useFieldIds(question);

  return (
    <QuestionShell question={question} ids={ids} error={error}>
      <div className="relative">
        <select
          id={ids.control}
          name={question.id}
          className={`${fieldInput} cursor-pointer appearance-none truncate pr-12 disabled:cursor-not-allowed ${value === "" ? "text-tn-muted/70!" : ""}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-required={question.required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(question, ids, { error })}
          disabled={disabled}
        >
          {/* Stays selectable on optional questions so the answer can be cleared. */}
          <option value="" disabled={question.required} className="bg-tn-bg text-tn-muted">
            {question.placeholder ?? "Select an option"}
          </option>
          {question.options.map((option) => (
            <option key={option.value} value={option.value} className="bg-tn-bg text-tn-ink">
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="pointer-events-none absolute top-1/2 right-[18px] size-5 -translate-y-1/2 text-tn-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 7.5l5 5 5-5" />
        </svg>
      </div>
    </QuestionShell>
  );
}
