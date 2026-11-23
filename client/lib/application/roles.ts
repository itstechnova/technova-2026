// Every application the portal accepts. Each application type is a form config (lib/application/forms/*) plus
// where its answers are stored and when it closes; the stepper, submit action and submitted view
// are shared. Adding mentor or judge = a form file, an entry here, a migration and a page.

import { APPLICATIONS_CLOSE_AT, APPLICATIONS_CLOSE_DATE_LABEL, APPLICATIONS_CLOSE_TIME_LABEL } from "./config";
import { hackerForm } from "./forms/hacker";
import { judgeForm } from "./forms/judge";
import { mentorForm } from "./forms/mentor";
import { volunteerForm } from "./forms/volunteer";
import type { Form } from "./types";

export type ApplicationType = "hacker" | "volunteer" | "mentor" | "judge";

export type ApplicationConfig = {
  applicationType: ApplicationType;
  /** "Application" for hackers; "Volunteer application" etc. for the others. */
  title: string;
  form: Form;
  /** The table holding one row per submitted application, keyed by the applicant's user id. */
  table: string;
  idColumn: string;
  /** The page with the form (and, once submitted, the read-only answers). */
  path: string;
  closesAt: Date;
  closeDateLabel: string;
  closeTimeLabel: string;
};

export const APPLICATIONS: Record<ApplicationType, ApplicationConfig> = {
  hacker: {
    applicationType: "hacker",
    title: "Application",
    form: hackerForm,
    table: "hacker",
    idColumn: "hacker_id",
    path: "/applicant/application",
    closesAt: APPLICATIONS_CLOSE_AT,
    closeDateLabel: APPLICATIONS_CLOSE_DATE_LABEL,
    closeTimeLabel: APPLICATIONS_CLOSE_TIME_LABEL,
  },
  volunteer: {
    applicationType: "volunteer",
    title: "Volunteer application",
    form: volunteerForm,
    table: "volunteer",
    idColumn: "volunteer_id",
    path: "/applicant/volunteer",
    // 11:59 PM Eastern (EST, UTC-5) on Dec 11, 2026.
    closesAt: new Date("2026-12-12T04:59:59Z"),
    closeDateLabel: "Dec 11, 2026",
    closeTimeLabel: "11:59 PM ET",
  },
  mentor: {
    applicationType: "mentor",
    title: "Mentor application",
    form: mentorForm,
    table: "mentor",
    idColumn: "mentor_id",
    path: "/applicant/mentor",
    // 11:59 PM Eastern (EST, UTC-5) on Dec 11, 2026.
    closesAt: new Date("2026-12-12T04:59:59Z"),
    closeDateLabel: "Dec 11, 2026",
    closeTimeLabel: "11:59 PM ET",
  },
  judge: {
    applicationType: "judge",
    title: "Judge application",
    form: judgeForm,
    table: "judge",
    idColumn: "judge_id",
    path: "/applicant/judge",
    // 11:59 PM Eastern (EST, UTC-5) on Dec 11, 2026.
    closesAt: new Date("2026-12-12T04:59:59Z"),
    closeDateLabel: "Dec 11, 2026",
    closeTimeLabel: "11:59 PM ET",
  },
};

export function isApplicationType(value: unknown): value is ApplicationType {
  return typeof value === "string" && Object.hasOwn(APPLICATIONS, value);
}

export const applicationOpen = (applicationType: ApplicationType, now: Date = new Date()) =>
  now <= APPLICATIONS[applicationType].closesAt;
