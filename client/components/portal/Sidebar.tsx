"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { signOut } from "@/lib/auth/actions";
import { timeLeftLabel, useTimeLeft } from "@/components/portal/TimeLeft";
import { BrandLockup } from "@/components/portal/ui";

// The hacker dashboard's navigation (Figma "Sidebar / hacker dashboard", 240px). From `md` up it is a
// flush rail pinned to the viewport with one hairline on its right: brand and deadline on top, the
// links scrolling if the window is short, then "Back to website" / "Sign out" under them. On phones it is a top bar whose menu
// button reveals the same links.

type NavItem = { label: string; href?: string };

// Items without an `href` are pages that don't exist yet: shown, but not links.
const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/applicant/dashboard" },
  { label: "My application", href: "/applicant/application" },
  { label: "My schedule" },
  { label: "Resources" },
  { label: "Profile & settings", href: "/applicant/profile" },
  { label: "Help & support", href: "/applicant/help" },
];

// Labels line up with the logo; the current page is marked by a cyan bar and a small indent.
const navItem = "flex min-h-11 items-center py-2.5 text-base leading-[1.35] whitespace-nowrap 2xl:text-[17px]";
const footerLink =
  "flex min-h-10 cursor-pointer items-center text-base leading-[1.35] font-semibold text-tn-muted transition hover:text-tn-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tn-cyan";

/** How long is left to apply. The date itself is on the Overview page's deadline card. */
function Deadline() {
  const remaining = useTimeLeft();
  const closed = remaining !== null && remaining <= 0;

  return (
    <div className="flex flex-col gap-[5px] leading-none">
      <p className="text-xs tracking-wide text-tn-muted uppercase">{closed ? "Applications closed" : "Applications close"}</p>
      {!closed && (
        // Reserves its line before the visitor's clock is read, so the links below don't move.
        <p className="min-h-[1em] text-sm font-semibold text-tn-yellow tabular-nums">
          {remaining !== null && `${timeLeftLabel(remaining)} left`}
        </p>
      )}
    </div>
  );
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <ul className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ label, href }) => {
        if (!href) {
          return (
            <li key={label}>
              <span
                aria-disabled="true"
                className={`${navItem} cursor-not-allowed justify-between gap-2 font-semibold text-tn-muted/50`}
              >
                {label}
                <span className="rounded border border-tn-line px-1.5 pt-1 pb-[3px] text-[10px] leading-none font-semibold tracking-[0.12em] text-tn-muted/80 uppercase">
                  Soon
                </span>
              </span>
            </li>
          );
        }
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <li key={label}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={`${navItem} transition focus-visible:outline-2 focus-visible:outline-tn-cyan ${
                active
                  ? "border-l-[3px] border-tn-cyan pl-3.5 font-bold text-tn-cyan"
                  : "font-semibold text-tn-muted hover:text-tn-ink"
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-tn-line/60 bg-tn-bg/85 md:flex md:h-dvh md:w-60 md:shrink-0 md:flex-col md:border-r md:border-b-0 md:bg-tn-bg/55">
      <div className="flex items-center justify-between px-5 py-3 md:block md:px-6 md:pt-[clamp(1rem,3.5vh,2rem)] md:pb-0">
        <BrandLockup />
        <button
          type="button"
          aria-expanded={open}
          aria-controls="portal-nav"
          onClick={() => setOpen((value) => !value)}
          className="flex size-11 cursor-pointer items-center justify-center rounded-lg text-tn-ink focus-visible:outline-2 focus-visible:outline-tn-cyan md:hidden"
        >
          {open ? <X aria-hidden size={24} /> : <Menu aria-hidden size={24} />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      <div
        id="portal-nav"
        className={`${open ? "flex" : "hidden"} max-h-[calc(100dvh-68px)] flex-col gap-4 overflow-y-auto px-5 pt-2 pb-6 md:flex md:max-h-none md:min-h-0 md:flex-1 md:gap-[clamp(0.75rem,2.2vh,1.25rem)] md:overflow-visible md:px-6 md:pt-[clamp(0.625rem,1.6vh,0.875rem)] md:pb-[clamp(1rem,3.5vh,2rem)]`}
      >
        <p className="text-xs leading-[1.35] font-semibold text-tn-cyan uppercase">Hacker dashboard</p>
        <Deadline />
        <nav aria-label="Hacker dashboard" className="md:min-h-0 md:overflow-y-auto">
          <NavLinks pathname={pathname} onNavigate={close} />
        </nav>
        <div className="flex flex-col md:pt-1">
          <Link href="/" className={footerLink}>
            Back to website
          </Link>
          <form action={signOut}>
            <button type="submit" className={footerLink}>
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
