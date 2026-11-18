'use client';

import type { TableColumn } from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { ApplicationsReviewTable } from "@/components/applications/ApplicationsReviewTable";
import { VOLUNTEER_APPLICATIONS, type VolunteerApplication } from "@/lib/data/volunteerApplications";
import { STATUS_STYLES } from "@/lib/applicationReview";
import { cn } from "@/lib/utils";

const SEARCH_KEYS: (keyof VolunteerApplication)[] = ["name", "email", "rolePreference"];

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

export function VolunteerApplicationsTable() {
  return (
    <ApplicationsReviewTable<VolunteerApplication>
      title="Volunteer Applications"
      applications={VOLUNTEER_APPLICATIONS}
      columns={COLUMNS}
      searchKeys={SEARCH_KEYS}
      searchPlaceholder="Filter by name, email, or role..."
      emptyMessage="No volunteer applications match your search."
      detailSectionTitle="Volunteer Application"
      acceptButtonLabel="Accept as Volunteer"
      fields={[
        { label: "Full Name", value: (a) => a.name },
        { label: "Email", value: (a) => a.email },
        { label: "School / Organization", value: (a) => a.schoolOrOrg },
        { label: "Role Preference", value: (a) => a.rolePreference },
        { label: "Availability", value: (a) => a.availability },
        { label: "Experience", value: (a) => a.experienceLevel },
        { label: "Location", value: (a) => a.location },
      ]}
      prompts={[
        { question: "Why do you want to volunteer at Technova?", answer: (a) => a.motivation },
        { question: "Additional notes", answer: (a) => a.notes },
      ]}
    />
  );
}
