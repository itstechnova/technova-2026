'use client';

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Send, X } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { useTableSearch } from "@/components/ui/useTableSearch";
import { Table, type TableColumn } from "@/components/Table";
import { cn } from "@/lib/utils";

export type AcceptanceStatus = "Pending" | "Accepted" | "Rejected" | "Waitlisted";

export interface ReviewApplicationBase {
  id: string;
  name: string;
  email: string;
  applicationDate: string;
  acceptanceStatus: AcceptanceStatus;
  initials: string;
  avatarColor: string;
  score: number;
}

export interface ApplicationFieldConfig<T> {
  label: string;
  value: (application: T) => string;
  href?: (application: T) => string;
}

export interface ApplicationPromptConfig<T> {
  question: string;
  answer: (application: T) => string;
}

interface ApplicationsReviewTableProps<T extends ReviewApplicationBase> {
  title: string;
  applications: T[];
  columns: TableColumn<T>[];
  searchKeys: (keyof T)[];
  searchPlaceholder: string;
  emptyMessage: string;
  detailSectionTitle: string;
  acceptButtonLabel: string;
  fields: ApplicationFieldConfig<T>[];
  prompts: ApplicationPromptConfig<T>[];
}

function Field({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div>
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block text-sm text-indigo-600 hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="mt-1 text-sm text-slate-900">{value}</p>
      )}
    </div>
  );
}

function Prompt({ question, answer }: { question: string; answer: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-900">{question}</p>
      <div className="mt-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
        <p className="text-sm leading-relaxed text-slate-600">{answer}</p>
      </div>
    </div>
  );
}

// Shared table + review drawer for admin application pages.
export function ApplicationsReviewTable<T extends ReviewApplicationBase>({
  title,
  applications: initialApplications,
  columns,
  searchKeys,
  searchPlaceholder,
  emptyMessage,
  detailSectionTitle,
  acceptButtonLabel,
  fields,
  prompts,
}: ApplicationsReviewTableProps<T>) {
  const [applications, setApplications] = useState<T[]>(initialApplications);
  const { query, setQuery, results } = useTableSearch(applications, searchKeys);
  const [statusFilter, setStatusFilter] = useState<"All" | AcceptanceStatus>("All");
  const [newestFirst, setNewestFirst] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingScore, setPendingScore] = useState(0);

  const selectedApplication = applications.find((a) => a.id === selectedId) ?? null;

  useEffect(() => {
    setPendingScore(selectedApplication?.score ?? 0);
  }, [selectedApplication]);

  useEffect(() => {
    if (!selectedApplication) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedApplication]);

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

  const handleUpdate = (id: string, patch: Partial<T>) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  return (
    <>
      <div className="flex w-full flex-col">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
              <p className="mt-0.5 text-sm text-slate-500">{filteredResults.length} records</p>
            </div>
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder={searchPlaceholder}
              className="w-72"
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
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900"
            >
              {newestFirst ? "Newest first" : "Oldest first"}
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-b-2xl">
          <Table
            columns={columns}
            data={filteredResults}
            getRowId={(a) => a.id}
            onRowClick={(a) => setSelectedId(a.id)}
            emptyMessage={emptyMessage}
            className="rounded-none border-0"
          />
        </div>
      </div>

      <AnimatePresence>
        {selectedApplication && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-end bg-slate-900/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              className="flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ background: selectedApplication.avatarColor }}
                  >
                    {selectedApplication.initials}
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{selectedApplication.name}</h2>
                    <p className="font-mono text-xs text-muted-foreground">{selectedApplication.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Basic Information</h3>
                  <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4">
                    {fields.map((field) => (
                      <Field
                        key={field.label}
                        label={field.label}
                        value={field.value(selectedApplication)}
                        href={field.href?.(selectedApplication)}
                      />
                    ))}
                  </div>
                </section>

                <section className="mt-6 border-t border-slate-200 pt-5">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{detailSectionTitle}</h3>
                  <div className="mt-3 flex flex-col gap-4">
                    {prompts.map((prompt) => (
                      <Prompt
                        key={prompt.question}
                        question={prompt.question}
                        answer={prompt.answer(selectedApplication)}
                      />
                    ))}
                  </div>
                </section>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4">
                <div>
                  <p className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Reviewer Score</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPendingScore(n)}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg border font-mono text-sm font-medium transition-colors",
                          pendingScore === n
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900"
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdate(selectedApplication.id, { acceptanceStatus: "Accepted" } as Partial<T>)}
                    className="flex-1 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                  >
                    {acceptButtonLabel}
                  </button>
                  <a
                    href={`mailto:${selectedApplication.email}`}
                    className="flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                    aria-label="Email applicant"
                    title="Email applicant"
                  >
                    <Send className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleUpdate(selectedApplication.id, { score: pendingScore } as Partial<T>)}
                    className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  >
                    Save Score
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
