import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeading, PortalPage } from "@/components/portal/PortalPage";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { requireRole } from "@/lib/auth/dal";
import { getMyHackerDraft } from "@/lib/data/hackerDraft";
import { getProfileAnswers, getResumePath } from "@/lib/data/profile";
import { PROFILE_FIELDS, validProfileValue, type ProfileValues } from "@/lib/profile/fields";

export const metadata: Metadata = { title: "Profile & settings" };

export default async function ProfilePage() {
  const user = await requireRole(["admin", "applicant"]);
  if (!user) redirect("/login");

  // What is saved on their account; a detail only typed into an unfinished application so far
  // is offered too, and is saved here with the rest.
  const [profile, draft, resumePath] = await Promise.all([
    getProfileAnswers(user.id),
    getMyHackerDraft(),
    getResumePath(user.id),
  ]);
  const initial = Object.fromEntries(
    PROFILE_FIELDS.map(({ id }) => {
      const value = profile[id] ?? draft?.answers[id];
      return [id, typeof value === "string" && validProfileValue(id, value.trim()) ? value.trim() : ""];
    }),
  ) as ProfileValues;

  return (
    <PortalPage>
      <PageHeading title="Profile & settings">
        Keep your details up to date. Your name, pronouns, phone number, t-shirt size and resume are the same
        ones used on your application, so a change here shows there too.
      </PageHeading>
      <ProfileForm userId={user.id} initial={initial} resumePath={resumePath} email={user.email ?? ""} />
    </PortalPage>
  );
}
