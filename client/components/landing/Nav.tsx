"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ApplyLink, DeadlineChip } from "@/components/landing/deadline";
import { BrandLockup } from "@/components/portal/ui";

// The sticky navigation (Figma "Sticky navbar"): logo left, section anchors centre, the deadline
// chip and Apply now on the right. The link of the section on screen is highlighted. On phones the
// anchors move into a menu.

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "sponsors", label: "Sponsors" },
  { id: "team", label: "Team" },
  { id: "faq", label: "FAQ" },
];

/** The id of the section that currently sits under the navigation bar, if any. */
function useCurrentSection(): string | null {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const sections = SECTIONS.map(({ id }) => document.getElementById(id)).filter((el) => el !== null);
    // A section counts as current while it crosses a line a third of the way down the window.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
          else setCurrent((previous) => (previous === entry.target.id ? null : previous));
        }
      },
      { rootMargin: "-33% 0px -66% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return current;
}

const anchor =
  "flex min-h-11 items-center rounded-full px-3.5 text-[17px] leading-none font-semibold transition focus-visible:outline-2 focus-visible:outline-tn-cyan";

export function Nav() {
  const current = useCurrentSection();
  const [open, setOpen] = useState(false);

  const links = (onNavigate?: () => void) =>
    SECTIONS.map(({ id, label }) => (
      <li key={id}>
        <a
          href={`#${id}`}
          aria-current={current === id ? "location" : undefined}
          onClick={onNavigate}
          className={`${anchor} ${current === id ? "bg-white/10 text-tn-ink" : "text-tn-muted hover:text-tn-ink"}`}
        >
          {label}
        </a>
      </li>
    ));

  return (
    <header className="sticky top-0 z-40 bg-tn-bg/45 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center gap-4 px-5 sm:px-8 lg:h-24 lg:px-12">
        <BrandLockup />

        <nav aria-label="Sections" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-1">{links()}</ul>
        </nav>

        {/* Room on the far right for the MLH banner, which hangs from the top of the page. */}
        <div className="ml-auto flex items-center gap-3.5 lg:ml-0 xl:mr-[120px]">
          <span className="hidden sm:block">
            <DeadlineChip />
          </span>
          <ApplyLink className="px-5! py-3! text-base! sm:px-6! sm:py-[15px]! sm:text-lg!" />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="landing-menu"
            onClick={() => setOpen(!open)}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full text-tn-ink hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-tn-cyan lg:hidden"
          >
            {open ? <X aria-hidden size={24} /> : <Menu aria-hidden size={24} />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      <nav id="landing-menu" aria-label="Sections" className={`${open ? "block" : "hidden"} border-t border-tn-line/60 px-5 pt-2 pb-4 sm:px-8 lg:hidden`}>
        <ul className="flex flex-col">{links(() => setOpen(false))}</ul>
      </nav>
    </header>
  );
}
