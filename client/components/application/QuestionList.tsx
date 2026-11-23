"use client";

import { QuestionField } from "@/components/application/questions/QuestionField";
import type { AnswerValue, Answers, Question } from "@/lib/application/types";
import { isVisible } from "@/lib/application/validate";

/** Scrolls to a question rendered by `QuestionList` and focuses its first control. */
export function focusQuestion(id: string) {
  const wrapper = document.querySelector<HTMLElement>(`[data-question="${CSS.escape(id)}"]`);
  if (!wrapper) return;
  wrapper.scrollIntoView({ block: "center" });
  wrapper.querySelector<HTMLElement>("input, select, textarea")?.focus({ preventScroll: true });
}

/** The visible questions of a section, each wired to the draft's answers and errors. */
export function QuestionList({
  questions,
  answers,
  errors,
  disabled,
  onChange,
}: {
  questions: Question[];
  answers: Answers;
  errors: Record<string, string>;
  disabled?: boolean;
  onChange: (id: string, value: AnswerValue) => void;
}) {
  return (
    <div className="flex flex-col gap-5 xl:gap-6">
      {questions
        .filter((question) => isVisible(question, answers))
        .map((question) => (
          <div
            key={question.id}
            data-question={question.id}
            className="min-w-0 scroll-mt-24 scroll-mb-28"
          >
            <QuestionField
              question={question}
              value={answers[question.id]}
              onChange={(value) => onChange(question.id, value)}
              error={errors[question.id]}
              disabled={disabled}
            />
          </div>
        ))}
    </div>
  );
}
