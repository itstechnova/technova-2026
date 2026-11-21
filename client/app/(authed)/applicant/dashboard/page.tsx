import Link from "next/link";
import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import DraftOverview from "@/components/application/DraftOverview";
import { InfoCard, PageHeading, PortalPage, textLink } from "@/components/portal/PortalPage";
import { TwinkleStar, buttonSecondary } from "@/components/portal/ui";
import { SUPPORT_EMAIL, applicationsOpen } from "@/lib/application/config";
import { requireRole } from "@/lib/auth/dal";
import { getMyHackerApplication } from "@/lib/data/hackerApplication";

/** The satellite from Figma frame 07, drifting gently with a couple of stars around it. */
function Satellite() {
  return (
    <div aria-hidden className="pointer-events-none relative -mt-7 w-[210px] select-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/satellite.svg"
        alt=""
        width={210}
        height={65}
        className="anim-breathe"
        style={{ "--dur": "7s" } as CSSProperties}
      />
      <TwinkleStar className="absolute -top-3 -left-8 w-4" dur={3.6} />
      <TwinkleStar className="absolute -right-5 -bottom-6 w-3" dur={5.1} />
    </div>
  );
}

/** Figma frame 07: the application is in and waiting for a decision. */
function Submitted() {
  return (
    <PortalPage art={<Satellite />}>
      <PageHeading eyebrow="Your dashboard" title="Application received">
        We’ll email you when your status changes.
      </PageHeading>
      <InfoCard eyebrow="Application status" title="Awaiting review">
        We’ll email you when a decision is ready.
      </InfoCard>
      <div className="grid gap-x-6 sm:grid-cols-2">
        <InfoCard eyebrow="01 / Complete" title="Application received">
          Review your answers below.
        </InfoCard>
        <InfoCard eyebrow="02 / Up next" title="No action needed">
          Check here or watch your email for updates.
        </InfoCard>
      </div>
      <div>
        <Link href="/applicant/application" className={buttonSecondary}>
          View submitted application
        </Link>
      </div>
      <PageHeading as="h2" eyebrow="TechNova" title="While you wait">
        Meet the community and explore the event.
      </PageHeading>
      <div className="grid gap-x-6 sm:grid-cols-2">
        <InfoCard eyebrow="Explore" title="Event preview">
          <Link href="/" className={textLink}>
            Meet the people and ideas behind TechNova.
          </Link>
        </InfoCard>
        <InfoCard eyebrow="Support" title="Need help?">
          <a href={`mailto:${SUPPORT_EMAIL}`} className={textLink}>
            {SUPPORT_EMAIL}
          </a>
        </InfoCard>
      </div>
    </PortalPage>
  );
}

export default async function ApplicantDashboard() {
  const user = await requireRole(["admin", "applicant"]);
  if (!user) redirect("/login");
  const application = await getMyHackerApplication();

  if (application) return <Submitted />;

  return (
    <PortalPage>
      <DraftOverview userId={user.id} closed={!applicationsOpen()} />
    </PortalPage>
  );
}
