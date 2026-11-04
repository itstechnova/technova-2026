'use client';

import { useMemo, useState } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { Table, type TableColumn } from "@/components/Table";
import { useTableSearch } from "@/components/ui/useTableSearch";
import { Badge } from "@/components/ui/badge";
import { APPLICANTS, type Applicant, type AcceptanceStatus } from "@/lib/data/applicants";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<AcceptanceStatus, string> = {
  Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50  text-amber-700  border-amber-200",
  Rejected: "bg-red-50    text-red-700    border-red-200",
  Waitlisted: "bg-blue-50   text-blue-700   border-blue-200",
};

const COLUMNS: TableColumn<Applicant>[] = [
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
];

/**
 * Example: SearchBar + Table composed together for the Applicant type
 *
 * To wire to a real API:
 *   const { data = [], isLoading } = useQuery(["applicants"], fetchApplicants);
 *   const { query, setQuery, results } = useTableSearch(data, ["name", "email"]);
 */
export function ApplicantsTable() {
  const { query, setQuery, results } = useTableSearch(APPLICANTS, ["name", "email"]);
  const [statusFilter, setStatusFilter] = useState<"All" | AcceptanceStatus>("All");
  const [newestFirst, setNewestFirst] = useState(true);

  const filteredResults = useMemo(() => {
    let rows = statusFilter === "All"
      ? results
      : results.filter((a) => a.acceptanceStatus === statusFilter);

    rows = [...rows].sort((a, b) => {
      const da = new Date(a.applicationDate).getTime();
      const db = new Date(b.applicationDate).getTime();
      return newestFirst ? db - da : da - db;
    });

    return rows;
  }, [results, statusFilter, newestFirst]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Applications</h2>
            <p className="mt-0.5 text-sm text-slate-500">{filteredResults.length} records</p>
          </div>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Filter by name or email..."
            className="w-64"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["All", "Accepted", "Pending", "Rejected", "Waitlisted"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={[
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                statusFilter === status
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900",
              ].join(" ")}
            >
              {status}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setNewestFirst((prev) => !prev)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-900 transition-colors"
          >
            {newestFirst ? "Newest first" : "Oldest first"}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-b-2xl">
        <Table
          columns={COLUMNS}
          data={filteredResults}
          getRowId={(a) => a.id}
          emptyMessage="No applicants match your search."
          className="rounded-none border-0"
        />
      </div>
    </div>
  );
}
