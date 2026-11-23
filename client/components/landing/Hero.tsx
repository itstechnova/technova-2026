import type { CSSProperties } from "react";
import { DeadlineCountdown } from "@/components/auth/DeadlineCountdown";
import { ApplyLink } from "@/components/landing/deadline";
import { ShootingStar, actionQuiet, art, caps, place, wrap } from "@/components/landing/shared";
import { Planet, TwinkleStar, heading } from "@/components/portal/ui";
import { EVENT_DATES_SHORT_LABEL } from "@/lib/application/config";

// Figma "01 · Launch / #top". The scene on the right is placed as shares of the design's
// 1440 x 980 frame, so it scales with the window.

const FRAME = { w: 1440, h: 980 };
const at = (x: number, y: number, w: number) => place(FRAME, x, y, w);
const order = (i: number) => ({ "--i": i }) as CSSProperties;
const float = (dur: number, y: string, x = "0", rotate = "0deg") =>
  ({ "--dur": `${dur}s`, "--float-y": y, "--float-x": x, "--float-rotate": rotate }) as CSSProperties;

// The planet's two orbit rings: ellipses through its middle, tilted like the artwork. Each is drawn
// twice, the far half behind the planet and the near half in front of it. They move three ways
// (`.ring-*` in globals.css): the pair rocks slowly about the planet, the dotted ring's dots stream
// round it, and a bright bead circles each ring, passing behind the planet and back in front.
const RING = { cx: 1090, cy: 410 };
const RINGS = [
  { rx: 396, ry: 150, stroke: "#ffd0f0", opacity: 0.55, width: 2.5, bead: { r: 6, seconds: 14, start: 0.15 } },
  { rx: 510, ry: 205, stroke: "#9edae6", opacity: 0.5, width: 2, dash: "2 10", bead: { r: 4.5, seconds: 22, start: 0.6 } },
];

/** The whole ellipse as one path: from its left end over the top (the far half), then back under. */
const lap = (rx: number, ry: number) =>
  `M ${RING.cx - rx} ${RING.cy} A ${rx} ${ry} 0 0 1 ${RING.cx + rx} ${RING.cy} A ${rx} ${ry} 0 0 1 ${RING.cx - rx} ${RING.cy}`;

function Rings({ half }: { half: "far" | "near" }) {
  const far = half === "far";
  return (
    <svg viewBox={`0 0 ${FRAME.w} ${FRAME.h}`} fill="none" className="absolute inset-0 size-full overflow-visible">
      <g className="ring-rock">
        {RINGS.map(({ rx, ry, stroke, opacity, width, dash, bead }) => (
          <g key={rx}>
            <path
              // An arc from the ellipse's left end to its right end: over the top (far) or under (near).
              d={`M ${RING.cx - rx} ${RING.cy} A ${rx} ${ry} 0 0 ${far ? 1 : 0} ${RING.cx + rx} ${RING.cy}`}
              stroke={stroke}
              strokeOpacity={opacity}
              strokeWidth={width}
              strokeDasharray={dash}
              strokeLinecap="round"
              // The near arc is drawn the other way round, so its dots run backwards to keep one direction.
              className={dash ? (far ? "ring-flow" : "ring-flow ring-flow-back") : undefined}
            />
            {/* The bead laps the full ellipse in both copies; each shows it only on its own half. */}
            <circle r={bead.r} fill={stroke} className="ring-bead" opacity={0}>
              <animateMotion dur={`${bead.seconds}s`} begin={`${-bead.start * bead.seconds}s`} repeatCount="indefinite" path={lap(rx, ry)} />
              <animate
                attributeName="opacity"
                dur={`${bead.seconds}s`}
                begin={`${-bead.start * bead.seconds}s`}
                repeatCount="indefinite"
                calcMode="discrete"
                keyTimes="0;0.5;1"
                values={far ? "1;0;0" : "0;1;1"}
              />
            </circle>
          </g>
        ))}
      </g>
    </svg>
  );
}

function Scene() {
  return (
    // The scene spans the window (up to 1680px), so the planet stays as grand as the design has it.
    <div aria-hidden className="pointer-events-none absolute top-0 left-1/2 -z-10 hidden aspect-[1440/980] w-full max-w-[1680px] -translate-x-1/2 select-none lg:block">
      {/* eslint-disable @next/next/no-img-element */}
      {/* Shooting stars on different beats. With reduced motion, the design's still comet instead. */}
      <ShootingStar className="absolute" style={at(820, 20, 440)} seconds={13} delay={1.5} />
      <img src={art("comet")} alt="" className="absolute hidden h-auto motion-reduce:block" style={at(950, 40, 230)} />

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

      <div className={`${wrap} flex flex-col items-start gap-6 pt-14 pb-24 sm:pt-20 lg:min-h-[min(62vw,980px)] lg:gap-6 lg:pt-24 lg:pb-28`}>
        <p className={`${caps} rise text-sm leading-[1.4] text-tn-cyan sm:text-base`} style={order(0)}>
          Waterloo’s largest women+ hackathon
        </p>

        <div className="flex flex-col gap-3 lg:gap-1">
          <h1
            className={`${heading} title-shade rise pb-[0.08em] text-[clamp(3.4rem,1.2rem+9.6vw,7rem)] leading-none whitespace-nowrap`}
            style={order(1)}
          >
            TechNova 6
          </h1>
          {/* The hackathon's dates sit right under the title, as its subheader. */}
          <p className={`${heading} rise text-[clamp(1.5rem,1.1rem+1.7vw,2.25rem)] leading-[1.2]`} style={order(2)}>
            {EVENT_DATES_SHORT_LABEL}
          </p>
        </div>

        <p className="rise max-w-[30ch] text-lg leading-[1.4] sm:text-xl" style={order(3)}>
          A universe of possibility. Hack with us.
        </p>

        <div className="rise mt-2" style={order(4)}>
          {/* The same deadline card and mission clock as the login and sign-up screens. */}
          <DeadlineCountdown />
        </div>

        <div className="rise mt-1 flex flex-wrap gap-3" style={order(5)}>
          <ApplyLink />
          <a href="#about" className={actionQuiet}>
            Explore the mission <span aria-hidden className="ml-3">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
