// The judge application (TechNova 6). Same shape as the hacker, volunteer and mentor forms:
// question ids are column names in public.judge, or in public.user for the shared profile questions.

import type { Form } from "../types";
import { toOptions } from "./options";
import { HEARD_FROM_OPTIONS, age, codeOfConduct, firstName, lastName, pronouns, resume } from "./shared";

/** Stored value of the conflict-of-interest answer that reveals the explanation question. */
const CONFLICT_YES = "Yes (please explain below)";

export const judgeForm: Form = [
  {
    id: "welcome",
    title: "Welcome to TechNova!",
    shortTitle: "Welcome",
    description:
      "Hello! We're now accepting applications for hackathon judges. If you have strong technical or hackathon experience and will be available to join us in person, please fill out the form below.",
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
      {
        id: "role_and_organization",
        type: "short_text",
        prompt: "What is your current role and company or school?",
        description: "e.g. Software Engineer at Company X, or 4th-year Computer Science at University Y",
        required: true,
      },
      {
        id: "links",
        type: "short_text",
        prompt: "LinkedIn, GitHub, or portfolio link",
      },
    ],
  },
  {
    id: "experience",
    title: "Experience",
    questions: [
      { ...resume, prompt: "Please attach your resume below." },
      {
        id: "judging_experience",
        type: "single_choice",
        prompt: "Do you have any previous experience judging hackathons or competitions?",
        required: true,
        options: toOptions(["Yes", "No"]),
      },
      {
        id: "judging_experience_details",
        type: "paragraph",
        prompt: "Please list the events and your role.",
        showIf: { question: "judging_experience", equals: "Yes" },
      },
      {
        id: "judging_areas",
        type: "multi_choice",
        prompt: "Which areas are you most comfortable evaluating projects in?",
        description: "Select all that apply.",
        required: true,
        allowOther: true,
        options: toOptions([
          "Frontend",
          "Backend",
          "Infrastructure",
          "Mobile Development",
          "Data Science, Machine Learning",
          "Design, UI/UX",
          "Hardware/IoT",
          "Game Development",
          "Pitch and Presentation",
          "Business Impact and Ideation",
        ]),
      },
    ],
  },
  {
    id: "judging",
    title: "Judging",
    questions: [
      {
        id: "why_judge",
        type: "paragraph",
        prompt: "Why are you interested in being a judge at TechNova?",
        required: true,
      },
      {
        id: "standout_qualities",
        type: "paragraph",
        prompt: "What qualities do you look for in a standout hackathon project?",
        required: true,
      },
      {
        id: "constructive_feedback",
        type: "paragraph",
        prompt: "How would you give constructive feedback to a team whose project didn't work as planned?",
        required: true,
      },
    ],
  },
  {
    id: "final",
    title: "Almost Done!",
    shortTitle: "Final questions",
    questions: [
      {
        id: "in_person",
        type: "single_choice",
        prompt:
          "Are you available to attend the hackathon in person in Waterloo on Sunday, Jan 24, from 11:00 AM to 5:00 PM?",
        required: true,
        options: toOptions(["Yes", "No"]),
      },
      {
        id: "briefing_session",
        type: "single_choice",
        prompt: "Are you able to attend a judge briefing session before the event?",
        required: true,
        options: toOptions(["Yes", "No", "Maybe"]),
      },
      {
        id: "conflict_of_interest",
        type: "single_choice",
        prompt:
          "Have you ever worked for, or have a conflict of interest with, any sponsoring company or participating team?",
        required: true,
        options: toOptions([CONFLICT_YES, "No"]),
      },
      {
        id: "conflict_details",
        type: "paragraph",
        prompt: "Please explain your conflict of interest.",
        required: true,
        showIf: { question: "conflict_of_interest", equals: CONFLICT_YES },
      },
      {
        id: "heard_from",
        type: "single_choice",
        prompt: "Where did you hear about this opportunity?",
        allowOther: true,
        options: toOptions([...HEARD_FROM_OPTIONS, "Corporate Opportunity"]),
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
      {
        ...codeOfConduct,
        prompt:
          "I agree to uphold the MLH Code of Conduct and TechNova's values, and to judge fairly and without bias.",
      },
    ],
  },
];
