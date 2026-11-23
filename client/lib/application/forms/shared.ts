// Questions that several TechNova applications ask (hacker, volunteer, mentor, judge).
// Import the ones a form needs and list them in its sections.

import {
  gridCellValue,
  type CheckboxGridQuestion,
  type ConsentQuestion,
  type FileQuestion,
  type Option,
  type ShortTextQuestion,
  type SingleChoiceQuestion,
} from "../types";
import { POLICIES, type PolicySlug } from "../policies";
import { toOptions } from "./options";

/** A link that opens one of the policy documents in a popup over the form. */
const policyLink = (policy: PolicySlug) => ({
  label: POLICIES[policy].title,
  href: POLICIES[policy].href,
  policy,
});

/** Stored value of the gender option that reveals the free-text follow-up question. */
export const GENDER_NOT_LISTED = "Not listed here";

/** Stored as a smallint; validated as a whole number between 10 and 100 (validate.ts). */
export const age: ShortTextQuestion = {
  id: "age",
  type: "short_text",
  inputType: "number",
  prompt: "How old will you be as of January 22, 2027?",
  required: true,
};

export const firstName: ShortTextQuestion = {
  id: "first_name",
  type: "short_text",
  table: "user",
  prompt: "What's your first name?",
  description: "e.g. Jane",
  required: true,
};

export const lastName: ShortTextQuestion = {
  id: "last_name",
  type: "short_text",
  table: "user",
  prompt: "What's your last name?",
  description: "e.g. Smith",
  required: true,
};

export const pronouns: ShortTextQuestion = {
  id: "pronouns",
  type: "short_text",
  table: "user",
  prompt: "What are your pronouns?",
  description: "e.g. she/her/hers (all lowercase)",
};

export const phoneNumber: ShortTextQuestion = {
  id: "phone_number",
  type: "short_text",
  inputType: "tel",
  table: "user",
  prompt: "What is your phone number?",
  required: true,
};

export const shirtSize: SingleChoiceQuestion = {
  id: "shirt_size",
  type: "single_choice",
  table: "user",
  prompt: "What t-shirt size are you?",
  description:
    "Unisex sizing. Measurements are given in inches. Please note that size availability may vary.",
  required: true,
  options: toOptions(["XS", "S", "M", "L", "XL", "XXL"]),
};

export const genderIdentity: SingleChoiceQuestion = {
  id: "gender_identity",
  type: "single_choice",
  table: "user",
  prompt: "What is your gender identity?",
  options: [
    ...toOptions(["Female", "Male", "Non-binary"]),
    {
      value: GENDER_NOT_LISTED,
      label: "Not listed here (please specify in the next question)",
    },
  ],
};

export const mlhCodeOfConduct: ConsentQuestion = {
  id: "mlh_code_of_conduct",
  type: "consent",
  prompt: "I have read and agree to the MLH Code of Conduct.",
  required: true,
  links: [policyLink("mlh-code-of-conduct")],
};

export const mlhDataSharing: ConsentQuestion = {
  id: "mlh_data_sharing",
  type: "consent",
  prompt:
    "I authorize you to share my application/registration information with Major League Hacking for event administration, ranking, and MLH administration in-line with the MLH Privacy Policy. I further agree to the terms of both the MLH Contest Terms and Conditions and the MLH Privacy Policy.",
  required: true,
  links: [policyLink("mlh-privacy-policy"), policyLink("mlh-contest-terms")],
};

export const mlhEmails: ConsentQuestion = {
  id: "mlh_emails",
  type: "consent",
  prompt:
    "I authorize MLH to send me occasional emails about relevant events, career opportunities, and community announcements.",
};

/**
 * Gender identity as the volunteer/mentor/judge forms ask it (the hacker form uses `genderIdentity`).
 * Same `public.user` column, different options.
 */
export const genderIdentityOpen: SingleChoiceQuestion = {
  id: "gender_identity",
  type: "single_choice",
  table: "user",
  prompt: "What is your gender identity?",
  required: true,
  allowOther: true,
  options: toOptions(["Woman", "Non-binary", "Man", "Prefer not to specify"]),
};

// The event runs Fri Jan 22, 5 PM to Sun Jan 24, 5 PM. A day's "Overnight" row is the night
// that follows its "Late night" row, so the rows of one column read in time order.
const DAYS = toOptions(["Fri", "Sat", "Sun"]);
const TIME_SLOTS: Option[] = [
  { value: "8 AM – 12 PM", label: "Morning (8 AM – 12 PM)" },
  { value: "12 PM – 5 PM", label: "Afternoon (12 PM – 5 PM)" },
  { value: "5 PM – 9 PM", label: "Evening (5 PM – 9 PM)" },
  { value: "9 PM – 1 AM", label: "Late night (9 PM – 1 AM)" },
  { value: "1 AM – 8 AM", label: "Overnight (1 AM – 8 AM)" },
];
const [fri, , sun] = DAYS;
const [morning, afternoon, evening, lateNight, overnight] = TIME_SLOTS;
// Before the event starts on Friday and after it ends on Sunday.
const OUTSIDE_EVENT = [
  gridCellValue(fri, morning),
  gridCellValue(fri, afternoon),
  gridCellValue(sun, evening),
  gridCellValue(sun, lateNight),
  gridCellValue(sun, overnight),
];

export const unavailableTimes: CheckboxGridQuestion = {
  id: "unavailable_times",
  type: "checkbox_grid",
  prompt: "Please indicate the times you are NOT available during the event.",
  description:
    "These are to gauge availability and are not binding. Leave everything unticked if you're available the whole time.",
  rows: TIME_SLOTS,
  columns: DAYS,
  skip: OUTSIDE_EVENT,
};

export const resume: FileQuestion = {
  id: "resume_path",
  type: "file",
  prompt: "Please upload your resume.",
  description: "PDF or Word (.docx), up to 10 MB.",
  required: true,
  bucket: "resumes",
  accept: [".pdf", ".docx"],
  maxBytes: 10 * 1024 * 1024,
};

export const codeOfConduct: ConsentQuestion = {
  id: "code_of_conduct",
  type: "consent",
  prompt: "I agree to uphold the MLH Code of Conduct and TechNova's values throughout the event.",
  required: true,
  links: [policyLink("mlh-code-of-conduct")],
};

/** "Where did you hear about this opportunity?" options for the volunteer/mentor/judge forms. */
export const HEARD_FROM_OPTIONS = [
  "LinkedIn",
  "Instagram",
  "Word of Mouth",
  "Email/Mailing List",
  "University Student Organization/Club",
] as const;
