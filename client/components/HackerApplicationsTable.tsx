'use client'

import { Table, type TableColumn } from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { ApplicationsReviewTable } from "@/components/applications/ApplicationsReviewTable";
import { getHackerApplications, type HackerApplication, type AcceptanceStatus } from "@/lib/data/hackers"
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<AcceptanceStatus, string> = {
  Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50  text-amber-700  border-amber-200",
  Rejected: "bg-red-50    text-red-700    border-red-200",
  Waitlisted: "bg-blue-50   text-blue-700   border-blue-200",
};

const COLUMNS: TableColumn<HackerApplication>[] = [
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

export function HackerApplicationsTable({ applications }: { applications: HackerApplication[] }) {
  return (
    <ApplicationsReviewTable
      title="Hacker Applications"
      applications={applications}
      columns={COLUMNS}
      searchKeys={["name", "email"]}
      searchPlaceholder="Filter by name or email..."
      emptyMessage="No hacker applications match your search."
      detailSectionTitle="Hacker Application"
      acceptButtonLabel="Accept as Hacker"
      fields={[
        { label: "Full Name", value: (a) => a.name },
        { label: "Email", value: (a) => a.email },
        { label: "School", value: (a) => a.school },
        { label: "Grad Year", value: (a) => a.gradYear },
        { label: "Major", value: (a) => a.major },
        { label: "Location", value: (a) => a.location ?? "" },
        { label: "Resume", value: (a) => a.resumeFileName, href: (a) => `/resumes/${a.resumeFileName}` },
      ]}
      prompts={[
        { question: "Why do you want to attend Technova?", answer: (a) => a.essayWhyAttend },
        { question: "What project or experience are you most proud of?", answer: (a) => a.essayProudProject },
        { question: "What do you hope to build or learn at this event?", answer: (a) => a.essayHopeToLearn },
      ]}
    />
  );
}
