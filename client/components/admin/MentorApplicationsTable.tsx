'use client';

import type { TableColumn } from "@/components/admin/Table";
import { Badge } from "@/components/ui/badge";
import { ApplicationsReviewTable } from "@/components/admin/ApplicationsReviewTable";
import type { MentorApplication } from "@/lib/data/mentors";
import { updateMentorScore } from "@/lib/data/mentorMutations";
import { updateUserAcceptanceStatus } from "@/lib/data/userMutations";
import { STATUS_STYLES } from "@/lib/applicationReview";
import { cn } from "@/lib/utils";

const SEARCH_KEYS: (keyof MentorApplication)[] = ["name", "email", "organization"];

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
      searchKeys={SEARCH_KEYS}
      searchPlaceholder="Filter by name, email, or company..."
      emptyMessage="No mentor applications match your search."
      detailSectionTitle="Mentor Application"
      acceptButtonLabel="Accept as Mentor"
      onUpdateScore={updateMentorScore}
      onUpdateAcceptanceStatus={updateUserAcceptanceStatus}
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
