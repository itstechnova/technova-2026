import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth/dal";
import Sidebar from "@/components/portal/Sidebar";
import { SpaceBackdrop } from "@/components/portal/ui";

// The participant portal shell: nebula backdrop, sidebar (a top bar below `md`), page content.
export default async function ApplicantLayout({ children }: Readonly<{ children: ReactNode }>) {
  await requireRole(["admin", "applicant"]);

  return (
    <div className="relative isolate flex min-h-dvh w-full flex-col text-tn-ink md:flex-row md:items-start">
      <SpaceBackdrop />
      <Sidebar />
      <main className="w-full min-w-0 flex-1">{children}</main>
    </div>
  );
}
