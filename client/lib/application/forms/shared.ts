// Questions that every TechNova application asks (hacker today; mentor and volunteer later).
// Import the ones a form needs and list them in its sections.

import type {
  ConsentQuestion,
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
