import { redirect } from "next/navigation";
import DraftOverview from "@/components/application/DraftOverview";
import { DeadlineBlock, EventCard, HelpBlock, MissionTracker } from "@/components/portal/overview";
import { PageHeading, PortalPage } from "@/components/portal/PortalPage";
import { applicationsOpen } from "@/lib/application/config";
import { requireRole } from "@/lib/auth/dal";
import { getMyHackerApplication } from "@/lib/data/hackerApplication";
import { getMyHackerDraft } from "@/lib/data/hackerDraft";

/** The application is in and waiting for a decision. */
function Submitted() {
  return (
    <PortalPage>
      <PageHeading title="Overview">Your application is in. We’ll email you when your status changes.</PageHeading>
      <DeadlineBlock
        note="Application received. You can view what you submitted at any time; answers can’t be changed."
        action={{ href: "/applicant/application", label: "View my application" }}
      />
      <MissionTracker current={2} />
      <EventCard />
      <HelpBlock />
    </PortalPage>
  );
}

export default async function ApplicantDashboard() {
  const user = await requireRole(["admin", "applicant"]);
  if (!user) redirect("/login");
  const application = await getMyHackerApplication();

  if (application) return <Submitted />;
  const accountDraft = await getMyHackerDraft();

  return (
    <PortalPage>
      <DraftOverview userId={user.id} accountDraft={accountDraft} closed={!applicationsOpen()} />
    </PortalPage>
  );
}
