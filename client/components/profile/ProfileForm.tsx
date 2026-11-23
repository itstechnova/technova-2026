"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { patchStoredDraft } from "@/components/application/useApplicationDraft";
import { Section, textLink } from "@/components/portal/PortalPage";
import { buttonPrimary, buttonSecondary, controlInput, fieldError } from "@/components/portal/ui";
import { SUPPORT_EMAIL } from "@/lib/application/config";
import { firstName, lastName, phoneNumber, pronouns, shirtSize } from "@/lib/application/forms/shared";
import { saveProfile } from "@/lib/profile/actions";
import type { ProfileField, ProfileState, ProfileValues } from "@/lib/profile/fields";

const label = "text-[17px] leading-[1.35] font-semibold text-tn-ink";
const hint = "text-sm leading-[1.4] text-tn-muted";

/** Profile & settings (Figma "04 · Hacker dashboard / Profile & settings"). */
export function ProfileForm({ userId, initial, email }: { userId: string; initial: ProfileValues; email: string }) {
  const [state, formAction, pending] = useActionState<ProfileState, FormData>(saveProfile, { values: initial });
  const { values, errors = {} } = state;

  // An unfinished application in this browser asks for the same details: keep it in step.
  useEffect(() => {
    if (state.saved) patchStoredDraft(userId, state.values);
  }, [state, userId]);

  const text = (
    question: { id: string; prompt: string; placeholder?: string },
    props: { name: string; type?: string; autoComplete?: string; required?: boolean },
  ) => {
    const id = question.id as ProfileField;
    return (
      <div className="flex min-w-0 flex-col gap-2">
        <label htmlFor={id} className={label}>
          {props.name}
        </label>
        <input
          id={id}
          name={id}
          type={props.type ?? "text"}
          autoComplete={props.autoComplete}
          defaultValue={values[id]}
          placeholder={question.placeholder}
          aria-required={props.required || undefined}
          aria-invalid={errors[id] ? true : undefined}
          aria-describedby={errors[id] ? `${id}-error` : undefined}
          className={controlInput}
        />
        {errors[id] && (
          <p id={`${id}-error`} role="alert" className={fieldError}>
            {errors[id]}
          </p>
        )}
      </div>
    );
  };

  return (
    // The key resets the fields to what was saved (or typed) after each submit.
    <form action={formAction} noValidate key={JSON.stringify(values)} className="flex flex-col gap-6 xl:gap-8">
      <Section title="About you">
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {text(firstName, { name: "First name", autoComplete: "given-name", required: true })}
          {text(lastName, { name: "Last name", autoComplete: "family-name", required: true })}
          {text(pronouns, { name: "Pronouns" })}
          {text(phoneNumber, { name: "Phone number", type: "tel", autoComplete: "tel", required: true })}
          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor="shirt_size" className={label}>
              T-shirt size
            </label>
            <div className="relative">
              <select
                id="shirt_size"
                name="shirt_size"
                defaultValue={values.shirt_size}
                aria-invalid={errors.shirt_size ? true : undefined}
                aria-describedby={errors.shirt_size ? "shirt_size-error" : undefined}
                className={`${controlInput} cursor-pointer appearance-none pr-12`}
              >
                <option value="" className="bg-tn-bg text-tn-muted">
                  Select a size
                </option>
                {shirtSize.options.map((option) => (
                  <option key={option.value} value={option.value} className="bg-tn-bg text-tn-ink">
                    {option.label}
                  </option>
                ))}
              </select>
              <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 right-[18px] size-5 -translate-y-1/2 text-tn-cyan" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 7.5l5 5 5-5" />
              </svg>
            </div>
            {errors.shirt_size && (
              <p id="shirt_size-error" role="alert" className={fieldError}>
                {errors.shirt_size}
              </p>
            )}
          </div>
        </div>
      </Section>

      <Section title="Account">
        <div className="flex max-w-[400px] flex-col gap-2">
          <label htmlFor="account-email" className={label}>
            Email address
          </label>
          <input id="account-email" value={email} readOnly aria-describedby="account-email-hint" className={`${controlInput} opacity-70`} />
          <p id="account-email-hint" className={hint}>
            This is the address you log in with. To change it, email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className={textLink}>
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className={label}>Password</p>
          <Link href="/forgot-password" className={buttonSecondary}>
            Change password
          </Link>
          <p className={`${hint} max-w-[560px]`}>
            We’ll email you a link to set a new one. If you sign in with Google, your password is managed by Google.
          </p>
        </div>
      </Section>

      <div className="flex max-w-[820px] flex-wrap items-center gap-x-4 gap-y-3">
        <button type="submit" disabled={pending} className={buttonPrimary}>
          {pending ? "Saving…" : "Save changes"}
        </button>
        <p role="status" className={`text-sm ${state.error ? "text-tn-error" : "text-tn-muted"}`}>
          {state.error ?? (state.saved ? "Saved." : "Nothing is saved until you press Save changes.")}
        </p>
      </div>
    </form>
  );
}
