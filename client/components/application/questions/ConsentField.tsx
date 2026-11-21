import type { ConsentQuestion } from "@/lib/application/types";

import { ChoiceInput } from "./ChoiceOption";
import { describedBy, QuestionDescription, QuestionFooter, QuestionLinks, useFieldIds } from "./QuestionShell";

export type ConsentFieldProps = {
  question: ConsentQuestion;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  error?: string;
  disabled?: boolean;
};

/**
 * One agreement row (Figma "Form / consent checkbox" and "Form / acknowledgment"): a 24px cyan
 * box in a 44px target, then "Required · I agree…" at 20px. The description reads above the
 * checkbox because prompts refer back to it ("I understand the above and accept.").
 */
export function ConsentField({ question, value = false, onChange, error, disabled }: ConsentFieldProps) {
  const ids = useFieldIds(question);

  return (
    <div className="flex min-w-0 flex-col gap-2">
      {question.description && (
        <QuestionDescription id={ids.description}>{question.description}</QuestionDescription>
      )}
      <label
        className={`flex items-start gap-3 py-1.5 ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      >
        <ChoiceInput
          type="checkbox"
          id={ids.control}
          name={question.id}
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
          aria-required={question.required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(question, ids, { error })}
          disabled={disabled}
        />
        {/* 7px top padding centres the first text line on the 44px checkbox target. */}
        <span className="min-w-0 pt-[7px] text-lg leading-[1.45] break-words text-tn-ink sm:text-xl sm:leading-[1.45]">
          <span className="text-tn-muted">{question.required ? "Required" : "Optional"} · </span>
          {question.prompt}
        </span>
      </label>
      <div className="flex flex-col gap-2 pl-14">
        <QuestionLinks links={question.links} />
        <QuestionFooter ids={ids} error={error} />
      </div>
    </div>
  );
}
