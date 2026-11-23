// The mentor application (TechNova 6). Same shape as forms/hacker.ts and forms/volunteer.ts:
// question ids are column names in public.mentor, or in public.user for the shared profile questions.

import type { Form } from "../types";
import { toOptions } from "./options";
import {
  HEARD_FROM_OPTIONS,
  age,
  firstName,
  genderIdentityOpen,
  lastName,
  phoneNumber,
  pronouns,
  resume,
  shirtSize,
  unavailableTimes,
} from "./shared";

export const mentorForm: Form = [
  {
    id: "welcome",
    title: "Welcome to TechNova!",
    shortTitle: "Welcome",
    description:
      "Thank you for your interest in mentoring at TechNova! Mentors guide hacker teams, answer technical questions, and help hackers grow their skills. Please have your resume ready to upload before starting.",
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
    questions: [firstName, lastName, pronouns, phoneNumber, genderIdentityOpen],
  },
  {
    id: "availability",
    title: "Availability",
    description: "TechNova runs from Friday, January 22 at 5:00 PM to Sunday, January 24 at 5:00 PM.",
    questions: [
      {
        id: "in_person",
        type: "single_choice",
        prompt: "Are you able to mentor in person in Waterloo for the hackathon?",
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
        id: "mentor_type",
        type: "single_choice",
        prompt: "I am an...",
        required: true,
        allowOther: true,
        options: toOptions(["Industry professional", "Upper-year post-secondary student"]),
      },
      {
        id: "hackathon_experience",
        type: "single_choice",
        prompt: "I have...",
        required: true,
        allowOther: true,
        options: toOptions([
          "Attended a hackathon as a hacker",
          "Attended a hackathon as a mentor",
          "Never been to a hackathon before",
        ]),
      },
      {
        id: "mentoring_experience",
        type: "paragraph",
        prompt: "Please list any experience you have mentoring an individual or group.",
        description: "e.g. Hackathon X – Mentor, Robotics Team – Mentor. Put N/A if not applicable.",
        required: true,
      },
      {
        id: "mentoring_areas",
        type: "multi_choice",
        prompt: "Which areas do you have experience in and feel comfortable mentoring?",
        description: "Select all that apply.",
        required: true,
        allowOther: true,
        options: toOptions([
          "Design, UI/UX",
          "Frontend",
          "Backend",
          "Infrastructure",
          "Mobile Development",
          "Data Science, Machine Learning",
          "Project Development and Ideation",
          "Pitch Development",
          "Hardware/IoT",
          "General Hacker Support",
          "Game Development",
        ]),
      },
      {
        id: "tech_stacks",
        type: "paragraph",
        prompt: "Are there any specific languages, tech stacks, or tools you want to mentor in?",
      },
    ],
  },
  {
    id: "final",
    title: "Almost Done!",
    shortTitle: "Final questions",
    questions: [
      {
        id: "other_roles",
        type: "multi_choice",
        prompt: "Beyond mentoring, are you interested in helping with any of the following?",
        description: "Not binding.",
        options: toOptions([
          "Workshop Host",
          "Workshop Mentor",
          "Community Lead",
          "Resume Critiquer",
          "Panel Speaker",
          "Judge",
          "I'm open to any role, as long as I'm available",
        ]),
      },
      {
        id: "onboarding_session",
        type: "single_choice",
        prompt: "Do you agree to attend a mentor onboarding session?",
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
        options: toOptions([...HEARD_FROM_OPTIONS, "Corporate Opportunity"]),
      },
      {
        id: "volunteer_if_not_chosen",
        type: "single_choice",
        prompt: "Are you interested in participating as a volunteer if not chosen as a mentor?",
        required: true,
        options: toOptions(["Yes", "No"]),
      },
      {
        id: "links",
        type: "short_text",
        prompt: "Any links you'd like to share?",
        description: "LinkedIn, portfolio, website, etc.",
      },
      {
        id: "additional_comments",
        type: "paragraph",
        prompt: "Any additional comments?",
        description: "e.g. specific availability, questions, ideas…",
      },
    ],
  },
];
