import Link from "next/link";
import { useId, type CSSProperties, type ReactNode } from "react";

// The artwork layers in public/images.
const layerUrl = (name: string) => `/images/${name}.webp`;

// Shared pieces of the login and participant-portal screens (Figma "02 · Login & participant").
// Colours are the `tn-*` theme tokens in globals.css.

export const buttonPrimary =
  "inline-flex cursor-pointer items-center justify-center rounded-[28px] bg-tn-cyan px-6 py-[15px] text-lg leading-[1.35] font-semibold text-tn-bg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60";

export const buttonSecondary =
  "inline-flex cursor-pointer items-center justify-center rounded-[28px] border border-tn-muted px-6 py-[14px] text-lg leading-[1.35] font-semibold text-tn-ink transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60";

export const fieldLabel = "text-base leading-[1.35] font-semibold text-tn-ink";

export const fieldInput =
  "w-full rounded-[10px] border border-tn-line bg-tn-bg px-4 py-3 text-[17px] leading-[1.35] 2xl:px-[18px] 2xl:py-4 2xl:text-lg text-tn-ink outline-none transition placeholder:text-tn-muted/70 focus:border-tn-cyan focus:ring-1 focus:ring-tn-cyan aria-[invalid=true]:border-tn-error disabled:opacity-70";

// Controls in the hacker dashboard (Figma "Form atoms · v2"): a light tint and a visible border so
// they read as controls on the dark page, and a 2px cyan ring on focus.
export const controlSurface = "border border-tn-muted/55 bg-white/10 transition hover:border-tn-muted";

export const controlInput =
  `w-full rounded-[10px] ${controlSurface} px-[18px] py-3.5 text-[17px] leading-[1.35] text-tn-ink outline-none placeholder:text-tn-muted/85 focus:border-tn-cyan focus:ring-2 focus:ring-tn-cyan aria-[invalid=true]:border-tn-error disabled:opacity-70`;

/** A question's prompt. */
export const questionLabel = "text-[19px] leading-[1.35] font-semibold text-tn-ink";

export const fieldError = "text-sm leading-[1.35] text-tn-error";

export const eyebrow = "text-sm leading-[1.45] tracking-wide text-tn-cyan uppercase";

export const heading = "font-[family-name:var(--font-righteous)] text-tn-ink";

// The logo's three stacked squares, top to bottom: each one's top face and edge, and where it sits.
const LOGO_LAYERS = [
  {
    y: [0, 19.06],
    face: "M32 8.05069L15.9369 0L0.000248647 8.05069L15.9369 15.8852L32 8.05069Z",
    edge: "M31.9997 10.8725L15.9379 19.0621L0 10.8725V8.0505L15.9379 15.8502L31.9997 8.04683V10.8725Z",
  },
  {
    y: [6.83, 25.89],
    face: "M31.9997 14.8784L15.9366 6.82766L0 14.8784L15.9366 22.7129L31.9997 14.8784Z",
    edge: "M31.9997 17.7002L15.9379 25.8898L0 17.7002V14.8782L15.9379 22.6778L31.9997 14.8745V17.7002Z",
  },
  {
    y: [13.6, 32.67],
    face: "M31.9997 21.6551L15.9366 13.6044L0 21.6551L15.9366 29.4896L31.9997 21.6551Z",
    edge: "M31.9997 24.477L15.9379 32.6667L0 24.477V21.655L15.9379 29.4547L31.9997 21.6513V24.477Z",
  },
];

/** The stacked-squares logo. Each square carries its own shade: white on top, lilac toward its lower edge. */
export function LogoMark({ size = 32 }: { size?: number }) {
  const id = useId();
  return (
    <svg
      aria-hidden
      viewBox="0 0 32 32.6667"
      width={size}
      height={(size * 32.6667) / 32}
      fill="none"
      className="shrink-0"
    >
      <defs>
        {LOGO_LAYERS.map(({ y }, i) => (
          <linearGradient
            key={i}
            id={`${id}-${i}`}
            gradientUnits="userSpaceOnUse"
            x1="16"
            y1={y[0]}
            x2="16"
            y2={y[1]}
          >
            <stop offset="0.25" stopColor="#fff" />
            <stop offset="1" stopColor="#B782DB" />
          </linearGradient>
        ))}
      </defs>
      {/* Bottom square first, so the ones above overlap it. */}
      {LOGO_LAYERS.map(({ face, edge }, i) => (
        <g key={i} fill={`url(#${id}-${i})`}>
          <path d={face} />
          <path d={edge} />
        </g>
      )).reverse()}
    </svg>
  );
}

/** Logo + wordmark, linking home. */
export function BrandLockup({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className={`${heading} text-[27px] leading-none`}>TechNova</span>
    </Link>
  );
}

/** The landing page's nebula backdrop, fixed behind a screen. */
export function SpaceBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-tn-bg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={layerUrl("bg")} alt="" className="h-full w-full object-cover" />
    </div>
  );
}

type PlanetLayer = { name: string; inset: string; dur?: number };

// Layer boxes as a share of the planet's outer box, and the landing page's spin periods (seconds).
const PLANET_LAYERS: Record<"green" | "pink", PlanetLayer[]> = {
  green: [
    { name: "green-planet-body", inset: "0%", dur: 510 },
    { name: "green-planet-bands", inset: "16.28%", dur: 420 },
    { name: "green-planet-spots", inset: "16.28%", dur: 345 },
  ],
  pink: [
    { name: "pink-planet-halo", inset: "0%" },
    { name: "pink-planet-base", inset: "19.08%", dur: 780 },
    { name: "pink-planet-color", inset: "19.08%", dur: 600 },
    { name: "pink-planet-bands", inset: "19.08%", dur: 450 },
    { name: "pink-planet-glint", inset: "19.08%" },
  ],
};

/**
 * A landing-page planet, layers spinning at their own speeds (`.anim-spin` in globals.css).
 * Size and position it with `className` (it is a square; give it a width).
 */
export function Planet({ kind, className = "" }: { kind: "green" | "pink"; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none relative aspect-square select-none ${className}`}>
      {PLANET_LAYERS[kind].map(({ name, inset, dur }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={name}
          src={layerUrl(name)}
          alt=""
          decoding="async"
          className={`absolute max-w-none ${dur ? "anim-spin" : ""}`}
          style={{ inset, width: `calc(100% - 2 * ${inset})`, "--dur": dur && `${dur}s` } as CSSProperties}
        />
      ))}
    </div>
  );
}

/** The landing page's small four-point star, twinkling (`.anim-twinkle`). */
export function TwinkleStar({
  className = "",
  dur = 4.2,
  style,
}: {
  className?: string;
  dur?: number;
  style?: CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      aria-hidden
      src={layerUrl("star-small")}
      alt=""
      className={`anim-twinkle pointer-events-none select-none ${className}`}
      style={{ ...style, "--dur": `${dur}s` } as CSSProperties}
    />
  );
}

/** The small caps label in a frosted pill with a yellow dot ("APPLICANT PORTAL", "PAGE NOT FOUND"). */
export function EyebrowPill({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2.5 rounded-full border border-tn-line bg-tn-surface pt-[11px] pr-5 pb-[9px] pl-4 backdrop-blur-[10px]">
      <span aria-hidden className="size-2 rounded-full bg-tn-yellow" />
      <span className="text-sm leading-none font-semibold tracking-[0.12em] text-tn-cyan uppercase">{children}</span>
    </p>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className={eyebrow}>{children}</p>;
}
