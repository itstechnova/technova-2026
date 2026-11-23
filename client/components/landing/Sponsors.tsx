import type { CSSProperties } from "react";
import { SectionHeading, caps, panel, wrap } from "@/components/landing/shared";
import { TwinkleStar, buttonSecondary, heading } from "@/components/portal/ui";

// Figma "03 · Sponsors / #sponsors": the sponsors as a constellation. From `lg` up the logos, stars
// and lines are placed as shares of the design's 1248 x 420 box; below that the logos are a grid.
// The logos are not links yet.

const SPONSOR_EMAIL = "sponsor@itstechnova.org";

const BOX = { w: 1248, h: 420 };
const pct = (x: number, y: number, w: number): CSSProperties => ({
  left: `${(x / BOX.w) * 100}%`,
  top: `${(y / BOX.h) * 100}%`,
  width: `${(w / BOX.w) * 100}%`,
});

// `box` is the logo's place in the constellation; `width`/`height` the image file's size.
const SPONSORS = [
  { name: "Mintlify", file: "mintlify", width: 439, height: 98, box: [70, 70, 220] },
  { name: "Jane Street", file: "jane-street", width: 560, height: 149, box: [500, 44, 280] },
  { name: "Accenture", file: "accenture", width: 457, height: 120, box: [900, 84, 230] },
  { name: "Scotiabank", file: "scotiabank", width: 474, height: 68, box: [150, 270, 240] },
  { name: "Shopify", file: "shopify", width: 440, height: 127, box: [700, 250, 220] },
] as const;

// Star centres and sizes, and the lines that join them (indexes into STARS).
const STARS = [
  [20, 44, 35],
  [390, 36, 26],
  [820, 10, 42],
  [1232, 96, 29],
  [1040, 236, 26],
  [560, 200, 45],
  [120, 250, 29],
] as const;
const LINES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [5, 4],
  [1, 5],
  [6, 5],
  [0, 6],
] as const;
// The dashed open star: the place for the next sponsor.
const OPEN_STAR = [1150, 356] as const;

/* eslint-disable @next/next/no-img-element */

function Constellation() {
  return (
    <div className="scroll-in relative mt-16 hidden aspect-[1248/420] w-full lg:block">
      <svg aria-hidden viewBox={`0 0 ${BOX.w} ${BOX.h}`} fill="none" className="pointer-events-none absolute inset-0 size-full overflow-visible">
        {LINES.map(([from, to]) => (
          <line
            key={`${from}-${to}`}
            x1={STARS[from][0]}
            y1={STARS[from][1]}
            x2={STARS[to][0]}
            y2={STARS[to][1]}
            stroke="#cfc4ff"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
        ))}
        <line x1={STARS[4][0]} y1={STARS[4][1]} x2={OPEN_STAR[0]} y2={OPEN_STAR[1]} stroke="#cfc4ff" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="2 8" />
        <circle cx={OPEN_STAR[0]} cy={OPEN_STAR[1]} r="11" fill="#050026" stroke="#fdf4b8" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
      {STARS.map(([x, y, size], index) => (
        <TwinkleStar key={index} className="absolute" dur={3.6 + (index % 4) * 0.5} style={pct(x - size / 2, y - size / 2, size)} />
      ))}
      <ul>
        {SPONSORS.map(({ name, file, width, height, box: [x, y, w] }) => (
          <li key={name} className="absolute" style={pct(x, y, w)}>
            <img src={`/images/sponsors/${file}.webp`} alt={name} width={width} height={height} loading="lazy" className="h-auto w-full" />
          </li>
        ))}
      </ul>
      <p className="absolute text-xl leading-[1.4] whitespace-nowrap text-tn-muted" style={{ left: `${(1065 / BOX.w) * 100}%`, top: `${(380 / BOX.h) * 100}%` }}>
        And more to come!
      </p>
    </div>
  );
}

function LogoGrid() {
  return (
    <div className="mt-10 lg:hidden">
      <ul className="grid grid-cols-2 items-center gap-x-8 gap-y-9 sm:grid-cols-3">
        {SPONSORS.map(({ name, file, width, height }) => (
          <li key={name} className="scroll-in flex justify-center">
            <img src={`/images/sponsors/${file}.webp`} alt={name} width={width} height={height} loading="lazy" className="h-auto max-h-14 w-auto max-w-full" />
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
        <SectionHeading title="Our sponsors">Helping make TechNova possible.</SectionHeading>
        <Constellation />
        <LogoGrid />

        <div className={`${panel} scroll-in relative mt-16 flex flex-col gap-x-10 gap-y-9 px-7 py-9 md:flex-row md:items-center md:justify-between lg:px-10 lg:py-8`}>
          <div className="flex flex-wrap items-center gap-x-9 gap-y-5">
            <div className="flex flex-col gap-2.5">
              <h3 className={`${heading} text-[28px] leading-[1.25] sm:text-[32px]`}>Join the constellation.</h3>
              <a href={`mailto:${SPONSOR_EMAIL}`} className="w-fit text-lg text-tn-cyan underline decoration-from-font underline-offset-4 hover:text-tn-ink sm:text-[21px]">
                {SPONSOR_EMAIL}
              </a>
            </div>
            <a href={`mailto:${SPONSOR_EMAIL}`} className={`${buttonSecondary} relative`}>
              Become a sponsor
            </a>
          </div>
          <div className="flex flex-col gap-5 md:pr-6">
            <p className={`${caps} text-[15px] text-tn-cyan`}>Official event partner</p>
            <img src="/images/sponsors/mlh.webp" alt="Major League Hacking" width={400} height={168} loading="lazy" className="h-auto w-[200px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
