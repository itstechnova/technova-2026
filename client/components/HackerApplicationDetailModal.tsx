'use client';

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Send, X } from "lucide-react";
import type { HackerApplication } from "@/lib/data/hackerApplications";
import { cn } from "@/lib/utils";

interface HackerApplicationDetailModalProps {
  application: HackerApplication | null;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<HackerApplication>) => void;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-900">{value}</p>
    </div>
  );
}

function Essay({ question, answer }: { question: string; answer: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-900">{question}</p>
      <div className="mt-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
        <p className="text-sm leading-relaxed text-slate-600">{answer}</p>
      </div>
    </div>
  );
}

export function HackerApplicationDetailModal({ application, onClose, onUpdate }: HackerApplicationDetailModalProps) {
  const [pendingScore, setPendingScore] = useState(application?.score ?? 0);

  useEffect(() => {
    setPendingScore(application?.score ?? 0);
  }, [application]);

  useEffect(() => {
    if (!application) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [application, onClose]);

  return (
    <AnimatePresence>
      {application && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
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
                  style={{ background: application.avatarColor }}
                >
                  {application.initials}
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{application.name}</h2>
                  <p className="font-mono text-xs text-muted-foreground">{application.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
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
                  <Field label="Full Name" value={application.name} />
                  <Field label="Email" value={application.email} />
                  <Field label="School" value={application.school} />
                  <Field label="Grad Year" value={application.gradYear} />
                  <Field label="Major" value={application.major} />
                  <Field label="Location" value={application.location} />
                  <div>
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Resume</p>
                    <a
                      href={`/resumes/${application.resumeFileName}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-sm text-indigo-600 hover:underline"
                    >
                      {application.resumeFileName}
                    </a>
                  </div>
                </div>
              </section>

              <section className="mt-6 border-t border-slate-200 pt-5">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Hacker Application</h3>
                <div className="mt-3 flex flex-col gap-4">
                  <Essay question="Why do you want to attend Technova?" answer={application.essayWhyAttend} />
                  <Essay question="What project or experience are you most proud of?" answer={application.essayProudProject} />
                  <Essay question="What do you hope to build or learn at this event?" answer={application.essayHopeToLearn} />
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
                  onClick={() => onUpdate(application.id, { acceptanceStatus: "Accepted" })}
                  className="flex-1 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                >
                  Accept as Hacker
                </button>
                <a
                  href={`mailto:${application.email}`}
                  className="flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                  aria-label="Email applicant"
                  title="Email applicant"
                >
                  <Send className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => onUpdate(application.id, { score: pendingScore })}
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
  );
}
