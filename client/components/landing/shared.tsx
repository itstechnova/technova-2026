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

// A shooting star's flight: a shallow arc from lower left to upper right, in a 400 x 160 box.
const FLIGHT = "M 4 152 Q 230 118 396 8";
// Its tail: three strokes along that same arc, from long and faint to short and bright, so it
// tapers and fades away from the head. `length` is a share of the flight (the path is 100 long).
const TAIL = [
  { length: 60, width: 1.25, colour: "#cfc4ff", opacity: 0.35 },
  { length: 40, width: 2, colour: "#ffd0f0", opacity: 0.5 },
  { length: 22, width: 2.75, colour: "#ffe3d0", opacity: 0.7 },
  { length: 9, width: 3.5, colour: "#fdf4b8", opacity: 0.95 },
];

/**
 * A shooting star that flies along its own curved trail: the head follows the arc, the tail is drawn
 * along the same arc behind it, and once the head burns out the tail drains after it. It then waits
 * out the rest of `seconds` before the next pass. Size and place it with `className`/`style` (it is
 * a 5:2 box). Left out entirely for visitors who prefer reduced motion.
 */
export function ShootingStar({
  seconds = 9,
  delay = 0,
  className = "",
  style,
}: {
  /** Time between passes. */
  seconds?: number;
  /** Seconds before the first pass. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  // Shares of `seconds`: the flight takes about a second, the tail a little longer to drain.
  const flight = 1 / seconds;
  const drained = 1.45 / seconds;
  const timing = { dur: `${seconds}s`, begin: `${delay}s`, repeatCount: "indefinite" } as const;

  return (
    <svg
      aria-hidden
      viewBox="0 0 400 160"
      fill="none"
      style={style}
      className={`pointer-events-none aspect-[5/2] overflow-visible select-none motion-reduce:hidden ${className}`}
    >
      {TAIL.map(({ length, width, colour, opacity }) => (
        <path
          key={length}
          d={FLIGHT}
          pathLength={100}
          stroke={colour}
          strokeOpacity={opacity}
          strokeWidth={width}
          strokeLinecap="round"
          // One dash of the tail's length, parked before the start of the path until the flight begins.
          strokeDasharray={`${length} 300`}
          strokeDashoffset={length}
        >
          {/* Leading edge runs the whole arc with the head, then the dash slides off its far end. */}
          <animate
            attributeName="stroke-dashoffset"
            values={`${length};${length - 100};-100;-100`}
            keyTimes={`0;${flight};${drained};1`}
            {...timing}
          />
        </path>
      ))}
      <g opacity={0}>
        <path d="M0-13C1.2-3.600 3.600-1.200 13 0 3.600 1.200 1.200 3.600 0 13-1.200 3.600-3.600 1.200-13 0-3.600-1.200-1.200-3.600 0-13Z" fill="#fdf4b8" className="drop-shadow-[0_0_6px_#fdf4b8]" />
        <animateMotion path={FLIGHT} keyPoints="0;1;1" keyTimes={`0;${flight};1`} calcMode="linear" {...timing} />
        <animate
          attributeName="opacity"
          values="0;1;1;0;0"
          keyTimes={`0;${flight * 0.12};${flight * 0.92};${flight * 1.12};1`}
          {...timing}
        />
      </g>
    </svg>
  );
}
