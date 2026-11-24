// Turns a stored answer back into display text, for the review page and the read-only view.

import type { AnswerValue, Option, Question } from "./types";
import { fileNameFromPath } from "./validate";

const EMPTY = "—";

function optionLabel(options: Option[], value: string): string {
  // "Other: <text>" answers have no matching option and are shown as stored.
  return options.find((option) => option.value === value)?.label ?? value;
}

export function formatAnswer(question: Question, value: AnswerValue | undefined): string {
  if (question.type === "consent") return value === true ? "Agreed" : "Not agreed";

  if (Array.isArray(value)) {
    const items = value.map((item) => String(item).trim()).filter((item) => item !== "");
    if (items.length === 0) return EMPTY;
    const labels =
      question.type === "multi_choice"
        ? items.map((item) => optionLabel(question.options, item))
        : items;
    return labels.join(", ");
  }

  if (typeof value !== "string" || value.trim() === "") return EMPTY;
  const text = value.trim();

  switch (question.type) {
    case "single_choice":
    case "dropdown":
      return optionLabel(question.options, text);
    case "file":
      return fileNameFromPath(text);
    default:
      return text;
  }
}
