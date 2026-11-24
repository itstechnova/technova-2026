// Questions that every TechNova application asks (hacker today; mentor and volunteer later).
// Import the ones a form needs and list them in its sections.

import type {
  ConsentQuestion,
  FileQuestion,
  ShortTextQuestion,
  SingleChoiceQuestion,
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

export const firstName: ShortTextQuestion = {
  id: "first_name",
  type: "short_text",
  table: "user",
  prompt: "What's your first name?",
  placeholder: "e.g. Jane",
  required: true,
};

export const lastName: ShortTextQuestion = {
  id: "last_name",
  type: "short_text",
  table: "user",
  prompt: "What's your last name?",
  placeholder: "e.g. Smith",
  required: true,
};

export const pronouns: ShortTextQuestion = {
  id: "pronouns",
  type: "short_text",
  table: "user",
  prompt: "What are your pronouns?",
  placeholder: "e.g. she/her/hers (all lowercase)",
};

export const phoneNumber: ShortTextQuestion = {
  id: "phone_number",
  type: "short_text",
  inputType: "tel",
  table: "user",
  prompt: "What is your phone number?",
  placeholder: "Your phone number",
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
  options: toOptions(["XS", "S", "M", "L", "XL", "2XL", "3XL"]),
};

// Kept on the applicant's public.user row, like the other profile details, so it can be added or
// replaced from Profile & settings at any time (including after the application is submitted).
// Required to submit; the column itself stays nullable, for applications sent before it was asked.
// The `resumes` bucket has the same limits as `accept` and `maxBytes`.
export const resume: FileQuestion = {
  id: "resume_path",
  type: "file",
  table: "user",
  prompt: "Upload your resume",
  description: "PDF or Word (.docx), up to 10 MB. You can replace it later in Profile & settings.",
  required: true,
  bucket: "resumes",
  accept: [".pdf", ".docx"],
  maxBytes: 10 * 1024 * 1024,
};

export const genderIdentity: SingleChoiceQuestion = {
  id: "gender_identity",
  type: "single_choice",
  table: "user",
  prompt: "What is your gender identity?",
  required: true,
  options: [
    ...toOptions(["Female", "Male", "Non-binary"]),
    {
      value: GENDER_NOT_LISTED,
      label: "Not listed here (please specify in the next question)",
    },
  ],
};

// The three MLH checkboxes. Their wording is MLH's and has to match it:
// https://guide.mlh.com/general-information/managing-registrations/registrations
export const mlhCodeOfConduct: ConsentQuestion = {
  id: "mlh_code_of_conduct",
  type: "consent",
  prompt: "I have read and agree to the MLH Code of Conduct.",
  checkboxLabel: "I agree!",
  required: true,
  links: [policyLink("mlh-code-of-conduct")],
};

export const mlhDataSharing: ConsentQuestion = {
  id: "mlh_data_sharing",
  type: "consent",
  prompt:
    "I authorize you to share my application/registration information with Major League Hacking for event administration, ranking, and administration (including the creation of linked accounts on MLH and DEV (dev.to)) in line with the MLH Privacy Policy. I further agree to the terms of both the MLH Contest Terms and Conditions and the MLH Privacy Policy.",
  checkboxLabel: "I agree!",
  required: true,
  links: [policyLink("mlh-privacy-policy"), policyLink("mlh-contest-terms")],
};

export const mlhEmails: ConsentQuestion = {
  id: "mlh_emails",
  type: "consent",
  prompt:
    "I authorize MLH + DEV to send me occasional emails about relevant events, career opportunities, and community announcements.",
  checkboxLabel: "I agree!",
};
