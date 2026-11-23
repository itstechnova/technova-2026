import type { CSSProperties, ReactNode } from "react";
import { heading } from "@/components/portal/ui";

// Pieces shared by the landing page's sections (Figma "05 · Public website · redesign v2").

/** The page column: the design's 1440px frame with 96px gutters, easing in on smaller screens. */
export const wrap = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-16 xl:px-24";

/** The frosted panel behind the sponsor invitation and the FAQ console. */
export const panel = "rounded-[32px] border border-tn-line bg-[#120838]/55 backdrop-blur-[20px]";

/** Small caps label. */
export const caps = "font-semibold uppercase leading-none tracking-[0.12em]";

/** Artwork under public/images/landing. */
export const art = (name: string) => `/images/landing/${name}.webp`;

/** The design's four-point sparkle. */
export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={`size-4 shrink-0 fill-tn-yellow ${className}`}>
      <path d="M8 0c.5 4.6 2.4 6.5 8 8-5.6 1.5-7.500 3.400-8 8-.5-4.600-2.400-6.500-8-8 5.600-1.500 7.500-3.400 8-8Z" />
    </svg>
  );
}

/** A fact or date in a dark pill with a sparkle. A label, not a button. */
export function Chip({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span
      style={style}
      className={`inline-flex items-center gap-2.5 rounded-full border border-tn-line bg-[#120838] pt-3 pr-5 pb-[11px] pl-4 text-base leading-none font-semibold text-tn-ink sm:text-[17px] ${className}`}
    >
      <Sparkle />
      {children}
    </span>
  );
}

/** A section's big Righteous title and one-line subheader. */
export function SectionHeading({
  title,
  children,
  size = "wide",
  className = "",
}: {
  title: string;
  children?: ReactNode;
  /** `wide`: one long line (80px). `stacked`: a narrower block that wraps (72px). */
  size?: "wide" | "stacked";
  className?: string;
}) {
  return (
    <div className={`scroll-in flex flex-col gap-5 ${className}`}>
      <h2
        className={`${heading} leading-[1.1] text-balance ${
          size === "wide" ? "text-[clamp(2.75rem,1.6rem+4.4vw,5rem)]" : "text-[clamp(2.75rem,1.7rem+3.6vw,4.5rem)]"
        }`}
      >
        {title}
      </h2>
      {children && <p className="max-w-[660px] text-lg leading-[1.35] text-tn-muted sm:text-[22px]">{children}</p>}
    </div>
  );
}

/** An image placed as a share of its positioned parent's box (`frame` is that box in design px). */
export function place(frame: { w: number; h: number }, x: number, y: number, w: number): CSSProperties {
  return { left: `${(x / frame.w) * 100}%`, top: `${(y / frame.h) * 100}%`, width: `${(w / frame.w) * 100}%` };
}
