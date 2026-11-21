"use client";

import { ExternalLink, X } from "lucide-react";
import { marked, type Token } from "marked";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { buttonPrimary, eyebrow, heading } from "@/components/portal/ui";
import { POLICIES, type PolicySlug } from "@/lib/application/policies";
import { cn } from "@/lib/utils";

type Loaded = { status: "loading" } | { status: "error" } | { status: "ready"; tokens: Token[] };

const textLink =
  "text-tn-cyan underline underline-offset-4 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/**
 * A policy document in a modal over the form, in the portal's colours. The Markdown comes from
 * /api/policies/[slug] and is rendered as React elements (never as HTML), so nothing in the
 * document can inject markup.
 */
export default function PolicyDialog({ policy, onClose }: { policy: PolicySlug; onClose: () => void }) {
  const { title, publisher, href } = POLICIES[policy];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [document, setDocument] = useState<Loaded>({ status: "loading" });

  // A modal <dialog>: the browser traps focus, closes on Escape and returns focus to the link.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/policies/${policy}`)
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.text();
      })
      .then((markdown) => {
        if (!cancelled) setDocument({ status: "ready", tokens: marked.lexer(markdown) });
      })
      .catch(() => {
        if (!cancelled) setDocument({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [policy]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      // A click on the dimmed area around the panel lands on the <dialog> element itself.
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      className="m-auto hidden max-h-[min(86dvh,52rem)] w-[min(46rem,calc(100vw-1.5rem))] max-w-none flex-col overflow-hidden rounded-2xl border border-tn-line bg-[#0c0536] p-0 text-tn-ink shadow-[0_24px_80px_rgba(5,0,38,0.7)] backdrop:bg-tn-bg/70 backdrop:backdrop-blur-sm open:flex"
    >
      <header className="flex items-start justify-between gap-4 border-b border-tn-line/70 px-5 pt-5 pb-4 sm:px-7">
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className={cn(eyebrow, "text-xs font-semibold")}>{publisher}</p>
          <h2 id={titleId} className={`${heading} text-2xl leading-tight sm:text-[28px]`}>
            {title}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="-mt-1 -mr-2 flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-tn-muted transition hover:bg-white/10 hover:text-tn-ink focus-visible:outline-2 focus-visible:outline-tn-cyan"
        >
          <X aria-hidden size={22} />
          <span className="sr-only">Close</span>
        </button>
      </header>

      {/* Focusable so the text can be scrolled from the keyboard. */}
      <div
        tabIndex={0}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 text-base leading-[1.6] text-tn-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tn-cyan sm:px-7"
      >
        {document.status === "loading" && (
          <div role="status" className="flex flex-col gap-3" aria-label="Loading the document">
            {["w-11/12", "w-full", "w-4/5", "w-full", "w-2/3"].map((width, index) => (
              <div key={index} className={`h-4 animate-pulse rounded bg-white/10 ${width}`} />
            ))}
          </div>
        )}
        {document.status === "error" && (
          <p role="alert" className="text-tn-ink">
            We couldn’t load this document here. You can{" "}
            <a href={href} target="_blank" rel="noopener noreferrer" className={textLink}>
              read it on GitHub
            </a>{" "}
            instead.
          </p>
        )}
        {document.status === "ready" && <div className="flex flex-col gap-4">{renderBlocks(document.tokens)}</div>}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-tn-line/70 px-5 py-3.5 sm:px-7">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${textLink} inline-flex min-h-11 items-center gap-1.5 text-[15px]`}
        >
          View original on GitHub
          <ExternalLink aria-hidden size={15} />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className={cn(buttonPrimary, "min-h-11 px-6 py-2.5 text-base")}
        >
          Done
        </button>
      </footer>
    </dialog>
  );
}

// ---------- Markdown tokens -> React ----------

// The lexer leaves character references in text as written.
const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", nbsp: " " };
const decode = (text: string) => text.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, name: string) => ENTITIES[name]);

const isSafeHref = (href: string) => /^(https?:|mailto:)/i.test(href);

const HEADING_SIZES = ["text-[22px]", "text-xl", "text-lg", "text-[17px]", "text-base", "text-base"];

function renderInline(tokens: Token[] | undefined): ReactNode {
  return tokens?.map((token, index) => {
    switch (token.type) {
      case "strong":
        return (
          <strong key={index} className="font-semibold text-tn-ink">
            {renderInline(token.tokens)}
          </strong>
        );
      case "em":
        return <em key={index}>{renderInline(token.tokens)}</em>;
      case "del":
        return <del key={index}>{renderInline(token.tokens)}</del>;
      case "codespan":
        return (
          <code key={index} className="rounded bg-white/10 px-1 py-0.5 text-[0.9em]">
            {decode(token.text)}
          </code>
        );
      case "br":
        return <br key={index} />;
      case "link":
        return isSafeHref(token.href) ? (
          <a key={index} href={token.href} target="_blank" rel="noopener noreferrer" className={`${textLink} break-words`}>
            {renderInline(token.tokens)}
          </a>
        ) : (
          <span key={index}>{renderInline(token.tokens)}</span>
        );
      case "text":
        return <span key={index}>{"tokens" in token && token.tokens ? renderInline(token.tokens) : decode(token.text)}</span>;
      case "escape":
        return <span key={index}>{decode(token.text)}</span>;
      default:
        // Raw HTML and images are left out.
        return null;
    }
  });
}

function renderBlocks(tokens: Token[]): ReactNode {
  return tokens.map((token, index) => {
    switch (token.type) {
      case "heading": {
        // The dialog title is the h2, so the document's headings start at h3.
        const Tag = token.depth <= 2 ? "h3" : "h4";
        return (
          <Tag key={index} className={`${heading} mt-2 leading-snug ${HEADING_SIZES[token.depth - 1]}`}>
            {renderInline(token.tokens)}
          </Tag>
        );
      }
      case "paragraph":
        return <p key={index}>{renderInline(token.tokens)}</p>;
      case "text":
        return <p key={index}>{"tokens" in token && token.tokens ? renderInline(token.tokens) : decode(token.text)}</p>;
      case "list": {
        const Tag = token.ordered ? "ol" : "ul";
        return (
          <Tag
            key={index}
            start={token.ordered && typeof token.start === "number" ? token.start : undefined}
            className={`flex flex-col gap-2 pl-6 marker:text-tn-cyan ${token.ordered ? "list-decimal" : "list-disc"}`}
          >
            {(token.items as { tokens: Token[] }[]).map((item, itemIndex) => (
              <li key={itemIndex} className="pl-1">
                <div className="flex flex-col gap-2">{renderBlocks(item.tokens)}</div>
              </li>
            ))}
          </Tag>
        );
      }
      case "blockquote":
        return (
          <blockquote key={index} className="flex flex-col gap-3 border-l-2 border-tn-cyan/60 pl-4">
            {renderBlocks(token.tokens ?? [])}
          </blockquote>
        );
      case "code":
        return (
          <pre key={index} className="overflow-x-auto rounded-lg bg-white/5 p-3 text-sm">
            {token.text}
          </pre>
        );
      case "hr":
        return <hr key={index} className="border-tn-line/70" />;
      default:
        // Blank lines, raw HTML and anything unrecognised are left out.
        return null;
    }
  });
}
