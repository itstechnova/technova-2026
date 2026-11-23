"use client";

import { useRef, useState } from "react";

import { buttonSecondary } from "@/components/portal/ui";
import type { FileQuestion } from "@/lib/application/types";
import { fileNameFromPath } from "@/lib/application/validate";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

import { describedBy, QuestionShell, useFieldIds } from "./QuestionShell";

export type FileUploadFieldProps = {
  question: FileQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

// The file is uploaded to Storage as soon as it is picked and the answer is its path, so the
// draft (localStorage) only ever holds a short string. Storage policies keep each applicant to
// their own `<user id>/` folder.

const compactButton = "min-h-11 px-5 py-2.5 text-base";

/** Keeps a file name safe as one path segment: letters, digits, dot, dash, underscore. */
function safeFileName(name: string): string {
  const cleaned = name.normalize("NFKD").replace(/[^\w.-]+/g, "_").replace(/_+/g, "_");
  return cleaned.slice(-100) || "file";
}

function formatBytes(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${Math.round(bytes / (1024 * 1024))} MB` : `${Math.round(bytes / 1024)} KB`;
}

export function FileUploadField({ question, value, onChange, error, disabled }: FileUploadFieldProps) {
  const ids = useFieldIds(question);
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function upload(file: File) {
    setUploadError(null);
    const lower = file.name.toLowerCase();
    if (!question.accept.some((extension) => lower.endsWith(extension))) {
      setUploadError(`Please choose a ${question.accept.join(" or ")} file.`);
      return;
    }
    if (file.size > question.maxBytes) {
      setUploadError(`That file is ${formatBytes(file.size)}. The limit is ${formatBytes(question.maxBytes)}.`);
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setUploadError("Your session has expired. Please sign in again.");
        return;
      }
      const path = `${data.user.id}/${question.id}/${Date.now()}-${safeFileName(file.name)}`;
      const { error: storageError } = await supabase.storage
        .from(question.bucket)
        .upload(path, file, { contentType: file.type || undefined, upsert: false });
      if (storageError) {
        console.error("resume upload failed", storageError);
        setUploadError("We couldn't upload that file. Please try again.");
        return;
      }
      const previous = value;
      onChange(path);
      // The replaced file is no longer referenced; removing it is best-effort.
      if (previous) void supabase.storage.from(question.bucket).remove([previous]);
    } catch (caught) {
      console.error("resume upload failed", caught);
      setUploadError("We couldn't upload that file. Please try again.");
    } finally {
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  }

  function remove() {
    if (!value) return;
    setUploadError(null);
    void createClient().storage.from(question.bucket).remove([value]);
    onChange("");
  }

  const shownError = uploadError ?? error;
  const busy = disabled || uploading;

  return (
    <QuestionShell question={question} ids={ids} error={shownError} group>
      <input
        ref={input}
        id={ids.control}
        type="file"
        accept={question.accept.join(",")}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
        disabled={busy}
      />
      <div className="flex flex-wrap items-center gap-3">
        {value && (
          <p className="min-w-0 rounded-[10px] border border-tn-cyan px-4 py-2.5 text-base break-all text-tn-ink">
            {fileNameFromPath(value)}
          </p>
        )}
        <button
          type="button"
          data-focus-target
          onClick={() => input.current?.click()}
          disabled={busy}
          aria-describedby={describedBy(question, ids, { error: shownError ?? undefined })}
          className={cn(buttonSecondary, compactButton)}
        >
          {uploading ? "Uploading…" : value ? "Replace file" : "Upload file"}
        </button>
        {value && !uploading && (
          <button type="button" onClick={remove} disabled={busy} className={cn(buttonSecondary, compactButton)}>
            Remove
          </button>
        )}
      </div>
      <p aria-live="polite" className="sr-only">
        {uploading ? "Uploading your file" : value ? `Uploaded ${fileNameFromPath(value)}` : ""}
      </p>
    </QuestionShell>
  );
}
