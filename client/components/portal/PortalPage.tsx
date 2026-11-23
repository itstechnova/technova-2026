import type { ReactNode } from "react";
import { heading } from "@/components/portal/ui";

// Layout pieces shared by the hacker dashboard's pages: one column, 56px in from the sidebar on a
// desktop, 48px above the page title. Padding, gaps and type ease down with the window.

/** The page column. */
export function PortalPage({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 pt-6 pb-12 sm:px-8 md:pt-[clamp(1.5rem,5vh,3rem)] xl:px-14 xl:pb-16">
      <div className="flex flex-col gap-6 xl:gap-8">{children}</div>
    </div>
  );
}

/** Big Righteous title and muted subtitle. */
export function PageHeading({
  title,
  children,
  as: Title = "h1",
}: {
  title: string;
  children?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex max-w-[820px] flex-col gap-2 leading-[1.35] xl:gap-3">
      <Title
        tabIndex={-1}
        className={`${heading} title-shade w-fit pb-[0.08em] leading-[1.15] text-balance outline-none ${Title === "h2" ? "text-[clamp(1.5rem,1.2rem+1vw,2rem)]" : "text-[clamp(1.875rem,1.2rem+2vw,3rem)]"}`}
      >
        {title}
      </Title>
      {children && <div className="text-base text-tn-muted sm:text-lg">{children}</div>}
    </div>
  );
}

/** A block separated from the one above by a thin rule, with a plain heading. No card. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex max-w-[820px] flex-col gap-4 border-t border-tn-line/70 pt-6">
      <h2 className="text-xl leading-[1.35] font-semibold text-tn-ink">{title}</h2>
      {children}
    </section>
  );
}

export const textLink =
  "text-tn-cyan underline underline-offset-4 transition hover:text-tn-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tn-cyan";
