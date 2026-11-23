import type { InputHTMLAttributes, ReactNode } from "react";

import { controlSurface } from "@/components/portal/ui";

// Radios and checkboxes are real inputs, drawn as an 18px marker (round = pick one, square = pick
// several). `tone` says what the marker sits on once checked: "chip" fills with cyan, so the marker
// turns dark; "row" keeps its tint, so the marker turns cyan with a dark tick.

const box =
  "peer size-[18px] shrink-0 cursor-pointer appearance-none border-[1.5px] border-tn-muted bg-transparent transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed";
const checkedTone = {
  chip: "checked:border-tn-bg checked:bg-tn-bg",
  row: "checked:border-tn-cyan checked:bg-tn-cyan",
};

function CheckIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className={`pointer-events-none absolute size-3.5 opacity-0 peer-checked:opacity-100 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 10.5l3.5 3.5 7.5-8" />
    </svg>
  );
}

type ChoiceInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> & {
  type: "radio" | "checkbox";
  tone?: keyof typeof checkedTone;
};

export function ChoiceInput({ type, tone = "chip", ...props }: ChoiceInputProps) {
  return (
    <span className="relative flex size-6 shrink-0 items-center justify-center">
      {type === "checkbox" ? (
        <>
          <input type="checkbox" className={`${box} rounded-[5px] ${checkedTone[tone]}`} {...props} />
          <CheckIcon className={tone === "chip" ? "text-tn-cyan" : "text-tn-bg"} />
        </>
      ) : (
        <input type="radio" className={`${box} rounded-full ${checkedTone[tone]}`} {...props} />
      )}
    </span>
  );
}

type ChoiceOptionProps = Omit<ChoiceInputProps, "tone"> & { children: ReactNode };

/**
 * One option of a radio or checkbox group, as a chip: the whole chip is the label and a 44px tap
 * target. Selected chips fill cyan with dark text, and the marker fills too, so colour is not the
 * only signal.
 */
export function ChoiceOption({ children, ...inputProps }: ChoiceOptionProps) {
  return (
    <label
      className={`flex min-h-11 max-w-full cursor-pointer items-center gap-2 rounded-3xl ${controlSurface} py-2 pr-[18px] pl-3 text-base leading-[1.35] text-tn-ink has-[:checked]:border-tn-cyan has-[:checked]:bg-tn-cyan has-[:checked]:text-tn-bg has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 has-[:disabled]:hover:border-tn-muted/55`}
    >
      <ChoiceInput {...inputProps} />
      <span className="min-w-0 break-words">{children}</span>
    </label>
  );
}

/** Chips flow in rows and wrap; an "Other" text field (`basis-full`) takes a row of its own. */
export const optionGroupClass = "flex flex-wrap gap-2.5";
