"use client";

import { useRef, useState } from "react";

import { textLink } from "@/components/portal/PortalPage";
import { buttonSecondary, controlSurface } from "@/components/portal/ui";
import type { FileQuestion } from "@/lib/application/types";
import { fileNameFromPath } from "@/lib/application/validate";
import { removeResume, saveResume } from "@/lib/resume/actions";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// The resume control, shared by the application's resume question and Profile & settings. The
// file goes straight from the browser to Storage as soon as it is picked (Storage policies keep
// each applicant to their own `<user id>/` folder); the account then records its path, so the
// resume is saved without waiting for the form around it.

/** Where the applicant's own resume opens (app/(authed)/applicant/resume/route.ts). */
const VIEW_RESUME = "/applicant/resume";
const UPLOAD_FAILED = "We couldn’t upload that file. Please try again.";

// Sent with the upload: the bucket only takes these types, and browsers don't always know them.
const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const compactButton = "min-h-11 px-5 py-2.5 text-base";
const rowAction = `${textLink} flex min-h-11 cursor-pointer items-center text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-60`;

/** Keeps a file name safe as one path segment: letters, digits, dot, dash, underscore. */
function safeFileName(name: string): string {
  const cleaned = name.normalize("NFKD").replace(/[^\w.-]+/g, "_").replace(/_+/g, "_");
  return cleaned.slice(-100) || "file";
}

function formatBytes(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${Math.round(bytes / (1024 * 1024))} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export type ResumeUpload = {
  busy: "uploading" | "removing" | null;
  error: string | null;
  upload: (file: File) => Promise<void>;
  remove: () => Promise<void>;
};

/** Uploading, replacing and removing the resume. `onChange` gets the new path ("" once removed). */
export function useResumeUpload(question: FileQuestion, onChange: (path: string) => void): ResumeUpload {
  const [busy, setBusy] = useState<ResumeUpload["busy"]>(null);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    const extension = question.accept.find((candidate) => file.name.toLowerCase().endsWith(candidate));
    if (!extension) {
      setError(`Please choose a ${question.accept.join(" or ")} file.`);
      return;
    }
    if (file.size > question.maxBytes) {
      setError(`That file is ${formatBytes(file.size)}. The limit is ${formatBytes(question.maxBytes)}.`);
      return;
    }
    if (file.size === 0) {
      setError("That file is empty. Please choose another.");
      return;
    }

    setBusy("uploading");
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setError("Your session has expired. Please log in again.");
        return;
      }
      const path = `${data.user.id}/${question.id}/${Date.now()}-${safeFileName(file.name)}`;
      const { error: storageError } = await supabase.storage
        .from(question.bucket)
        .upload(path, file, { contentType: CONTENT_TYPES[extension] ?? (file.type || undefined), upsert: false });
      if (storageError) {
        console.error("resume upload failed", storageError);
        setError(UPLOAD_FAILED);
        return;
      }

      // Recording it also clears out the file it replaces.
      const result = await saveResume(path);
      if (!result.ok) {
        void supabase.storage.from(question.bucket).remove([path]);
        setError(result.error);
        return;
      }
      onChange(result.path);
    } catch (caught) {
      console.error("resume upload failed", caught);
      setError(UPLOAD_FAILED);
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    setError(null);
    setBusy("removing");
    try {
      const result = await removeResume();
      if (result.ok) onChange("");
      else setError(result.error);
    } catch (caught) {
      console.error("resume removal failed", caught);
      setError("We couldn’t remove your resume. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  return { busy, error, upload, remove };
}

type ResumeControlProps = {
  question: FileQuestion;
  /** The stored path, or "" when there is no resume. */
  value: string;
  state: ResumeUpload;
  /** Id of the button a `<label>` points at. */
  id: string;
  describedBy?: string;
  invalid?: boolean;
  disabled?: boolean;
};

/** The file's name with Replace and Remove beside it, or a button to choose one. */
export function ResumeControl({ question, value, state, id, describedBy, invalid, disabled }: ResumeControlProps) {
  const input = useRef<HTMLInputElement>(null);
  const busy = disabled || state.busy !== null;
  const name = value ? fileNameFromPath(value) : "";
  const choose = () => input.current?.click();

  return (
    <>
      {value ? (
        <div
          className={cn(
            controlSurface,
            "flex flex-wrap items-center justify-between gap-x-6 rounded-[10px] py-1 pr-[18px] pl-[18px]",
            invalid && "border-tn-error",
          )}
        >
          <a
            href={VIEW_RESUME}
            target="_blank"
            rel="noopener noreferrer"
            className={`${textLink} min-w-0 py-2.5 text-[17px] leading-[1.35] break-all`}
          >
            {name}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <div className="flex shrink-0 items-center gap-x-5">
            <button
              type="button"
              id={id}
              data-focus-target
              onClick={choose}
              disabled={busy}
              aria-describedby={describedBy}
              className={rowAction}
            >
              {state.busy === "uploading" ? "Uploading…" : "Replace"}
              <span className="sr-only"> resume</span>
            </button>
            <button type="button" onClick={() => void state.remove()} disabled={busy} className={rowAction}>
              {state.busy === "removing" ? "Removing…" : "Remove"}
              <span className="sr-only"> resume</span>
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button
            type="button"
            id={id}
            data-focus-target
            onClick={choose}
            disabled={busy}
            aria-describedby={describedBy}
            className={cn(buttonSecondary, compactButton)}
          >
            {state.busy === "uploading" ? "Uploading…" : "Choose a file"}
          </button>
        </div>
      )}
      <input
        ref={input}
        type="file"
        accept={question.accept.join(",")}
        hidden
        tabIndex={-1}
        disabled={busy}
        onChange={(event) => {
          const file = event.target.files?.[0];
          // Cleared so picking the same file again (after an error, say) still counts as a change.
          event.target.value = "";
          if (file) void state.upload(file);
        }}
      />
      <p aria-live="polite" className="sr-only">
        {state.busy === "uploading" ? "Uploading your resume" : value ? `Resume saved: ${name}` : ""}
      </p>
    </>
  );
}
