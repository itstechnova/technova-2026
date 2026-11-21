import { useId, type ReactNode } from "react";

import { fieldError, fieldLabel } from "@/components/portal/ui";
import type { Question } from "@/lib/application/types";

export type FieldIds = {
  /** Id of the main control (the input, select, or the group's first-class element). */
  control: string;
  description: string;
  error: string;
  /** Id for an extra hint such as a word or selection counter. */
  hint: string;
};

/** Stable DOM ids for one question, derived from its id (unique even if rendered twice). */
export function useFieldIds(question: Question): FieldIds {
  const uid = useId();
  const base = `q-${question.id}-${uid}`;
  return {
    control: base,
    description: `${base}-description`,
    error: `${base}-error`,
    hint: `${base}-hint`,
  };
}

/** The `aria-describedby` value for a question's control: only ids that are actually rendered. */
export function describedBy(
  question: Question,
  ids: FieldIds,
  { error, hint = false }: { error?: string; hint?: boolean },
): string | undefined {
  const parts = [
    question.description ? ids.description : null,
    hint ? ids.hint : null,
    error ? ids.error : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : undefined;
}

export function OptionalHint() {
  return <span className="ml-1.5 text-sm font-normal text-tn-muted">(optional)</span>;
}

export function QuestionDescription({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="text-base leading-[1.45] whitespace-pre-line text-tn-muted">
      {children}
    </p>
  );
}

export function QuestionLinks({ links }: { links: Question["links"] }) {
  if (!links || links.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-1">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded text-base text-tn-cyan underline underline-offset-4 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-0"
          >
            {link.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * The line under a control: the error on the left, an optional counter on the right. It always
 * takes one line of height so an error appearing does not move the rest of the form.
 */
export function QuestionFooter({ ids, error, hint }: { ids: FieldIds; error?: string; hint?: ReactNode }) {
  return (
    <div className="flex min-h-5 items-start justify-between gap-4">
      <p id={ids.error} role="alert" className={fieldError}>
        {error}
      </p>
      {hint}
    </div>
  );
}

type QuestionShellProps = {
  question: Question;
  ids: FieldIds;
  error?: string;
  /** Render as `<fieldset>/<legend>` (radio and checkbox groups) instead of `<label>`. */
  group?: boolean;
  /** Extra attributes for the fieldset, e.g. `role="radiogroup"`. Only used with `group`. */
  groupProps?: React.FieldsetHTMLAttributes<HTMLFieldSetElement>;
  /** Shown at the right of the footer line: a word counter, "3 of 5 selected"… */
  hint?: ReactNode;
  children: ReactNode;
};

/** Shared chrome of a question: prompt, optional marker, description, links, control, error. */
export function QuestionShell({ question, ids, error, group, groupProps, hint, children }: QuestionShellProps) {
  const prompt = (
    <>
      {question.prompt}
      {!question.required && <OptionalHint />}
    </>
  );
  const meta = (
    <>
      {question.description && (
        <QuestionDescription id={ids.description}>{question.description}</QuestionDescription>
      )}
      <QuestionLinks links={question.links} />
    </>
  );
  const footer = <QuestionFooter ids={ids} error={error} hint={hint} />;

  if (group) {
    return (
      <fieldset
        {...groupProps}
        aria-describedby={describedBy(question, ids, { error, hint: Boolean(hint) })}
        className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0"
      >
        {/* A legend ignores flex gap in some browsers, so it carries its own spacing. */}
        <legend className={`${fieldLabel} float-left w-full p-0`}>{prompt}</legend>
        {meta}
        {children}
        {footer}
      </fieldset>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={ids.control} className={fieldLabel}>
        {prompt}
      </label>
      {meta}
      {children}
      {footer}
    </div>
  );
}
