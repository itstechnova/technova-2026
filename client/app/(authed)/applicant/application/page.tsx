import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ApplicationForm from "@/components/application/ApplicationForm";
import { SectionSummary } from "@/components/application/SectionSummary";
import { PortalPage, textLink } from "@/components/portal/PortalPage";
import { buttonPrimary, buttonSecondary, heading } from "@/components/portal/ui";
import { SUPPORT_EMAIL, applicationsOpen } from "@/lib/application/config";
import { hackerForm } from "@/lib/application/forms/hacker";
import type { Answers } from "@/lib/application/types";
import { requireRole } from "@/lib/auth/dal";
import { getMyHackerApplication } from "@/lib/data/hackerApplication";
import { getMyHackerDraft } from "@/lib/data/hackerDraft";
import { getProfileAnswers } from "@/lib/data/profile";

const DASHBOARD = "/applicant/dashboard";
const SPONSORS_EMAIL = "sponsors@itstechnova.org";

/** What the account already knows, offered as starting answers: email and first/last name. */
function accountAnswers(email: string | undefined, fullName: unknown): Answers {
  const [firstName = "", ...rest] = typeof fullName === "string" ? fullName.trim().split(/\s+/) : [];
  const answers: Answers = {};
  if (email) answers.contact_email = email;
  if (firstName) answers.first_name = firstName;
  if (rest.length > 0) answers.last_name = rest.join(" ");
  return answers;
}

const submittedOn = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat("en-CA", { dateStyle: "medium", timeZone: "America/Toronto" }).format(new Date(iso))
    : null;

/** Figma "08 · My application / Submitted confirmation": shown once, right after submitting. */
function Confirmation() {
  return (
    <PortalPage>
      <div className="mx-auto flex max-w-[720px] flex-col items-center gap-6 py-6 text-center lg:py-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/cratered-moon.svg" alt="" width={174} height={174} className="-mb-8 w-[174px]" />
        <h1 tabIndex={-1} className={`${heading} title-shade w-fit pb-[0.08em] text-[clamp(2rem,1.2rem+2.6vw,3.25rem)] leading-[1.15] text-balance outline-none`}>
          Thank you for applying to TechNova 2027!
        </h1>
        <div className="flex flex-col gap-4 text-lg leading-[1.45] text-tn-muted">
          <p>We’re so excited that you’re interested in joining our Women+ in Tech community.</p>
          <p>
            Keep an eye on your inbox for updates regarding your application. We look forward to connecting with
            you on January 22, 2027!
          </p>
          <p>You can come back to your dashboard any time to see exactly what you submitted.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/applicant/application" className={buttonPrimary}>
            View my application
          </Link>
          <Link href={DASHBOARD} className={buttonSecondary}>
            Go to my dashboard
          </Link>
        </div>
        <p className="text-base leading-[1.6] text-tn-muted">
          Sponsorship, judging, or speaking opportunities:{" "}
          <a href={`mailto:${SPONSORS_EMAIL}`} className={textLink}>
            {SPONSORS_EMAIL}
          </a>
          <br />
          Questions, comments, or concerns:{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className={textLink}>
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </PortalPage>
  );
}

/** Figma "09 · My application / Submitted · read-only": the answers as sent, whenever they come back. */
function SubmittedApplication({ answers, submittedAt }: { answers: Answers; submittedAt: string | null }) {
  const date = submittedOn(submittedAt);

  return (
    <PortalPage>
      <div className="flex max-w-[988px] flex-wrap items-center justify-between gap-x-6">
        <p className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
          <span className={`${heading} text-2xl leading-[1.25]`}>My application</span>
          <span className="text-sm text-tn-cyan">Submitted{date ? ` ${date}` : ""} · awaiting review</span>
        </p>
        <Link href={DASHBOARD} className={`${textLink} flex min-h-11 items-center text-[15px] font-semibold`}>
          Back to dashboard
        </Link>
      </div>
      <div className="flex max-w-[820px] flex-col gap-3">
        <h1 tabIndex={-1} className={`${heading} title-shade w-fit pb-[0.08em] text-[clamp(1.875rem,1.2rem+2vw,3rem)] leading-[1.15] text-balance outline-none`}>
          Your submitted application
        </h1>
        <p className="text-base leading-[1.45] text-tn-muted xl:text-lg">
          This is what you sent us. Answers can’t be changed after submitting. If something is wrong, email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className={textLink}>
            {SUPPORT_EMAIL}
          </a>{" "}
          and we’ll help.
        </p>
      </div>
      <div className="flex max-w-[820px] flex-col gap-7">
        {hackerForm.map((section, index) => (
          <SectionSummary key={section.id} number={index + 1} section={section} answers={answers} />
        ))}
      </div>
      <div>
        <Link href={DASHBOARD} className={buttonSecondary}>
          Back to dashboard
        </Link>
      </div>
    </PortalPage>
  );
}

export default async function ApplicationPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const user = await requireRole(["admin", "applicant"]);
  if (!user) redirect("/login");
  const application = await getMyHackerApplication();

  if (application) {
    const { submitted } = await searchParams;
    return submitted ? (
      <Confirmation />
    ) : (
      <SubmittedApplication answers={application.answers} submittedAt={application.submittedAt} />
    );
  }

  const [accountDraft, profile] = await Promise.all([getMyHackerDraft(), getProfileAnswers(user.id)]);

  return (
    // ApplicationForm reads the step from the URL with useSearchParams.
    <Suspense fallback={null}>
      <ApplicationForm
        userId={user.id}
        prefill={accountAnswers(user.email, user.user_metadata?.full_name)}
        profile={profile}
        accountDraft={accountDraft}
        closed={!applicationsOpen()}
      />
    </Suspense>
  );
}
