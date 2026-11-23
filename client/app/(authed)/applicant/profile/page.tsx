import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeading, PortalPage } from "@/components/portal/PortalPage";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { requireRole } from "@/lib/auth/dal";
import { PROFILE_FIELDS, type ProfileValues } from "@/lib/profile/fields";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Profile & settings" };

export default async function ProfilePage() {
  const user = await requireRole(["admin", "applicant"]);
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data } = await supabase
    .from("user")
    .select(PROFILE_FIELDS.map((field) => field.id).join(","))
    .eq("user_id", user.id)
    .maybeSingle();
  const row = (data ?? {}) as unknown as Record<string, unknown>;
  const initial = Object.fromEntries(
    PROFILE_FIELDS.map((field) => [field.id, typeof row[field.id] === "string" ? (row[field.id] as string) : ""]),
  ) as ProfileValues;

  return (
    <PortalPage>
      <PageHeading title="Profile & settings">
        Keep your details up to date. Your name, pronouns and phone number are the same ones used on your
        application.
      </PageHeading>
      <ProfileForm initial={initial} email={user.email ?? ""} />
    </PortalPage>
  );
}
