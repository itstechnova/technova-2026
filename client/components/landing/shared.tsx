import type { CSSProperties, ReactNode } from "react";
import { heading } from "@/components/portal/ui";

// Pieces shared by the landing page's sections (Figma "05 · Public website · redesign v2").

/** The page column: at most 1080px of content, with gutters that grow with the screen. */
export const wrap = "mx-auto w-full max-w-[1208px] px-6 sm:px-10 lg:px-16";

/** The panel behind the sponsor invitation. */
export const panel = "rounded-2xl border border-tn-line/80 bg-[#120838]/50";

// The landing page's buttons: squarer and lighter than the portal's pills.
const actionBase =
  "inline-flex cursor-pointer items-center justify-center rounded-[10px] px-5 py-3 text-base leading-[1.25] font-semibold whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
// The main action is a clear pill with a white outline; the quiet one is bare text until hovered.
export const action = `${actionBase} rounded-full! border border-white/70 px-6! text-white hover:border-white hover:bg-white/10`;
export const actionQuiet = `${actionBase} text-tn-ink hover:bg-white/10`;

/** Small caps label. */
export const caps = "font-semibold uppercase leading-none tracking-[0.12em]";

/** Artwork under public/images/landing. */
export const art = (name: string) => `/images/landing/${name}.webp`;

/** The site's four-point star, as a small inline mark. */
export function StarMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={`inline-block size-4 shrink-0 fill-tn-yellow ${className}`}>
      <path d="M8 0c.5 4.600 2.400 6.500 8 8-5.600 1.500-7.500 3.400-8 8-.5-4.600-2.400-6.500-8-8 5.600-1.500 7.500-3.400 8-8Z" />
    </svg>
  );
}

// Planets drawn in the design system's style (soft gradient bands under a grain), after its
// "Assets - Planets" sheet. Each palette is its own planet, so the page doesn't repeat one.
const PLANETS = {
  // Green, teal and gold bands on a slant.
  meadow: { bands: ["#3a8c5a", "#bfe07e", "#ddf0b4", "#4d98a0", "#245259", "#f5c85c", "#e09638"], angle: 35 },
  // Violet sinking through teal to amber.
  dusk: { bands: ["#9c6dd9", "#7a6bc4", "#4d98a0", "#3a8c8a", "#e0a23c"], angle: 90 },
  // Pale green stripes.
  mint: { bands: ["#ddf0b4", "#3a8c5a", "#bfe07e", "#f3e492", "#3a8c5a", "#ddf0b4", "#8fe0ea"], angle: 8 },
  // Warm gold burning to red.
  ember: { bands: ["#f3e492", "#f5c85c", "#e09638", "#e06563", "#a03a50"], angle: 60 },
  // Soft pinks and lilac.
  lilac: { bands: ["#ffd0f0", "#d1c4ff", "#9c6dd9", "#ff82c4", "#d1c4ff"], angle: 20 },
  // Cold blues.
  ice: { bands: ["#ffffff", "#9edae6", "#8fe0ea", "#4d98a0", "#245259"], angle: 75 },
  // Dusty rose and wine.
  rose: { bands: ["#f29191", "#ffd0f0", "#e06563", "#a03a50", "#571e1e"], angle: 110 },
} as const;

export type PlanetKind = keyof typeof PLANETS;

/** One of the drawn planets. Use each `kind` once per page: the gradient ids are per kind. */
export function DrawnPlanet({ kind, className = "", style }: { kind: PlanetKind; className?: string; style?: CSSProperties }) {
  const { bands, angle } = PLANETS[kind];
  return (
    <svg aria-hidden viewBox="0 0 200 200" style={style} className={`pointer-events-none select-none ${className}`}>
      <defs>
        <linearGradient id={`planet-${kind}-bands`} gradientTransform={`rotate(${angle} 0.5 0.5)`}>
          {bands.map((colour, index) => (
            <stop key={index} offset={index / (bands.length - 1)} stopColor={colour} />
          ))}
        </linearGradient>
        <radialGradient id={`planet-${kind}-shade`} cx="0.32" cy="0.28" r="0.9">
          <stop offset="0.45" stopColor="#050026" stopOpacity="0" />
          <stop offset="1" stopColor="#050026" stopOpacity="0.55" />
        </radialGradient>
        <filter id={`planet-${kind}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed={angle} result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.3 0.85" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <circle cx="100" cy="100" r="96" fill={`url(#planet-${kind}-bands)`} />
      <circle cx="100" cy="100" r="96" fill={`url(#planet-${kind}-shade)`} />
      <circle cx="100" cy="100" r="96" fill="#050026" opacity="0.28" filter={`url(#planet-${kind}-grain)`} />
    </svg>
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
  /** `wide`: one long line. `stacked`: a narrower block that wraps. */
  size?: "wide" | "stacked";
  className?: string;
}) {
  return (
    <div className={`scroll-in flex flex-col gap-4 ${className}`}>
      <h2
        className={`${heading} leading-[1.1] text-balance ${
          size === "wide" ? "text-[clamp(2.5rem,1.7rem+2.6vw,3.75rem)]" : "text-[clamp(2.5rem,1.7rem+2.2vw,3.5rem)]"
        }`}
      >
        {title}
      </h2>
      {children && <p className="max-w-[600px] text-lg leading-[1.4] text-tn-muted sm:text-xl">{children}</p>}
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
  once = false,
  className = "",
  style,
}: {
  /** Time between passes. */
  seconds?: number;
  /** Fly a single pass instead of repeating. */
  once?: boolean;
  /** Seconds before the first pass. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  // Shares of `seconds`: the flight takes about a second, the tail a little longer to drain.
  const flight = 1 / seconds;
  const drained = 1.45 / seconds;
  const timing = { dur: `${seconds}s`, begin: `${delay}s`, repeatCount: once ? 1 : "indefinite" } as const;

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
