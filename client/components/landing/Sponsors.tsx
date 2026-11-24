import type { CSSProperties } from "react";
import { SectionHeading, action, wrap } from "@/components/landing/shared";
import { NORTH_STAR, SMALL_SPONSORS, SPONSORS, layoutSponsors } from "@/components/landing/sponsors-layout";
import { TwinkleStar, heading } from "@/components/portal/ui";

// Figma "03 · Sponsors / #sponsors": the sponsors as a night sky. The gold sponsor is the north
// star, the others form a constellation and the smaller sponsors a second, smaller one. From `lg`
// up everything is placed as a share of the sky's box (worked out in sponsors-layout.ts); below
// that the logos are stacked and in grids. The logos are not links yet.

const SPONSOR_EMAIL = "sponsor@itstechnova.org";

const SKY = layoutSponsors();
const pct = (x: number, y: number, w: number): CSSProperties => ({
  left: `${(x / SKY.width) * 100}%`,
  top: `${(y / SKY.height) * 100}%`,
  width: `${(w / SKY.width) * 100}%`,
});
const src = (file: string) => `/images/sponsors/${file}.webp`;

/* eslint-disable @next/next/no-img-element */

function Constellation() {
  const { north, open } = SKY;
  return (
    <div className="scroll-in relative mt-16 hidden w-full lg:block" style={{ aspectRatio: `${SKY.width} / ${SKY.height}` }}>
      <svg aria-hidden viewBox={`0 0 ${SKY.width} ${SKY.height}`} fill="none" className="pointer-events-none absolute inset-0 size-full overflow-visible">
        <defs>
          <radialGradient id="north-star-glow">
            <stop offset="0" stopColor="#fdf4b8" stopOpacity="0.3" />
            <stop offset="0.65" stopColor="#fdf4b8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={north.star.x} cy={north.star.y} r="120" fill="url(#north-star-glow)" />
        {SKY.lines.map(({ x1, y1, x2, y2, dashed }, index) => (
          <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cfc4ff" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray={dashed ? "2 8" : undefined} />
        ))}
        {/* The dashed open star: the place for the next sponsor. */}
        <circle cx={open.x} cy={open.y} r="11" fill="#050026" stroke="#fdf4b8" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
      {[north.star, ...SKY.stars].map(({ x, y, size }, index) => (
        <TwinkleStar key={index} className="absolute" dur={3.6 + (index % 4) * 0.5} style={pct(x - size / 2, y - size / 2, size)} />
      ))}
      <ul>
        {[north.logo, ...SKY.logos].map(({ name, file, width, height, x, y, w }) => (
          <li key={name} className="absolute" style={pct(x, y, w)}>
            <img src={src(file)} alt={name} width={width} height={height} loading="lazy" className="h-auto w-full" />
          </li>
        ))}
      </ul>
      <p className="absolute text-xl leading-[1.4] whitespace-nowrap text-tn-muted" style={{ left: `${((open.x - 85) / SKY.width) * 100}%`, top: `${((open.y + 24) / SKY.height) * 100}%` }}>
        And more to come!
      </p>
    </div>
  );
}

function LogoGrid() {
  return (
    <div className="mt-10 lg:hidden">
      <div className="scroll-in flex flex-col items-center gap-3">
        <TwinkleStar className="size-10" />
        <img src={src(NORTH_STAR.file)} alt={NORTH_STAR.name} width={NORTH_STAR.width} height={NORTH_STAR.height} loading="lazy" className="h-auto max-h-16 w-auto max-w-[70%]" />
      </div>
      <ul className="mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-8 sm:grid-cols-3">
        {SPONSORS.map(({ name, file, width, height }) => (
          <li key={name} className="scroll-in flex justify-center">
            <img src={src(file)} alt={name} width={width} height={height} loading="lazy" className="h-auto max-h-14 w-auto max-w-full" />
          </li>
        ))}
      </ul>
      <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {SMALL_SPONSORS.map(({ name, file, width, height }) => (
          <li key={name} className="scroll-in">
            <img src={src(file)} alt={name} width={width} height={height} loading="lazy" className="h-auto max-h-8 w-auto max-w-[9rem]" />
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center text-lg text-tn-muted">And more to come!</p>
    </div>
  );
}

export function Sponsors() {
  return (
    <section id="sponsors" className="relative">
      <div className={`${wrap} py-20 lg:py-28`}>
        <div className="flex flex-col gap-x-12 gap-y-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading title="Our sponsors">Helping make TechNova possible.</SectionHeading>
          {/* MLH, the event's official partner, sits apart from the sponsors. */}
          <div className="scroll-in flex items-center gap-4 md:pb-1">
            <p className="text-sm leading-[1.4] text-tn-muted">Official event partner</p>
            <img src="/images/sponsors/mlh.webp" alt="Major League Hacking" width={400} height={168} loading="lazy" className="h-auto w-[104px]" />
          </div>
        </div>
        <Constellation />
        <LogoGrid />

        {/* The invitation: one line, one action that opens an email, and the address under it. */}
        <div className="scroll-in mt-16 flex flex-col items-start gap-4 border-t border-tn-line/70 pt-8">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <h3 className={`${heading} title-shade pb-[0.08em] text-[clamp(1.875rem,1.4rem+1.6vw,2.75rem)] leading-[1.2]`}>Join the constellation.</h3>
            <a href={`mailto:${SPONSOR_EMAIL}`} className={action}>
              Become a sponsor
            </a>
          </div>
          <a href={`mailto:${SPONSOR_EMAIL}`} className="text-base text-tn-muted underline decoration-from-font underline-offset-4 hover:text-tn-ink">
            {SPONSOR_EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}
