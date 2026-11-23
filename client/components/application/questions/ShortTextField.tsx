import type { HTMLAttributes, HTMLInputTypeAttribute } from "react";

import { fieldInput } from "@/components/portal/ui";
import type { ShortTextQuestion } from "@/lib/application/types";

import { describedBy, QuestionShell, useFieldIds } from "./QuestionShell";
import { WordCount } from "./WordCount";

type InputKind = {
  type: HTMLInputTypeAttribute;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
};

// "number" stays a text input (numeric keypad, no spinner or scroll-to-change); the answer is a string.
const INPUT_KINDS: Record<NonNullable<ShortTextQuestion["inputType"]>, InputKind> = {
  text: { type: "text" },
  email: { type: "email", inputMode: "email", autoComplete: "email" },
  tel: { type: "tel", inputMode: "tel", autoComplete: "tel" },
  number: { type: "text", inputMode: "numeric", autoComplete: "off" },
};

const AUTOCOMPLETE_BY_ID: Record<string, string> = {
  first_name: "given-name",
  last_name: "family-name",
};

export type ShortTextFieldProps = {
  question: ShortTextQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

export function ShortTextField({ question, value = "", onChange, error, disabled }: ShortTextFieldProps) {
  const ids = useFieldIds(question);
  const kind = INPUT_KINDS[question.inputType ?? "text"];
  const hasCounter = question.maxWords !== undefined;

  return (
    <QuestionShell
      question={question}
      ids={ids}
      error={error}
      hint={hasCounter && <WordCount id={ids.hint} text={value} max={question.maxWords!} />}
    >
      <input
        id={ids.control}
        name={question.id}
        type={kind.type}
        inputMode={kind.inputMode}
        autoComplete={AUTOCOMPLETE_BY_ID[question.id] ?? kind.autoComplete}
        className={fieldInput}
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
