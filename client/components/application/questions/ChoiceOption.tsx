import type { InputHTMLAttributes, ReactNode } from "react";

import type { Option } from "@/lib/application/types";

const box =
  "peer size-6 shrink-0 cursor-pointer appearance-none border-[1.5px] border-tn-cyan bg-transparent transition checked:bg-tn-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed";

function CheckIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="pointer-events-none absolute size-5 text-tn-bg opacity-0 peer-checked:opacity-100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 10.5l3.5 3.5 7.5-8" />
    </svg>
  );
}

type ChoiceInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> & {
  type: "radio" | "checkbox";
};

/** A real radio/checkbox drawn as the Figma 24px cyan box (or circle), centred in a 44px target. */
export function ChoiceInput({ type, ...props }: ChoiceInputProps) {
  return (
    <span className="relative flex size-11 shrink-0 items-center justify-center">
      {type === "checkbox" ? (
        <>
          <input type="checkbox" className={`${box} rounded-[4px]`} {...props} />
          <CheckIcon />
        </>
      ) : (
        <input
          type="radio"
          className={`${box} rounded-full checked:inset-ring-4 checked:inset-ring-tn-bg`}
          {...props}
        />
      )}
    </span>
  );
}

type ChoiceOptionProps = ChoiceInputProps & { children: ReactNode };

/** One option row of a radio or checkbox group: the whole row is the label and tap target. */
export function ChoiceOption({ children, ...inputProps }: ChoiceOptionProps) {
  return (
    <label className="flex min-h-11 cursor-pointer items-start rounded-[10px] border border-tn-line bg-tn-bg pr-4 transition hover:border-tn-muted has-[:checked]:border-tn-cyan has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 has-[:disabled]:hover:border-tn-line">
      <ChoiceInput {...inputProps} />
      <span className="min-w-0 self-center py-2.5 text-base leading-[1.35] break-words text-tn-ink">
        {children}
      </span>
    </label>
  );
}

const SHORT_LABEL = 28;
const MANY_OPTIONS = 5;

/** One column on phones; two from `sm` up when there are many options and all of them are short. */
export function optionGridClass(options: Option[], extra = 0): string {
  const twoColumns =
    options.length + extra >= MANY_OPTIONS && options.every((option) => option.label.length <= SHORT_LABEL);
  return `grid grid-cols-1 gap-2 ${twoColumns ? "sm:grid-cols-2" : ""}`;
}
