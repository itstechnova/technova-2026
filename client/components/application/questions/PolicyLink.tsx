"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { PolicySlug } from "@/lib/application/policies";

// The dialog (and the Markdown parser it needs) is only downloaded when a policy is first opened.
const PolicyDialog = dynamic(() => import("@/components/application/questions/PolicyDialog"), { ssr: false });

/** A link-styled button that opens a policy document in a popup over the form. */
export function PolicyLink({ policy, label, className }: { policy: PolicySlug; label: string; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
      {open && <PolicyDialog policy={policy} onClose={() => setOpen(false)} />}
    </>
  );
}
