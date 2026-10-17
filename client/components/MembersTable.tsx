'use client';

import { useMemo, useState } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { Table, type TableColumn } from "@/components/Table";
import { useTableSearch } from "@/components/ui/useTableSearch";
import { Badge } from "@/components/ui/badge";
import { MEMBERS, type Member, type MemberRole } from "@/lib/data/members";
import { cn } from "@/lib/utils";

const ROLE_STYLES: Record<MemberRole, string> = {
  Hacker: "bg-blue-50 text-blue-700 border-blue-200",
  Mentor: "bg-purple-50 text-purple-700 border-purple-200",
  Volunteer: "bg-amber-50 text-amber-700 border-amber-200",
};

const SEARCH_KEYS: (keyof Member)[] = ["name", "email"];

const COLUMNS: TableColumn<Member>[] = [
  {
    key: "name",
    header: "Name",
    render: (m) => (
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
          style={{ background: m.avatarColor }}
        >
          {m.initials}
        </span>
        <span className="font-medium text-foreground">{m.name}</span>
      </div>
    ),
  },
  {
    key: "email",
    header: "Email",
    render: (m) => (
      <span className="font-mono text-xs text-muted-foreground">{m.email}</span>
    ),
  },
  {
    key: "role",
    header: "Role",
    render: (m) => (
      <Badge variant="outline" className={cn("text-xs font-medium", ROLE_STYLES[m.role])}>
        {m.role}
      </Badge>
    ),
  },
  {
    key: "shirtSize",
    header: "Shirt Size",
    align: "center",
    render: (m) => (
      <Badge variant="outline" className="rounded-md border-slate-200 px-2 py-0.5 font-mono text-xs font-medium text-slate-700">
        {m.shirtSize}
      </Badge>
    ),
  },
  {
    key: "dietaryRestrictions",
    header: "Dietary Restrictions",
    accessor: (m) => m.dietaryRestrictions,
  },
];

export function MembersTable() {
  const { query, setQuery, results } = useTableSearch(MEMBERS, SEARCH_KEYS);
  const [roleFilter, setRoleFilter] = useState<"All" | MemberRole>("All");

  const filteredResults = useMemo(() => {
    return roleFilter === "All" ? results : results.filter((m) => m.role === roleFilter);
  }, [results, roleFilter]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Accepted Members</h2>
            <p className="mt-0.5 text-sm text-slate-500">{filteredResults.length} members</p>
          </div>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Filter by name or email..."
            className="w-72"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["All", "Hacker", "Mentor", "Volunteer"] as const).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setRoleFilter(role)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                roleFilter === role
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900"
              )}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-b-2xl">
        <Table
          columns={COLUMNS}
          data={filteredResults}
          getRowId={(m) => m.id}
          emptyMessage="No members match your search."
          className="rounded-none border-0"
        />
      </div>
    </div>
  );
}
