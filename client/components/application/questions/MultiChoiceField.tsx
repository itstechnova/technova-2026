import { useState } from "react";

import { OTHER_PREFIX, type MultiChoiceQuestion } from "@/lib/application/types";
import { isOtherValue } from "@/lib/application/validate";

import { ChoiceOption, optionGroupClass } from "./ChoiceOption";
import { otherDraftText, OtherTextInput } from "./OtherTextInput";
import { QuestionShell, useFieldIds } from "./QuestionShell";

export type MultiChoiceFieldProps = {
  question: MultiChoiceQuestion;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  error?: string;
  disabled?: boolean;
};

const NONE: string[] = [];

export function MultiChoiceField({ question, value = NONE, onChange, error, disabled }: MultiChoiceFieldProps) {
  const ids = useFieldIds(question);
  // True when "Other" was last ticked with a pointer, so its text input takes focus as it appears.
  const [focusOther, setFocusOther] = useState(false);

  const other = question.allowOther ? value.find(isOtherValue) : undefined;
  const picked = new Set(value.filter((entry) => !isOtherValue(entry)));
  const chosen = question.options.filter((option) => picked.has(option.value)).map((option) => option.value);
  const count = chosen.length + (other === undefined ? 0 : 1);
  const atCap = question.maxSelect !== undefined && count >= question.maxSelect;

  // Answers are always emitted in option order, with the single "Other: …" entry last.
  const emit = (values: string[], otherEntry: string | undefined) =>
    onChange(otherEntry === undefined ? values : [...values, otherEntry]);

  const toggle = (optionValue: string, checked: boolean) => {
    const next = question.options
      .map((option) => option.value)
      .filter((v) => (v === optionValue ? checked : picked.has(v)));
    emit(next, other);
  };

  return (
    <QuestionShell
      question={question}
      ids={ids}
      error={error}
      group
      hint={
        question.maxSelect !== undefined && (
          <p
            id={ids.hint}
            aria-live="polite"
            className={`shrink-0 text-sm leading-[1.35] tabular-nums ${count > question.maxSelect ? "font-semibold text-tn-error" : "text-tn-muted"}`}
          >
            {count} of {question.maxSelect} selected
          </p>
        )
      }
    >
      <div className={optionGroupClass}>
        {question.options.map((option) => {
          const checked = picked.has(option.value);
          return (
            <ChoiceOption
              key={option.value}
              type="checkbox"
              name={question.id}
              value={option.value}
              checked={checked}
              onChange={(event) => toggle(option.value, event.target.checked)}
              disabled={disabled || (atCap && !checked)}
            >
              {option.label}
            </ChoiceOption>
          );
        })}
        {question.allowOther && (
          <ChoiceOption
            type="checkbox"
            name={question.id}
            value="other"
            checked={other !== undefined}
            // `detail` is 0 for keyboard-driven clicks (space).
            onClick={(event) => setFocusOther(event.detail > 0)}
            onChange={(event) => emit(chosen, event.target.checked ? OTHER_PREFIX : undefined)}
            disabled={disabled || (atCap && other === undefined)}
          >
            Other
          </ChoiceOption>
        )}
        {other !== undefined && (
          <OtherTextInput
            id={`${ids.control}-other`}
            value={otherDraftText(other)}
            onChange={(text) => emit(chosen, OTHER_PREFIX + text)}
            label={`Other: ${question.prompt}`}
            autoFocus={focusOther}
            disabled={disabled}
            invalid={Boolean(error)}
            describedBy={error ? ids.error : undefined}
          />
        )}
      </div>
    </QuestionShell>
  );
}
