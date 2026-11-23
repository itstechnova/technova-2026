// The hacker application: one entry per section, in the order applicants see them.
// Question ids are the database column names; see ../types.ts for the question shapes.

import type { Form } from "../types";
import { OTHER_INSTITUTION, institutions, programs, toOptions } from "./options";
import {
  GENDER_NOT_LISTED,
  age,
  firstName,
  genderIdentity,
  lastName,
  mlhCodeOfConduct,
  mlhDataSharing,
  mlhEmails,
  phoneNumber,
  pronouns,
  shirtSize,
} from "./shared";

export const hackerForm: Form = [
  {
    id: "welcome",
    title: "Welcome to TechNova!",
    shortTitle: "Welcome",
    description:
      "Thanks for your interest in attending TechNova, the University of Waterloo's Women+ in Tech Hackathon!\n\nOur in-person event is open to women and non-binary identifying students. Student attendees may be enrolled at a university or a non-traditional institution (code bootcamp, homeschool, online program, etc.).",
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
    id: "general",
    title: "General Questions",
    shortTitle: "About you",
    description: "These are some basic questions to get to know you better!",
    questions: [
      firstName,
      lastName,
      pronouns,
      phoneNumber,
      {
        id: "transportation",
        type: "single_choice",
        prompt:
          "Would you require transportation to travel to Waterloo for TechNova on January 22, 2027? If so, where would you be located?",
        description: "Please note that transportation is not guaranteed.",
        required: true,
        allowOther: true,
        options: toOptions([
          "No, I don't require transportation",
          "Toronto",
          "Mississauga/Brampton",
          "Markham",
          "Richmond Hill",
          "London/Windsor area",
        ]),
      },
      shirtSize,
      {
        id: "level_of_study",
        type: "single_choice",
        prompt: "What is your current level of study?",
        description:
          "If you are between levels, please select the level you will be entering in the upcoming fall term.",
        required: true,
        allowOther: true,
        options: toOptions([
          "Less than Secondary / High School",
          "Secondary / High School",
          "Undergraduate University (2 year — community college or similar)",
          "Undergraduate University (3+ year)",
          "Graduate University (Masters, Professional, Doctoral, etc.)",
          "Code School / Bootcamp",
          "Other Vocational / Trade Program or Apprenticeship",
          "Post Doctorate",
          "I'm not currently a student",
          "Prefer not to answer",
        ]),
      },
      {
        id: "graduation_year",
        type: "single_choice",
        prompt: "What year will you be graduating?",
        description: "Please answer based on the education level you selected above.",
        required: true,
        allowOther: true,
        options: toOptions(["2022", "2023", "2024", "2025", "2026", "2027", "2028+"]),
      },
      {
        id: "school",
        type: "dropdown",
        prompt: "Please select which institution you are/will be attending.",
        description: "If you attend a school or program not listed, select Other.",
        required: true,
        options: institutions,
      },
      {
        id: "school_other",
        type: "short_text",
        prompt: 'If you selected "Other," what is the name of your school?',
        description:
          "Please provide the institution's name as it would appear on Google (e.g. University of ABC, XYZ Bootcamp).",
        showIf: { question: "school", equals: OTHER_INSTITUTION },
      },
      {
        id: "major",
        type: "dropdown",
        prompt: "What program are you in?",
        description:
          "If you are in high school, select your program of interest. If you don't see your exact program, select the closest option.",
        required: true,
        options: programs,
      },
      {
        id: "hackathons_attended",
        type: "single_choice",
        prompt: "How many hackathons have you been to?",
        required: true,
        options: toOptions(["This will be my first!", "1", "2", "3", "4+"]),
      },
      {
        id: "heard_from",
        type: "multi_choice",
        prompt: "How did you hear about us?",
        description: "Select all that apply.",
        required: true,
        allowOther: true,
        options: toOptions([
          "Facebook",
          "Instagram",
          "Discord",
          "Slack",
          "Twitter",
          "LinkedIn",
          "Math mailing list",
          "Engineering mailing list",
          "Orientation mailing list",
          "Word of mouth",
        ]),
      },
    ],
  },
  {
    id: "mlh",
    title: "MLH Requirements",
    shortTitle: "MLH",
    placement: "review",
    description:
      "We are currently in the process of partnering with Major League Hacking (MLH). The following three checkboxes are for this partnership. If we do not end up partnering with MLH, your information will not be shared. All hackers MUST agree to the first two checkboxes. The third checkbox is optional.",
    questions: [mlhCodeOfConduct, mlhDataSharing, mlhEmails],
  },
  {
    id: "short_answer",
    title: "Short Answer Questions",
    shortTitle: "Short answers",
    description:
      "Our mission is to create a more gender-equitable future in technology. Check out our social media for more information!",
    questions: [
      {
        id: "why_attend",
        type: "paragraph",
        prompt: "Why would you like to attend TechNova?",
        description: "150 words maximum.",
        required: true,
        maxWords: 150,
      },
      {
        id: "prompt_choice",
        type: "single_choice",
        prompt: "Please choose ONE of the following prompts to answer.",
        required: true,
        options: [
          {
            value: "a",
            label:
              "Option A: What is one emerging technology that you are excited to explore which could potentially enhance representation of women+ in tech?",
          },
          {
            value: "b",
            label:
              "Option B: What other experiences, beyond hackathons, have played a pivotal role in advancing your career within the tech industry as an underrepresented gender?",
          },
        ],
      },
      {
        id: "prompt_a_response",
        type: "paragraph",
        prompt: "If you chose Option A, enter your response here.",
        description: "150 words maximum.",
        required: true,
        maxWords: 150,
        showIf: { question: "prompt_choice", equals: "a" },
      },
      {
        id: "prompt_b_response",
        type: "paragraph",
        prompt: "If you chose Option B, enter your response here.",
        description: "150 words maximum.",
        required: true,
        maxWords: 150,
        showIf: { question: "prompt_choice", equals: "b" },
      },
      {
        id: "superpower",
        type: "paragraph",
        prompt:
          "Here's a fun question: What kind of superpower do you believe would help you in a hackathon?",
        required: true,
      },
      {
        id: "problem_solving",
        type: "short_text",
        prompt: "Summarize your approach to problem-solving in 10 words.",
        required: true,
        maxWords: 10,
      },
    ],
  },
  {
    id: "event",
    title: "Event-Specific Questions",
    shortTitle: "Event",
    description:
      "Help us identify what you'd like to see at the event!\n\nPlease note that these are early ideas, so we cannot guarantee that every session will be included. However, your responses will help us figure out which sessions would be most helpful. Feel free to share any additional ideas in the final question!",
    questions: [
      {
        id: "interested_career_sessions",
        type: "multi_choice",
        prompt: "What career sessions would be most useful to you?",
        description: "Choose your top 5.",
        required: true,
        maxSelect: 5,
        allowOther: true,
        options: toOptions([
          "Building your personal website",
          "Starting your design portfolio",
          "How to pitch yourself / How to network / Personal branding",
          "LinkedIn 101",
          "Resume writing and/or resume feedback session",
          "How to pitch your project",
          "Getting an internship / Interview prepping",
          "How to make the most out of your internship",
        ]),
      },
      {
        id: "interested_community_sessions",
        type: "multi_choice",
        prompt: "What community sessions would you be most interested in attending?",
        description: "Select all that apply.",
        required: true,
        allowOther: true,
        options: toOptions([
          "Speed friending",
          "Speed team-finding",
          "Team bonding",
          "Virtual socials/meetups (e.g. high schoolers, first years, LGBTQIA+, BIPOC, etc.)",
          "Game nights",
          "Mentorship panel",
        ]),
      },
      {
        id: "interested_technical_sessions",
        type: "multi_choice",
        prompt:
          'What "Intro to..." technical sessions would you be most interested in attending?',
        description: "Choose your top 5.",
        required: true,
        maxSelect: 5,
        allowOther: true,
        options: toOptions([
          "Python",
          "Java",
          "Web development (e.g. HTML/CSS/React)",
          "Mobile development (iOS/Android apps)",
          "UI/UX design (e.g. Figma)",
          "Databases",
          "APIs",
          "Git",
          "Artificial Intelligence/Machine Learning",
          "Game development",
          "Chrome extensions",
          "Discord bots",
          "Data Science",
          "Project Management",
          "Networking",
        ]),
      },
      {
        id: "interested_themed_sessions",
        type: "multi_choice",
        prompt:
          "Which themed technology sessions would you be most interested in attending?",
        description: "Select all that apply.",
        required: true,
        allowOther: true,
        options: toOptions([
          "Accessibility & tech",
          "Finding your place in tech",
          "Sponsored Ask Me Anything (AMA) panels",
          "Diversity, Equity & Inclusion",
        ]),
      },
      {
        id: "interested_tech_industries",
        type: "multi_choice",
        prompt:
          "What technology industries would you be most interested in learning about at the event?",
        description: "Choose your top 5.",
        required: true,
        maxSelect: 5,
        allowOther: true,
        options: toOptions([
          "Big Data",
          "Cryptocurrencies (Bitcoin etc.)",
          "E-commerce",
          "Internet of Things",
          "Finance Tech [FinTech]",
          "Business Intelligence",
          "Artificial Intelligence/Machine Learning",
          "Robotics",
          "Autonomous Vehicles",
          "AR/VR",
          "Healthcare",
          "Mobile Development",
          "Data Science",
          "Quant",
          "Human-Computer Interaction",
          "Bioinformatics",
          "Game Development",
        ]),
      },
      {
        id: "interested_fields",
        type: "multi_choice",
        prompt: "What field(s) would you be interested in learning about at TechNova?",
        description: "Choose your top 5.",
        required: true,
        maxSelect: 5,
        allowOther: true,
        options: toOptions([
          "General software engineering",
          "Full stack",
          "Backend",
          "Frontend",
          "Infrastructure",
          "Data engineering",
          "Mobile",
          "Data science/Machine learning",
          "Hardware/Embedded",
          "UI/UX design",
          "Product/Project/Program management",
          "Game Development",
          "Automation/QA",
        ]),
      },
      {
        id: "other_sessions",
        type: "paragraph",
        prompt: "Are there any other sessions that you would like to see at the event?",
        description:
          "Share any topics, speakers, workshops, or activities you'd love us to include.",
      },
    ],
  },
  {
    id: "women_in_tech",
    title: "Women+ in Tech",
    shortTitle: "Women+ in tech",
    description:
      "At TechNova, we believe that building a more inclusive future in technology starts with listening to the people shaping it. We want to understand your experiences, aspirations, and what community means to you. There are no right or wrong answers — we'd love to hear your perspective.",
    questions: [
      {
        id: "wit_meaning",
        type: "paragraph",
        prompt: "What does being a woman+ in technology mean to you?",
        description:
          "This can be about your identity, your experiences, your ambitions, or what being part of this community represents to you.",
      },
      {
        id: "wit_community",
        type: "paragraph",
        prompt: "What does having a community of women+ in tech mean to you?",
        description:
          "How do you think spaces like TechNova can help people feel supported, encouraged, and represented?",
      },
      {
        id: "wit_experience",
        type: "paragraph",
        prompt:
          "Can you share an experience where you felt empowered, challenged, or out of place in a technology-related environment?",
        description:
          "This could be a classroom, workplace, hackathon, club, or any other space. Share only what you're comfortable with.",
      },
      {
        id: "wit_inspiration",
        type: "paragraph",
        prompt:
          "Is there a woman+ in technology who inspires you? What about their journey resonates with you?",
        description:
          "They can be someone well-known, someone in your life, or someone whose work you've come across.",
      },
      {
        id: "wit_understanding",
        type: "paragraph",
        prompt:
          "What is one thing you wish more people understood about the experiences of women+ in technology?",
      },
      {
        id: "wit_change",
        type: "paragraph",
        prompt:
          "If you could change one thing about the tech industry to make it more inclusive, what would it be?",
      },
      {
        id: "wit_advice",
        type: "paragraph",
        prompt:
          "What advice would you give to someone entering tech who doesn't see many people like themselves represented in the industry?",
      },
      {
        id: "wit_future",
        type: "paragraph",
        prompt:
          "When you imagine the future of technology, what do you hope the next generation of women+ will experience that you may not have?",
      },
    ],
  },
  {
    id: "demographics",
    title: "Demographic Questions",
    shortTitle: "Demographics",
    description:
      "One of our most important team pillars is diversity. We would like to better understand the backgrounds of our applicants in order to gain insight into how to improve accessibility as an organization.\n\nThe following questions have no effect on your application and will only be used for statistical purposes to further our event's mission.\n\nYour information will be kept confidential in accordance with our Privacy Policy.",
    questions: [
      {
        id: "ethnicity",
        type: "multi_choice",
        prompt: "What is your ethnicity?",
        description: "Select all that apply.",
        allowOther: true,
        options: toOptions([
          "Hispanic/Latinx",
          "Black/African American",
          "Indigenous",
          "Middle Eastern",
          "Native Hawaiian/Pacific Islander",
          "East Asian",
          "South East Asian",
          "South Asian",
          "Central Asian",
          "White/Caucasian",
        ]),
      },
      genderIdentity,
      {
        id: "gender_identity_other",
        type: "short_text",
        prompt:
          'Please specify your answer if you selected "Not listed here" in the previous question.',
        showIf: { question: genderIdentity.id, equals: GENDER_NOT_LISTED },
      },
      {
        id: "identity_categories",
        type: "multi_choice",
        prompt: "Are any of the following categories relevant to you?",
        description: "Select all that apply.",
        options: toOptions([
          "LGBTQIA2S+",
          "Immigrant",
          "BIPOC",
          "Indigenous person",
          "Person with a disability (visible/invisible)",
          "First-Generation college student",
          "Person from a low-income household",
        ]),
      },
      {
        id: "first_in_family_tech",
        type: "single_choice",
        prompt:
          "If you are pursuing technology, are you the first in your immediate family to pursue tech?",
        options: toOptions(["Yes", "No"]),
      },
      {
        id: "tech_experience",
        type: "single_choice",
        prompt:
          "How long have you been studying, working, or self-learning in tech (if applicable)?",
        options: toOptions(["Less than 1 year", "1–2 years", "3 or more years"]),
      },
    ],
  },
  {
    id: "final",
    title: "You're Almost Done!",
    shortTitle: "Almost done",
    placement: "review",
    description: "Thanks so much for your interest in applying to TechNova!",
    questions: [
      {
        id: "final_acknowledgment",
        type: "consent",
        prompt: "I understand the above and accept.",
        description:
          "By applying to TechNova, you are automatically subscribed to our mailing list and may receive updates about the event and future opportunities. You can opt out at any time by emailing team@itstechnova.org.",
        required: true,
      },
    ],
  },
];
