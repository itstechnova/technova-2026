import type { PolicySlug } from "./policies";

// The application form is data: sections of typed questions (lib/application/forms/*). The
// database only stores answers; prompts, options and section ids live in the client config.
// A question's `id` is the name of the column its answer is stored in.

export type Option = { value: string; label: string };

type QuestionBase = {
  /** Column name in the application's own table (`public.hacker`, `public.volunteer`, …), or in `public.user` when `table` is "user". */
  id: string;
  prompt: string;
  /** Helper text under the prompt. */
  description?: string;
  required?: boolean;
  /** Only shown (and only validated/stored) when another question has this answer. */
  showIf?: { question: string; equals: string };
  /** "user": stored on the applicant's `public.user` profile row, shared by every application. */
  table?: "user";
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

/** Select menu, for long option lists (institutions, programs). */
export type DropdownQuestion = QuestionBase & {
  type: "dropdown";
  options: Option[];
  placeholder?: string;
};

/** Checkbox group. */
export type MultiChoiceQuestion = QuestionBase & {
  type: "multi_choice";
  options: Option[];
  maxSelect?: number;
  /** Adds an "Other" option with a free-text field; stored as `Other: <text>`. */
  allowOther?: boolean;
};

/** A single checkbox the applicant agrees to. */
export type ConsentQuestion = QuestionBase & {
  type: "consent";
};

/**
 * A grid of checkboxes: one row per `rows` option, one column per `columns` option. The answer is
 * the list of ticked cells, each stored as readable text (see `gridCellValue`), e.g. "Sat 5 PM – 9 PM".
 */
export type CheckboxGridQuestion = QuestionBase & {
  type: "checkbox_grid";
  rows: Option[];
  columns: Option[];
  /** Cells that don't exist (e.g. times outside the event), as `gridCellValue` strings. */
  skip?: string[];
};

/**
 * A file uploaded to Supabase Storage as soon as it is picked. The answer is the object's path in
 * `bucket`: `<user id>/<question id>/<timestamp>-<file name>`.
 */
export type FileQuestion = QuestionBase & {
  type: "file";
  bucket: string;
  /** Allowed extensions, lowercase with the dot: [".pdf", ".docx"]. */
  accept: string[];
  maxBytes: number;
};

export type Question =
  | ShortTextQuestion
  | ParagraphQuestion
  | SingleChoiceQuestion
  | DropdownQuestion
  | MultiChoiceQuestion
  | ConsentQuestion
  | CheckboxGridQuestion
  | FileQuestion;

export type QuestionType = Question["type"];

/** short_text / paragraph / single_choice / dropdown / file: string. multi_choice / checkbox_grid: string[]. consent: boolean. */
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

/** The stored value of one checkbox-grid cell: column then row, e.g. "Sat 5 PM – 9 PM". */
export const gridCellValue = (column: Option, row: Option) => `${column.value} ${row.value}`;

/** Prefix of a free-text "Other" answer, e.g. "Other: Ottawa". */
export const OTHER_PREFIX = "Other: ";

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };
