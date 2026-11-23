import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ApplicationForm from "@/components/application/ApplicationForm";
import { SectionSummary } from "@/components/application/SectionSummary";
import { PageHeading, PortalPage, textLink } from "@/components/portal/PortalPage";
import { buttonSecondary } from "@/components/portal/ui";
import { SUPPORT_EMAIL } from "@/lib/application/config";
import { APPLICATIONS, applicationOpen, type ApplicationType } from "@/lib/application/roles";
import type { Answers } from "@/lib/application/types";
import { requireRole } from "@/lib/auth/dal";
import { getMyApplication } from "@/lib/data/myApplication";

// The page behind every application route (/applicant/application, /applicant/volunteer, …):
// the form until it is submitted, then the submitted answers, read-only.

/** What the account already knows, offered as starting answers: email and first/last name. */
function accountAnswers(email: string | undefined, fullName: unknown): Answers {
  const [firstName = "", ...rest] = typeof fullName === "string" ? fullName.trim().split(/\s+/) : [];
  const answers: Answers = {};
  if (email) answers.contact_email = email;
  if (firstName) answers.first_name = firstName;
  if (rest.length > 0) answers.last_name = rest.join(" ");
  return answers;
}

/** Figma frame 13: the answers as submitted. They can no longer be edited. */
function SubmittedApplication({ applicationType, answers }: { applicationType: ApplicationType; answers: Answers }) {
  const { title, form } = APPLICATIONS[applicationType];
  return (
    <PortalPage>
      <PageHeading eyebrow={`${title} / Submitted`} title={`Your submitted ${title.toLowerCase()}`}>
        {applicationType === "hacker"
          ? "Review the answers you sent us."
          : "Thanks for applying! We’ll email you when your status changes. Here are the answers you sent us."}
      </PageHeading>
      <div className="flex max-w-[1080px] flex-col gap-[30px]">
        {form.map((section, index) => (
          <SectionSummary key={section.id} number={index + 1} section={section} answers={answers} />
        ))}
      </div>
      <p className="text-lg text-tn-muted sm:text-xl">
        Need to correct something? Email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className={textLink}>
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
      <div>
        <Link href="/applicant/dashboard" className={buttonSecondary}>
          Back to overview
        </Link>
      </div>
    </PortalPage>
  );
}

export async function ApplicationPage({ applicationType }: { applicationType: ApplicationType }) {
  const user = await requireRole(["admin", "applicant"]);
  if (!user) redirect("/login");
  const application = await getMyApplication(applicationType);

  if (application) return <SubmittedApplication applicationType={applicationType} answers={application.answers} />;

  return (
    // ApplicationForm reads the step from the URL with useSearchParams.
    <Suspense fallback={null}>
      <ApplicationForm
        applicationType={applicationType}
        userId={user.id}
        prefill={accountAnswers(user.email, user.user_metadata?.full_name)}
        closed={!applicationOpen(applicationType)}
      />
    </Suspense>
  );
}
