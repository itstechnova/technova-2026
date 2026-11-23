import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ApplicationForm from "@/components/application/ApplicationForm";
import { SectionSummary } from "@/components/application/SectionSummary";
import { PageHeading, PortalPage, textLink } from "@/components/portal/PortalPage";
import { buttonSecondary } from "@/components/portal/ui";
import { SUPPORT_EMAIL, applicationsOpen } from "@/lib/application/config";
import { hackerForm } from "@/lib/application/forms/hacker";
import type { Answers } from "@/lib/application/types";
import { requireRole } from "@/lib/auth/dal";
import { getMyHackerApplication } from "@/lib/data/hackerApplication";

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
function SubmittedApplication({ answers }: { answers: Answers }) {
  return (
    <PortalPage>
      <PageHeading eyebrow="Application / Submitted" title="Your submitted application">
        Review the answers you sent us.
      </PageHeading>
      <div className="flex max-w-[1080px] flex-col gap-[30px]">
        {hackerForm.map((section, index) => (
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
          Back to status
        </Link>
      </div>
    </PortalPage>
  );
}

export default async function ApplicationPage() {
  const user = await requireRole(["admin", "applicant"]);
  if (!user) redirect("/login");
  const application = await getMyHackerApplication();

  if (application) return <SubmittedApplication answers={application.answers} />;

  return (
    // ApplicationForm reads the step from the URL with useSearchParams.
    <Suspense fallback={null}>
      <ApplicationForm
        userId={user.id}
        prefill={accountAnswers(user.email, user.user_metadata?.full_name)}
        closed={!applicationsOpen()}
      />
    </Suspense>
  );
}
