"use client";

import { ResumeControl, useResumeUpload } from "@/components/resume/ResumeControl";
import type { FileQuestion } from "@/lib/application/types";

import { describedBy, QuestionShell, useFieldIds } from "./QuestionShell";

export type FileUploadFieldProps = {
  question: FileQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

/**
 * A file question. The only one is the resume, which is saved to the applicant's account as soon
 * as it uploads; the answer kept in the draft is its path, so the draft never holds the file.
 */
export function FileUploadField({ question, value = "", onChange, error, disabled }: FileUploadFieldProps) {
  const ids = useFieldIds(question);
  const state = useResumeUpload(question, onChange);
  const shownError = state.error ?? error;

  return (
    <QuestionShell question={question} ids={ids} error={shownError}>
      <ResumeControl
        question={question}
        value={value}
        state={state}
        id={ids.control}
        describedBy={describedBy(question, ids, { error: shownError })}
        invalid={Boolean(shownError)}
        disabled={disabled}
      />
    </QuestionShell>
  );
}
