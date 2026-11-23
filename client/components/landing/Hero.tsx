import type { CSSProperties } from "react";
import { ApplyLink, Countdown, DeadlineCard } from "@/components/landing/deadline";
import { art, place, wrap } from "@/components/landing/shared";
import { EyebrowPill, Planet, TwinkleStar, buttonSecondary, heading } from "@/components/portal/ui";
import { EVENT_DATES_SHORT_LABEL } from "@/lib/application/config";

// Figma "01 · Launch / #top". The scene on the right is placed as shares of the design's
// 1440 x 980 frame, so it scales with the window.

const FRAME = { w: 1440, h: 980 };
const at = (x: number, y: number, w: number) => place(FRAME, x, y, w);
const order = (i: number) => ({ "--i": i }) as CSSProperties;
const shoot = (dur: number, delay: number) => ({ "--dur": `${dur}s`, "--delay": `${delay}s` }) as CSSProperties;
const float = (dur: number, y: string, x = "0", rotate = "0deg") =>
  ({ "--dur": `${dur}s`, "--float-y": y, "--float-x": x, "--float-rotate": rotate }) as CSSProperties;

// The planet's two orbit rings: ellipses through its middle, tilted like the artwork. Each is drawn
// twice, the far half behind the planet and the near half in front of it.
const RINGS = [
  { cx: 1090, cy: 410, rx: 396, ry: 150, stroke: "#ffd0f0", opacity: 0.55, width: 2.5 },
  { cx: 1090, cy: 410, rx: 510, ry: 205, stroke: "#9edae6", opacity: 0.5, width: 2, dash: "2 10" },
];

function Rings({ half }: { half: "far" | "near" }) {
  return (
    <svg viewBox={`0 0 ${FRAME.w} ${FRAME.h}`} fill="none" className="absolute inset-0 size-full overflow-visible">
      <g transform="rotate(-16 1090 410)">
        {RINGS.map(({ cx, cy, rx, ry, stroke, opacity, width, dash }) => (
          <path
            key={rx}
            // An arc from the ellipse's left end to its right end: over the top (far) or under (near).
            d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 ${half === "far" ? 1 : 0} ${cx + rx} ${cy}`}
            stroke={stroke}
            strokeOpacity={opacity}
            strokeWidth={width}
            strokeDasharray={dash}
            strokeLinecap="round"
          />
        ))}
      </g>
    </svg>
  );
}

function Scene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden aspect-[1440/980] select-none lg:block">
      {/* eslint-disable @next/next/no-img-element */}
      <img src={art("saturn")} alt="" className="anim-float absolute h-auto" style={{ ...at(706, 24, 124), ...float(18, "-10%", "6%") }} />
      {/* Shooting stars: the design's comet, and a smaller one further left, on different beats. */}
      <img src={art("comet")} alt="" className="shooting-star absolute h-auto" style={{ ...at(950, 40, 230), ...shoot(9, 1.5) }} />
      <img src={art("comet")} alt="" className="shooting-star absolute h-auto max-lg:hidden" style={{ ...at(430, 150, 150), ...shoot(13, 6) }} />

      <div className="anim-float absolute inset-0" style={float(20, "-1.5%", "0.8%")}>
        <Rings half="far" />
        <div className="absolute" style={at(739, -37, 825)}>
          <Planet kind="pink" className="w-full" />
        </div>
        <Rings half="near" />
      </div>

      <div className="anim-float absolute" style={{ ...at(1128, 419, 305), ...float(16, "-5%", "-3%") }}>
        <Planet kind="green" className="w-full" />
      </div>
      <img
        src="/images/satellite.svg"
        alt=""
        className="anim-float absolute h-auto"
        style={{ ...at(569, 633, 220), ...float(14, "-22%", "5%", "-5deg") }}
      />
      {/* eslint-enable @next/next/no-img-element */}

      <TwinkleStar className="absolute" dur={4.2} style={at(838, 700, 72)} />
      <TwinkleStar className="absolute" dur={5.1} style={at(40, 760, 45)} />
      <TwinkleStar className="absolute" dur={3.6} style={at(1392, 330, 30)} />
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-x-clip">
      <Scene />
      {/* Phones and tablets: the planet alone, tucked into the top corner behind the text. */}
      <div aria-hidden className="pointer-events-none absolute -top-10 -right-[38%] -z-10 w-[min(120vw,640px)] opacity-70 select-none lg:hidden">
        <Planet kind="pink" className="w-full" />
      </div>

      <div className={`${wrap} flex flex-col items-start gap-6 pt-14 pb-24 sm:pt-20 lg:min-h-[min(60vw,880px)] lg:gap-[22px] lg:pt-24 lg:pb-28`}>
        <div className="rise" style={order(0)}>
          <EyebrowPill>Waterloo’s largest women+ hackathon</EyebrowPill>
        </div>

        <div className="flex flex-col gap-3 lg:gap-1">
          <h1
            className={`${heading} title-shade rise pb-[0.08em] text-[clamp(3.6rem,0.6rem+13.4vw,9rem)] leading-none whitespace-nowrap`}
            style={order(1)}
          >
            TechNova 6
          </h1>
          {/* The hackathon's dates sit right under the title, as its subheader. */}
          <p className={`${heading} rise text-[clamp(1.75rem,1.2rem+2.2vw,2.75rem)] leading-[1.15]`} style={order(2)}>
            {EVENT_DATES_SHORT_LABEL}
          </p>
        </div>

        <p className="rise max-w-[30ch] text-xl leading-[1.4] sm:text-[25px]" style={order(3)}>
          A universe of possibility. Hack with us.
        </p>

        <div className="rise" style={order(4)}>
          <DeadlineCard />
        </div>

        <div className="rise w-full" style={order(5)}>
          <Countdown />
        </div>

        <div className="rise flex flex-wrap gap-4" style={order(6)}>
          <ApplyLink />
          <a href="#about" className={buttonSecondary}>
            Explore the mission <span aria-hidden className="ml-3">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
