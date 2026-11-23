// The volunteer application (TechNova 6). Same shape as forms/hacker.ts: question ids are column
// names in public.volunteer, or in public.user for the shared profile questions.

import type { Form } from "../types";
import { toOptions } from "./options";
import {
  HEARD_FROM_OPTIONS,
  age,
  codeOfConduct,
  firstName,
  genderIdentityOpen,
  lastName,
  phoneNumber,
  pronouns,
  resume,
  shirtSize,
  unavailableTimes,
} from "./shared";

export const volunteerForm: Form = [
  {
    id: "welcome",
    title: "Welcome to TechNova!",
    shortTitle: "Welcome",
    description:
      "Thank you for your interest in volunteering at TechNova! Volunteers help the event run smoothly and are a key point of contact between hackers and organizers. Please have your resume ready to upload before starting.",
    questions: [
      {
        id: "contact_email",
        type: "short_text",
        inputType: "email",
        prompt: "Email address",
        description:
          "Please provide an email address where we can reach you and send application updates.",
        required: true,
      },
      age,
    ],
  },
  {
    id: "about",
    title: "General Questions",
    shortTitle: "About you",
    description: "These are some basic questions to get to know you better!",
    questions: [
      firstName,
      lastName,
      pronouns,
      phoneNumber,
      genderIdentityOpen,
    ],
  },
  {
    id: "availability",
    title: "Availability",
    description: "TechNova runs from Friday, January 22 at 5:00 PM to Sunday, January 24 at 5:00 PM.",
    questions: [
      {
        id: "in_person",
        type: "single_choice",
        prompt: "Are you able to volunteer in person in Waterloo for the duration of the hackathon?",
        description: "All volunteers must be in person.",
        required: true,
        options: toOptions(["Yes", "No", "Maybe"]),
      },
      unavailableTimes,
      shirtSize,
    ],
  },
  {
    id: "experience",
    title: "Experience",
    questions: [
      resume,
      {
        id: "volunteer_experience",
        type: "paragraph",
        prompt: "Please describe any volunteering, event, or leadership experience you have.",
        description: "e.g. Hackathon X – Volunteer, Club Y – Events Coordinator. Put N/A if not applicable.",
        required: true,
      },
      {
        id: "hackathon_experience",
        type: "single_choice",
        prompt: "Have you attended a hackathon before?",
        required: true,
        allowOther: true,
        options: toOptions(["Yes, as a hacker", "Yes, as a mentor or volunteer", "No, never"]),
      },
      {
        id: "why_volunteer",
        type: "paragraph",
        prompt: "Why do you want to volunteer at TechNova?",
        required: true,
        maxWords: 200,
      },
      {
        id: "interested_areas",
        type: "multi_choice",
        prompt: "Which areas are you interested in helping with?",
        description: "Select all that apply.",
        required: true,
        allowOther: true,
        options: toOptions([
          "Workshop Assistant",
          "Food Bearer",
          "Setup + Clean-up",
          "Ceremonies",
          "Community Events",
          "Check-in + Swag",
          "Tech Support",
        ]),
      },
    ],
  },
  {
    id: "final",
    title: "Almost Done!",
    shortTitle: "Final questions",
    questions: [
      {
        id: "onboarding_session",
        type: "single_choice",
        prompt: "Do you agree to attend a volunteer onboarding session?",
        required: true,
        options: toOptions([
          "Yes, I will attend",
          "If unable to attend, I will watch the recording afterwards",
        ]),
      },
      {
        id: "heard_from",
        type: "single_choice",
        prompt: "Where did you hear about this opportunity?",
        required: true,
        allowOther: true,
        options: toOptions(HEARD_FROM_OPTIONS),
      },
      {
        id: "additional_comments",
        type: "paragraph",
        prompt: "Any additional comments?",
        description: "e.g. specific availability, questions, ideas…",
      },
    ],
  },
  {
    id: "agreements",
    title: "Before you submit",
    placement: "review",
    questions: [
      codeOfConduct,
    ],
  },
];
