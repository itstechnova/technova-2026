import type { PolicySlug } from "./policies";

// The application form is data: sections of typed questions (lib/application/forms/*). The
// database only stores answers; prompts, options and section ids live in the client config.
// A question's `id` is the name of the column its answer is stored in.

export type Option = { value: string; label: string };

type QuestionBase = {
  /** Column name in `public.hacker` (or `public.user` when `table` is "user"). */
  id: string;
  prompt: string;
  /** Helper text under the prompt. */
  description?: string;
  required?: boolean;
  /** Only shown (and only validated/stored) when another question has this answer. */
  showIf?: { question: string; equals: string };
  /** Where the answer is stored. Defaults to "hacker". */
  table?: "hacker" | "user";
  /**
   * Links shown with the question, e.g. the MLH policies next to a consent. With `policy`, the
   * document opens in a popup over the form (lib/application/policies.ts); `href` stays the
   * address of the original.
   */
  links?: { label: string; href: string; policy?: PolicySlug }[];
};

export type ShortTextQuestion = QuestionBase & {
  type: "short_text";
  placeholder?: string;
  inputType?: "text" | "email" | "tel" | "number";
  maxWords?: number;
};

export type ParagraphQuestion = QuestionBase & {
  type: "paragraph";
  placeholder?: string;
  maxWords?: number;
};

/** Radio group, for short option lists. */
export type SingleChoiceQuestion = QuestionBase & {
  type: "single_choice";
  options: Option[];
  /** Adds an "Other" option with a free-text field; stored as `Other: <text>`. */
  allowOther?: boolean;
};

/** Select menu, for long option lists (programs, countries). */
export type DropdownQuestion = QuestionBase & {
  type: "dropdown";
  options: Option[];
  placeholder?: string;
  /** The options are whole numbers and the column is numeric (e.g. `age`). */
  numeric?: boolean;
};

/** Lists too long to ship with the form; served by /api/lists/[list] (lib/application/lists.ts). */
export type ListName = "schools";

/**
 * Search-and-pick from one of those lists. The answer is an entry of the list, or `otherValue`
 * when the form offers a way out for something that isn't listed.
 */
export type LookupQuestion = QuestionBase & {
  type: "lookup";
  list: ListName;
  placeholder?: string;
  /** Always offered under the matches, e.g. "Other". */
  otherValue?: string;
};

/** Checkbox group. */
export type MultiChoiceQuestion = QuestionBase & {
  type: "multi_choice";
  options: Option[];
  maxSelect?: number;
  /** Adds an "Other" option with a free-text field; stored as `Other: <text>`. */
  allowOther?: boolean;
};

/** A single checkbox the applicant agrees to. `prompt` is what they agree to. */
export type ConsentQuestion = QuestionBase & {
  type: "consent";
  /** Text beside the checkbox. Defaults to "I agree". */
  checkboxLabel?: string;
};

export type Question =
  | ShortTextQuestion
  | ParagraphQuestion
  | SingleChoiceQuestion
  | DropdownQuestion
  | LookupQuestion
  | MultiChoiceQuestion
  | ConsentQuestion;

export type QuestionType = Question["type"];

/** short_text / paragraph / single_choice / dropdown / lookup: string. multi_choice: string[]. consent: boolean. */
export type AnswerValue = string | string[] | boolean;
export type Answers = Record<string, AnswerValue | undefined>;

export type FormSection = {
  id: string;
  title: string;
  /** Short label for the stepper. Defaults to `title`. */
  shortTitle?: string;
  description?: string;
  /** "review": rendered on the Review & submit page ("Before you submit") instead of as its own step. */
  placement?: "step" | "review";
  questions: Question[];
};

export type Form = FormSection[];

/** Prefix of a free-text "Other" answer, e.g. "Other: Ottawa". */
export const OTHER_PREFIX = "Other: ";

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };
