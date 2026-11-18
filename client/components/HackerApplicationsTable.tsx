'use client';

import type { TableColumn } from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { ApplicationsReviewTable } from "@/components/applications/ApplicationsReviewTable";
import { HACKER_APPLICATIONS, type HackerApplication } from "@/lib/data/hackerApplications";
import { STATUS_STYLES } from "@/lib/applicationReview";
import { cn } from "@/lib/utils";

const SEARCH_KEYS: (keyof HackerApplication)[] = ["name", "email"];

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

export function HackerApplicationsTable() {
  return (
    <ApplicationsReviewTable<HackerApplication>
      title="Hacker Applications"
      applications={HACKER_APPLICATIONS}
      columns={COLUMNS}
      searchKeys={SEARCH_KEYS}
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
        { label: "Location", value: (a) => a.location },
        { label: "Resume", value: (a) => a.resumeFileName },
      ]}
      prompts={[
        { question: "Why do you want to attend Technova?", answer: (a) => a.essayWhyAttend },
        { question: "What project or experience are you most proud of?", answer: (a) => a.essayProudProject },
        { question: "What do you hope to build or learn at this event?", answer: (a) => a.essayHopeToLearn },
      ]}
    />
  );
}
