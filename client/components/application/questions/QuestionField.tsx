"use client";

import type { AnswerValue, Question } from "@/lib/application/types";

import { ConsentField } from "./ConsentField";
import { DropdownField } from "./DropdownField";
import { LookupField } from "./LookupField";
import { MultiChoiceField } from "./MultiChoiceField";
import { ParagraphField } from "./ParagraphField";
import { ShortTextField } from "./ShortTextField";
import { SingleChoiceField } from "./SingleChoiceField";

export type QuestionFieldProps = {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  error?: string;
  disabled?: boolean;
};

// Answers come from localStorage drafts, so a value of the wrong shape is treated as empty.
const asString = (value: AnswerValue | undefined) => (typeof value === "string" ? value : undefined);
const asList = (value: AnswerValue | undefined) =>
  Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : undefined;
const asBoolean = (value: AnswerValue | undefined) => (typeof value === "boolean" ? value : undefined);

/** Renders one question of a form config with the component for its type. */
export function QuestionField({ question, value, onChange, error, disabled }: QuestionFieldProps) {
  const shared = { onChange, error, disabled };

  switch (question.type) {
    case "short_text":
      return <ShortTextField question={question} value={asString(value)} {...shared} />;
    case "paragraph":
      return <ParagraphField question={question} value={asString(value)} {...shared} />;
    case "single_choice":
      return <SingleChoiceField question={question} value={asString(value)} {...shared} />;
    case "dropdown":
      return <DropdownField question={question} value={asString(value)} {...shared} />;
    case "lookup":
      return <LookupField question={question} value={asString(value)} {...shared} />;
    case "multi_choice":
      return <MultiChoiceField question={question} value={asList(value)} {...shared} />;
    case "consent":
      return <ConsentField question={question} value={asBoolean(value)} {...shared} />;
    default: {
      // Adding a question type to the union is a compile error here until it has a component.
      const unhandled: never = question;
      return unhandled;
    }
  }
}
