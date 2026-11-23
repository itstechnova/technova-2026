import { controlInput } from "@/components/portal/ui";
import { OTHER_PREFIX } from "@/lib/application/types";

/**
 * The text typed so far in an "Other" answer, exactly as typed. `otherText` from validate.ts
 * trims, which in a controlled input would swallow the space between two words mid-typing.
 */
export function otherDraftText(value: string): string {
  if (value.startsWith(OTHER_PREFIX)) return value.slice(OTHER_PREFIX.length);
  // A stored answer whose trailing space was trimmed away: a bare "Other:".
  return value.slice(OTHER_PREFIX.trimEnd().length).trimStart();
}

type OtherTextInputProps = {
  id: string;
  /** The free text only, without the "Other: " prefix. */
  value: string;
  onChange: (text: string) => void;
  /** Accessible name, e.g. "Other: How did you hear about us?". */
  label: string;
  autoFocus?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
};

/** The "please specify" input revealed under a group when its "Other" option is selected. */
export function OtherTextInput({
  id,
  value,
  onChange,
  label,
  autoFocus,
  disabled,
  invalid,
  describedBy,
}: OtherTextInputProps) {
  return (
    <input
      id={id}
      type="text"
      className={`${controlInput} basis-full`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Please specify"
      aria-label={label}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      // Focus only when a pointer click revealed it, never on a restored draft or arrow keys.
      autoFocus={autoFocus}
      disabled={disabled}
    />
  );
}
