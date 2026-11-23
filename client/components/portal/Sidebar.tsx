"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { signOut } from "@/lib/auth/actions";
import { APPLICATIONS_CLOSE_DATE_LABEL, APPLICATIONS_CLOSE_TIME_LABEL } from "@/lib/application/config";
import { BrandLockup } from "@/components/portal/ui";

// The participant portal's navigation (Figma "Sidebar", 240px). From `md` up it is a column pinned to
// the viewport: brand and deadline on top, the links scrolling if the window is short, and
// "Back to website" / "Sign out" always in view at the bottom. On phones it is a top bar whose menu
// button reveals the same links.

type NavItem = { label: string; href?: string };

// Items without an `href` are pages that don't exist yet: shown, but not links.
const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/applicant/dashboard" },
  { label: "My application", href: "/applicant/application" },
  { label: "My schedule" },
  { label: "Resources" },
  { label: "Profile & settings" },
  { label: "Help & support" },
];

const navItem =
  "flex min-h-11 items-center border-l-[3px] px-3 py-2.5 text-base leading-[1.35] whitespace-nowrap 2xl:text-[17px]";
const footerLink =
  "flex min-h-10 cursor-pointer items-center text-base leading-[1.35] font-semibold text-tn-muted transition hover:text-tn-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tn-cyan";

function Deadline() {
  return (
    <div className="flex flex-col gap-[5px] leading-none">
      <p className="text-xs text-tn-muted uppercase">Applications close</p>
      <p className="text-xl font-semibold text-tn-ink">{APPLICATIONS_CLOSE_DATE_LABEL}</p>
      <p className="text-base text-tn-cyan xl:text-lg">{APPLICATIONS_CLOSE_TIME_LABEL}</p>
    </div>
  );
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <ul className="flex flex-col gap-1 [@media(min-height:900px)]:md:gap-3">
      {NAV_ITEMS.map(({ label, href }) => {
        if (!href) {
          return (
            <li key={label}>
              <span
                aria-disabled="true"
                className={`${navItem} cursor-not-allowed justify-between gap-2 border-transparent font-semibold text-tn-muted/50`}
              >
                {label}
                <span className="rounded-full border border-tn-line px-1.5 py-0.5 text-[10px] leading-none tracking-wide uppercase">
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
                  ? "border-tn-cyan font-bold text-tn-cyan"
                  : "border-transparent font-semibold text-tn-muted hover:text-tn-ink"
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
    <header className="sticky top-0 z-30 bg-tn-bg/80 backdrop-blur-md md:flex md:h-dvh md:w-60 md:shrink-0 md:flex-col md:bg-tn-bg/45">
      <div className="flex items-center justify-between px-4 py-3 md:block md:pt-[clamp(1rem,4vh,2.25rem)] md:pb-0">
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
        className={`${open ? "flex" : "hidden"} max-h-[calc(100dvh-68px)] flex-col gap-4 overflow-y-auto px-4 pt-2 pb-6 md:flex md:max-h-none md:min-h-0 md:flex-1 md:gap-[clamp(0.75rem,2.5vh,1.5rem)] md:overflow-visible md:pt-[clamp(0.75rem,2.5vh,1.5rem)] md:pb-4`}
      >
        <p className="text-xs leading-[1.35] font-semibold text-tn-cyan uppercase">Participant portal</p>
        <Deadline />
        <nav aria-label="Participant portal" className="md:min-h-0 md:flex-1 md:overflow-y-auto">
          <NavLinks pathname={pathname} onNavigate={close} />
        </nav>
        <div className="flex flex-col gap-1 md:border-t md:border-tn-line/60 md:pt-2">
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
