import { useState } from "react";

import { OTHER_PREFIX, type SingleChoiceQuestion } from "@/lib/application/types";
import { isOtherValue } from "@/lib/application/validate";

import { ChoiceOption, optionGroupClass } from "./ChoiceOption";
import { otherDraftText, OtherTextInput } from "./OtherTextInput";
import { QuestionShell, useFieldIds } from "./QuestionShell";

export type SingleChoiceFieldProps = {
  question: SingleChoiceQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

export function SingleChoiceField({ question, value = "", onChange, error, disabled }: SingleChoiceFieldProps) {
  const ids = useFieldIds(question);
  // True when "Other" was last picked with a pointer, so its text input takes focus as it appears.
  const [focusOther, setFocusOther] = useState(false);

  const otherSelected = Boolean(question.allowOther) && isOtherValue(value);
  const canClear = !question.required && !disabled && value !== "";

  return (
    <QuestionShell
      question={question}
      ids={ids}
      error={error}
      group
      groupProps={{
        role: "radiogroup",
        "aria-required": question.required || undefined,
        "aria-invalid": error ? true : undefined,
      }}
      hint={
        canClear && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="-my-3 shrink-0 cursor-pointer rounded py-3 text-sm leading-[1.35] text-tn-cyan underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Clear selection
          </button>
        )
      }
    >
      <div className={optionGroupClass}>
        {question.options.map((option) => (
          <ChoiceOption
            key={option.value}
            type="radio"
            name={ids.control}
            value={option.value}
            checked={!otherSelected && value === option.value}
            onChange={() => onChange(option.value)}
            disabled={disabled}
          >
            {option.label}
          </ChoiceOption>
        ))}
        {question.allowOther && (
          <ChoiceOption
            type="radio"
            name={ids.control}
            value="other"
            checked={otherSelected}
            // `detail` is 0 for keyboard-driven clicks (arrow keys, space).
            onClick={(event) => setFocusOther(event.detail > 0)}
            onChange={() => {
              if (!otherSelected) onChange(OTHER_PREFIX);
            }}
            disabled={disabled}
          >
            Other
          </ChoiceOption>
        )}
        {otherSelected && (
          <OtherTextInput
            id={`${ids.control}-other`}
            value={otherDraftText(value)}
            onChange={(text) => onChange(OTHER_PREFIX + text)}
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
