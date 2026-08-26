'use client';

import { type TableColumn } from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { ApplicationsReviewTable } from "@/components/applications/ApplicationsReviewTable";
import { type VolunteerApplication, type AcceptanceStatus } from "@/lib/data/volunteers"
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<AcceptanceStatus, string> = {
  Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50  text-amber-700  border-amber-200",
  Rejected: "bg-red-50    text-red-700    border-red-200",
  Waitlisted: "bg-blue-50   text-blue-700   border-blue-200",
};

const COLUMNS: TableColumn<VolunteerApplication>[] = [
  {
    key: "name",
    header: "Name",
    render: (a) => (
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
          style={{ background: a.avatarColor }}
        >
          {a.initials}
        </span>
        <span className="font-medium text-foreground">{a.name}</span>
      </div>
    ),
  },
  {
    key: "email",
    header: "Email",
    render: (a) => (
      <span className="font-mono text-xs text-muted-foreground">{a.email}</span>
    ),
  },
  {
    key: "rolePreference",
    header: "Role Preference",
    accessor: (a) => a.rolePreference,
  },
  {
    key: "applicationDate",
    header: "Applied",
    accessor: (a) => a.applicationDate,
  },
  {
    key: "acceptanceStatus",
    header: "Status",
    align: "center",
    render: (a) => (
      <Badge
        variant="outline"
        className={cn("text-xs font-medium", STATUS_STYLES[a.acceptanceStatus])}
      >
        {a.acceptanceStatus}
      </Badge>
    ),
  },
  {
    key: "score",
    header: "Score",
    align: "center",
    accessor: (a) => a.score,
  },
];

export function VolunteerApplicationsTable({ applications }: { applications: VolunteerApplication[] }) {
  return (
    <ApplicationsReviewTable<VolunteerApplication>
      title="Volunteer Applications"
      applications={applications}
      columns={COLUMNS}
      searchKeys={["name", "email", "rolePreference"]}
      searchPlaceholder="Filter by name, email, or role..."
      emptyMessage="No volunteer applications match your search."
      detailSectionTitle="Volunteer Application"
      acceptButtonLabel="Accept as Volunteer"
      fields={[
        { label: "Full Name", value: (a) => a.name },
        { label: "Email", value: (a) => a.email },
        { label: "Role Preference", value: (a) => a.rolePreference },
      ]}
      prompts={[
        { question: "Why do you want to volunteer at Technova?", answer: (a) => a.volunteer_question1 },
      ]}
    />
  );
}
