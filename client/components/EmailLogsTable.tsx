'use client';

import { useMemo, useState } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { Table, type TableColumn } from "@/components/Table";
import { useTableSearch } from "@/components/ui/useTableSearch";
import { Badge } from "@/components/ui/badge";
import { EMAIL_LOGS, type EmailLog, type EmailStatus, type AccountStatus } from "@/lib/data/emailLogs";
import { cn } from "@/lib/utils";

const EMAIL_STATUS_STYLES: Record<EmailStatus, string> = {
  Sent: "bg-blue-50    text-blue-700    border-blue-200",
  Opened: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Bounced: "bg-red-50     text-red-700     border-red-200",
};

const ACCOUNT_STATUS_STYLES: Record<AccountStatus, string> = {
  Verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Not Verified": "bg-amber-50   text-amber-700   border-amber-200",
};

const SEARCH_KEYS: (keyof EmailLog)[] = ["name", "email"];

const COLUMNS: TableColumn<EmailLog>[] = [
  {
    key: "name",
    header: "Name",
    render: (l) => (
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
          style={{ background: l.avatarColor }}
        >
          {l.initials}
        </span>
        <span className="font-medium text-foreground">{l.name}</span>
      </div>
    ),
  },
  {
    key: "email",
    header: "Email",
    render: (l) => (
      <span className="font-mono text-xs text-muted-foreground">{l.email}</span>
    ),
  },
  {
    key: "emailSentDate",
    header: "Email Sent Date",
    render: (l) => (
      <span className="font-mono text-xs text-muted-foreground">{l.emailSentDate}</span>
    ),
  },
  {
    key: "emailStatus",
    header: "Email Status",
    align: "center",
    render: (l) => (
      <Badge variant="outline" className={cn("text-xs font-medium", EMAIL_STATUS_STYLES[l.emailStatus])}>
        {l.emailStatus}
      </Badge>
    ),
  },
  {
    key: "accountStatus",
    header: "Account Status",
    align: "center",
    render: (l) => (
      <Badge variant="outline" className={cn("text-xs font-medium", ACCOUNT_STATUS_STYLES[l.accountStatus])}>
        {l.accountStatus}
      </Badge>
    ),
  },
];

export function EmailLogsTable() {
  const { query, setQuery, results } = useTableSearch(EMAIL_LOGS, SEARCH_KEYS);
  const [statusFilter, setStatusFilter] = useState<"All" | EmailStatus>("All");

  const filteredResults = useMemo(() => {
    return statusFilter === "All" ? results : results.filter((l) => l.emailStatus === statusFilter);
  }, [results, statusFilter]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Email Logs</h2>
            <p className="mt-0.5 text-sm text-slate-500">{filteredResults.length} records</p>
          </div>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Filter by name or email..."
            className="w-72"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["All", "Sent", "Opened", "Bounced"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                statusFilter === status
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-b-2xl">
        <Table
          columns={COLUMNS}
          data={filteredResults}
          getRowId={(l) => l.id}
          emptyMessage="No email logs match your search."
          className="rounded-none border-0"
        />
      </div>
    </div>
  );
}
