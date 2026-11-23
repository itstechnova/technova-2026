"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ApplyLink } from "@/components/landing/deadline";
import { BrandLockup } from "@/components/portal/ui";

// The sticky navigation (Figma "Sticky navbar"): logo left, section anchors centre, Apply now on
// the right. The link of the section on screen is highlighted. On phones the
// anchors move into a menu. The bar slides away while the page is scrolled down and comes back on
// scrolling up, or when the pointer reaches the top of the window.

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

/** True while the bar should be tucked away: scrolling down, away from the top of the page. */
function useHiddenOnScrollDown(): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      // Ignore jitter, and always show the bar near the top of the page.
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 120);
      last = y;
    };
    // Reaching for the top of the window brings the bar back.
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.clientY < 72) setHidden(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return hidden;
}

const anchor =
  "flex min-h-11 items-center rounded-full px-3 text-base leading-none font-semibold transition focus-visible:outline-2 focus-visible:outline-tn-cyan";

export function Nav() {
  const current = useCurrentSection();
  const [open, setOpen] = useState(false);
  // An open menu, or keyboard focus inside the bar, keeps it on screen.
  const hidden = useHiddenOnScrollDown() && !open;

  const links = (onNavigate?: () => void) =>
    SECTIONS.map(({ id, label }) => (
      <li key={id}>
        <a
          href={`#${id}`}
          aria-current={current === id ? "location" : undefined}
          onClick={onNavigate}
          className={`${anchor} ${current === id ? "text-tn-cyan" : "text-tn-ink/80 hover:text-tn-ink"}`}
        >
          {label}
        </a>
      </li>
    ));

  return (
    <header
      // No bar: the page shows through, darkened only enough at the very top to keep the links legible.
      className={`sticky top-0 z-40 bg-linear-to-b from-tn-bg/75 via-tn-bg/35 to-transparent transition-transform duration-300 ease-out focus-within:translate-y-0 motion-reduce:transition-none ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex h-[68px] w-full max-w-[1208px] items-center gap-4 px-6 sm:px-10 lg:h-[84px] lg:px-16">
        <BrandLockup />

        <nav aria-label="Sections" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-1">{links()}</ul>
        </nav>

        {/* Room on the far right for the MLH banner, which hangs from the top of the page. */}
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ApplyLink className="px-4! py-3! text-base!" />
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

      <nav id="landing-menu" aria-label="Sections" className={`${open ? "block" : "hidden"} bg-tn-bg/90 px-6 pt-1 pb-4 sm:px-10 lg:hidden`}>
        <ul className="flex flex-col">{links(() => setOpen(false))}</ul>
      </nav>
    </header>
  );
}
