import type { ReactNode } from "react";
import { Planet, eyebrow, heading } from "@/components/portal/ui";

// Layout pieces shared by the participant portal's pages (Figma "Main content": 70px/56px padding,
// 30px between blocks, the green planet top right). Those are the sizes on a large desktop; padding,
// gaps and type ease down with the window so a laptop shows as much as the Figma frame does.

/** The page column. `art` replaces the default green planet in the top-right corner. */
export function PortalPage({ children, art }: { children: ReactNode; art?: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[1200px] overflow-x-clip px-5 pt-6 pb-12 sm:px-8 md:pt-[clamp(1.5rem,6vh,4.375rem)] xl:px-14 xl:pb-20">
      <div className="absolute top-[clamp(1rem,4vh,3rem)] right-8 hidden w-[clamp(96px,11vw,170px)] lg:block xl:right-14 [&>*]:w-full">
        {art ?? <Planet kind="green" />}
      </div>
      <div className="relative flex flex-col gap-6 xl:gap-[30px]">{children}</div>
    </div>
  );
}

/** Eyebrow, big Righteous title and muted subtitle. */
export function PageHeading({
  eyebrow: label,
  title,
  children,
  as: Title = "h1",
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex max-w-[820px] flex-col gap-2 leading-[1.35] lg:pr-28 xl:gap-3">
      <p className={`${eyebrow} font-semibold`}>{label}</p>
      <Title
        tabIndex={-1}
        className={`${heading} leading-[1.15] text-balance outline-none ${Title === "h2" ? "text-[clamp(1.75rem,1.2rem+1.6vw,2.75rem)]" : "text-[clamp(1.875rem,1.2rem+2vw,3rem)]"}`}
      >
        {title}
      </Title>
      {children && <div className="text-base text-tn-muted sm:text-lg 2xl:text-xl">{children}</div>}
    </div>
  );
}

/** Figma "Card / content": small cyan eyebrow, 26px title, muted text. */
export function InfoCard({
  eyebrow: label,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2 py-3 leading-[1.35] xl:gap-3 xl:py-6">
      <p className="text-[13px] font-semibold tracking-wide text-tn-cyan uppercase">{label}</p>
      <h3 className={`${heading} text-[22px] xl:text-[26px]`}>{title}</h3>
      {children && <div className="text-base break-words text-tn-muted xl:text-lg">{children}</div>}
    </div>
  );
}

export const textLink =
  "text-tn-cyan underline underline-offset-4 transition hover:text-tn-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tn-cyan";
