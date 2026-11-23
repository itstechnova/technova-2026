// Validation for application forms. Pure and isomorphic: the form UI runs it for inline errors
// and the submit action runs it again on the server, where `answers` is untrusted input — so
// every check tolerates values of the wrong type instead of assuming the shape in types.ts.

import {
  OTHER_PREFIX,
  type AnswerValue,
  type Answers,
  type Form,
  type FormSection,
  type MultiChoiceQuestion,
  type Option,
  type ParagraphQuestion,
  type Question,
  type ShortTextQuestion,
} from "./types";

const REQUIRED = "This question is required";
const INVALID = "Please answer this question again";

// "Other:" without the trailing space, so a trimmed bare "Other: " is still recognised.
const OTHER_MARKER = OTHER_PREFIX.trimEnd();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[\d\s()+-]+$/;
const MIN_PHONE_DIGITS = 7;
const MAX_PHONE_DIGITS = 15;
// The only number question is the applicant's age.
const MIN_AGE = 10;
const MAX_AGE = 100;
// Backstops against oversized payloads; real limits are the per-question `maxWords`.
const MAX_SHORT_TEXT_CHARS = 300;
const MAX_PARAGRAPH_CHARS = 10_000;

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

/** True for a free-text "Other" answer such as "Other: Ottawa" (or a bare "Other: "). */
export function isOtherValue(value: string): boolean {
  return value.startsWith(OTHER_MARKER);
}

/** The free text of an "Other" answer: "Other: Ottawa" → "Ottawa". "" when it isn't one. */
export function otherText(value: string): string {
  return isOtherValue(value) ? value.slice(OTHER_MARKER.length).trim() : "";
}

export function isVisible(question: Question, answers: Answers): boolean {
  if (!question.showIf) return true;
  const controlling = answers[question.showIf.question];
  return typeof controlling === "string" && controlling.trim() === question.showIf.equals;
}

export function isAnswered(question: Question, value: AnswerValue | undefined): boolean {
  switch (question.type) {
    case "consent":
      return value === true;
    case "multi_choice":
      return Array.isArray(value) && value.length > 0;
    default:
      return typeof value === "string" && value.trim() !== "";
  }
}

/**
 * The problem with a text answer that is over its word limit, or null. The fields show this as
 * the applicant types, so going over is flagged straight away instead of at Submit. It leaves the
 * running count to the counter beside it, so the message stays the same while they edit.
 */
export function wordLimitError(
  question: ShortTextQuestion | ParagraphQuestion,
  value: string,
): string | null {
  if (question.maxWords === undefined) return null;
  return countWords(value) > question.maxWords
    ? `Please keep this to ${question.maxWords} words or fewer`
    : null;
}

function validateText(
  question: ShortTextQuestion | ParagraphQuestion,
  value: string,
): string | null {
  const maxChars =
    question.type === "paragraph" ? MAX_PARAGRAPH_CHARS : MAX_SHORT_TEXT_CHARS;
  if (value.length > maxChars) {
    return `Please keep this to ${maxChars.toLocaleString("en-CA")} characters or fewer`;
  }

  if (question.maxWords !== undefined) {
    const words = countWords(value);
    if (words > question.maxWords) {
      return `Please keep this to ${question.maxWords} words or fewer (you have ${words})`;
    }
  }

  if (question.type === "paragraph") return null;

  switch (question.inputType) {
    case "email":
      return EMAIL_PATTERN.test(value) ? null : "Please enter a valid email address";
    case "number": {
      if (!/^\d+$/.test(value)) return "Please enter a whole number";
      const age = Number(value);
      return age >= MIN_AGE && age <= MAX_AGE ? null : "Please enter a valid age";
    }
    case "tel": {
      const digits = value.replace(/\D/g, "").length;
      const valid =
        PHONE_PATTERN.test(value) &&
        digits >= MIN_PHONE_DIGITS &&
        digits <= MAX_PHONE_DIGITS;
      return valid ? null : "Please enter a valid phone number";
    }
    default:
      return null;
  }
}

function validateChoice(
  question: { options: Option[]; allowOther?: boolean },
  value: string,
): string | null {
  if (question.options.some((option) => option.value === value)) return null;
  if (question.allowOther && isOtherValue(value)) {
    const text = otherText(value);
    if (text === "") return "Please specify";
    return text.length > MAX_SHORT_TEXT_CHARS
      ? `Please keep this to ${MAX_SHORT_TEXT_CHARS} characters or fewer`
      : null;
  }
  return "Please choose one of the listed options";
}

function validateChoices(question: MultiChoiceQuestion, values: string[]): string | null {
  if (new Set(values).size !== values.length) return INVALID;
  if (question.maxSelect !== undefined && values.length > question.maxSelect) {
    return `Choose up to ${question.maxSelect}`;
  }
  if (values.filter(isOtherValue).length > 1) return INVALID;
  for (const value of values) {
    const error = validateChoice(question, value);
    if (error) return error;
  }
  return null;
}

/** A human-readable problem with this question's answer, or null when it is fine. */
export function validateQuestion(question: Question, answers: Answers): string | null {
  if (!isVisible(question, answers)) return null;
  // Untrusted input may carry null for "no answer"; treat it like a missing one.
  const value = answers[question.id] ?? undefined;

  switch (question.type) {
    case "consent":
      if (value !== undefined && typeof value !== "boolean") return INVALID;
      return question.required && value !== true ? "Please agree to continue" : null;

    case "multi_choice": {
      if (value === undefined) return question.required ? REQUIRED : null;
      if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
        return INVALID;
      }
      const values = value.map((item) => item.trim());
      if (values.length === 0) return question.required ? REQUIRED : null;
      return validateChoices(question, values);
    }

    default: {
      if (value === undefined) return question.required ? REQUIRED : null;
      if (typeof value !== "string") return INVALID;
      const text = value.trim();
      if (text === "") return question.required ? REQUIRED : null;
      return question.type === "short_text" || question.type === "paragraph"
        ? validateText(question, text)
        : validateChoice(question, text);
    }
  }
}

function collectErrors(questions: Question[], answers: Answers): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const question of questions) {
    const error = validateQuestion(question, answers);
    if (error) errors[question.id] = error;
  }
  return errors;
}

/** Errors keyed by question id; empty when the section is valid. */
export function validateSection(
  section: FormSection,
  answers: Answers,
): Record<string, string> {
  return collectErrors(section.questions, answers);
}

/** Errors keyed by question id; empty when the whole form is valid. */
export function validateForm(form: Form, answers: Answers): Record<string, string> {
  return collectErrors(
    form.flatMap((section) => section.questions),
    answers,
  );
}

function isEmpty(value: AnswerValue): boolean {
  return value === "" || (Array.isArray(value) && value.length === 0);
}

/**
 * The answers worth storing: only questions that exist in the form and are currently visible,
 * with strings trimmed and unanswered (empty) questions left out. Does not validate.
 */
export function visibleAnswers(form: Form, answers: Answers): Answers {
  const result: Answers = {};
  for (const section of form) {
    for (const question of section.questions) {
      if (!isVisible(question, answers)) continue;
      const raw = answers[question.id];
      if (raw === undefined || raw === null) continue;
      const value: AnswerValue =
        typeof raw === "string"
          ? raw.trim()
          : Array.isArray(raw)
            ? raw.map((item) => (typeof item === "string" ? item.trim() : item))
            : raw;
      if (!isEmpty(value)) result[question.id] = value;
    }
  }
  return result;
}

/** Sections shown as their own step of the form. */
export function stepSections(form: Form): FormSection[] {
  return form.filter((section) => section.placement !== "review");
}

/** Sections shown on the Review & submit page. */
export function reviewSections(form: Form): FormSection[] {
  return form.filter((section) => section.placement === "review");
}
