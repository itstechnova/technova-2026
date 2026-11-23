import { controlSurface, questionLabel } from "@/components/portal/ui";
import type { ConsentQuestion } from "@/lib/application/types";

import { ChoiceInput } from "./ChoiceOption";
import {
  describedBy,
  QuestionDescription,
  QuestionFooter,
  QuestionLinks,
  RequirementTag,
  useFieldIds,
} from "./QuestionShell";

export type ConsentFieldProps = {
  question: ConsentQuestion;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  error?: string;
  disabled?: boolean;
};

/**
 * One agreement: what is being agreed to (the prompt, with any explanation and links), then a
 * checkbox row with a short label ("I agree!"). The checkbox is named by both, so a screen reader
 * hears the statement as well as the label.
 */
export function ConsentField({ question, value = false, onChange, error, disabled }: ConsentFieldProps) {
  const ids = useFieldIds(question);
  const promptId = `${ids.control}-prompt`;
  const labelId = `${ids.control}-label`;

  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-4">
        <p id={promptId} className={`${questionLabel} min-w-0`}>
          {question.prompt}
        </p>
        <RequirementTag required={question.required} />
      </div>
      {question.description && (
        <QuestionDescription id={ids.description}>{question.description}</QuestionDescription>
      )}
      <QuestionLinks links={question.links} />
      <label
        className={`flex min-h-[50px] w-fit max-w-full items-center gap-3 rounded-[10px] ${controlSurface} py-2.5 pr-[18px] pl-3.5 has-[:checked]:border-tn-cyan has-[[aria-invalid=true]]:border-tn-error ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      >
        <ChoiceInput
          type="checkbox"
          tone="row"
          id={ids.control}
          name={question.id}
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
          aria-labelledby={`${promptId} ${labelId}`}
          aria-required={question.required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(question, ids, { error })}
          disabled={disabled}
        />
        <span id={labelId} className="min-w-0 text-[17px] leading-[1.35] break-words text-tn-ink">
          {question.checkboxLabel ?? "I agree"}
        </span>
      </label>
      <QuestionFooter ids={ids} error={error} />
    </div>
  );
}
