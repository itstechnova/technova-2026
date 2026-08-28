'use client';

import { type TableColumn } from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { ApplicationsReviewTable } from "@/components/applications/ApplicationsReviewTable";
import {  type MentorApplication, type AcceptanceStatus } from "@/lib/data/mentors";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<AcceptanceStatus, string> = {
  Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50  text-amber-700  border-amber-200",
  Rejected: "bg-red-50    text-red-700    border-red-200",
  Waitlisted: "bg-blue-50   text-blue-700   border-blue-200",
};

const COLUMNS: TableColumn<MentorApplication>[] = [
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
    key: "organization",
    header: "Organization",
    accessor: (a) => a.organization,
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

export function MentorApplicationsTable({ applications }: { applications: MentorApplication[] }) {
  return (
    <ApplicationsReviewTable<MentorApplication>
      title="Mentor Applications"
      applications={applications}
      columns={COLUMNS}
      searchKeys={["name", "email", "organization"]}
      searchPlaceholder="Filter by name, email, or company..."
      emptyMessage="No mentor applications match your search."
      detailSectionTitle="Mentor Application"
      acceptButtonLabel="Accept as Mentor"
      fields={[
        { label: "Full Name", value: (a) => a.name },
        { label: "Email", value: (a) => a.email },
        { label: "Company", value: (a) => a.organization },
      ]}
      prompts={[
        { question: "Why do you want to mentor at Technova?", answer: (a) => a.mentor_question1 },
      ]}
    />
  );
}
