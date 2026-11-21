"use client";

import { QuestionField } from "@/components/application/questions/QuestionField";
import type { AnswerValue, Answers, Question } from "@/lib/application/types";
import { isVisible } from "@/lib/application/validate";

// Short single-line questions sit two per row (Figma frame 05a) when the form column itself is wide
// enough (a container query: the sidebar makes the viewport a poor guide); the rest are full width.
const MAX_HALF_WIDTH_PROMPT = 48;
const isHalfWidth = (question: Question) =>
  (question.type === "short_text" || question.type === "dropdown") &&
  !question.description &&
  !("maxWords" in question && question.maxWords) &&
  question.prompt.length <= MAX_HALF_WIDTH_PROMPT;

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
    <div className="@container">
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 @2xl:grid-cols-2 xl:gap-y-5">
      {questions
        .filter((question) => isVisible(question, answers))
        .map((question) => (
          <div
            key={question.id}
            data-question={question.id}
            className={`min-w-0 scroll-mt-24 scroll-mb-28 ${isHalfWidth(question) ? "" : "@2xl:col-span-2"}`}
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
    </div>
  );
}
