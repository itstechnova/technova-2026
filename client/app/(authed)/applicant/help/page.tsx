import type { Metadata } from "next";
import { PageHeading, PortalPage, Section, textLink } from "@/components/portal/PortalPage";
import {
  APPLICATIONS_CLOSE_DATE_LABEL,
  APPLICATIONS_CLOSE_TIME_LABEL,
  SUPPORT_EMAIL,
} from "@/lib/application/config";
import { POLICIES } from "@/lib/application/policies";

export const metadata: Metadata = { title: "Help & support" };

// Figma "05 · Hacker dashboard / Help & support".

const SPONSORS_EMAIL = "sponsors@itstechnova.org";

const QUESTIONS = [
  {
    q: "When is the application deadline?",
    a: `${APPLICATIONS_CLOSE_DATE_LABEL} at ${APPLICATIONS_CLOSE_TIME_LABEL}. Applications are reviewed on a rolling basis, so applying early helps.`,
  },
  {
    q: "Can I change my application after I submit it?",
    a: "No. Submitted answers are read-only, and you can view them any time under My application. If something is wrong, email us.",
  },
  {
    q: "Do I need coding experience?",
    a: "No. You do not need any prior coding experience to apply as a hacker.",
  },
  {
    q: "Is transportation provided?",
    a: "No. TechNova does not provide or arrange transportation. You are responsible for getting to and from Waterloo.",
  },
  {
    q: "I need an accommodation. Who do I tell?",
    a: `Email ${SUPPORT_EMAIL} and we’ll work it out with you.`,
  },
];

const CONTACTS = [
  { what: "Questions about your application or the event", email: SUPPORT_EMAIL },
  { what: "Sponsorship, judging or speaking", email: SPONSORS_EMAIL },
];

export default function HelpPage() {
  return (
    <PortalPage>
      <PageHeading title="Help & support">
        Answers to the questions we get most, and how to reach the team.
      </PageHeading>

      <Section title="Common questions">
        <dl className="flex flex-col gap-5">
          {QUESTIONS.map(({ q, a }) => (
            <div key={q} className="flex flex-col gap-1">
              <dt className="text-lg leading-[1.35] font-semibold text-tn-ink">{q}</dt>
              <dd className="max-w-[720px] text-base leading-[1.45] text-tn-muted">{a}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Contact the team">
        <ul className="flex flex-col gap-3">
          {CONTACTS.map(({ what, email }) => (
            <li key={email} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[17px]">
              <span>{what}</span>
              <a href={`mailto:${email}`} className={`${textLink} font-semibold`}>
                {email}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Policies">
        <ul className="flex flex-wrap gap-x-8 gap-y-2 text-[17px]">
          {Object.values(POLICIES).map((policy) => (
            <li key={policy.href}>
              <a href={policy.href} target="_blank" rel="noopener noreferrer" className={textLink}>
                {policy.title}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </PortalPage>
  );
}
