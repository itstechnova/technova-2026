import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

// Same URLs as `layerUrl` in components/background-layer.tsx, which is a client module and so
// cannot be called from the server components that render these.
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

export const fieldError = "text-sm leading-[1.35] text-tn-error";

export const eyebrow = "text-sm leading-[1.45] tracking-wide text-tn-cyan uppercase";

export const heading = "font-[family-name:var(--font-righteous)] text-tn-ink";

/** Logo + wordmark, linking home. */
export function BrandLockup({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-white.svg" alt="" width={32} height={33} />
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
