import type { CSSProperties, ReactNode } from "react";
import { SectionHeading, art, wrap } from "@/components/landing/shared";
import { TwinkleStar, heading } from "@/components/portal/ui";

// Figma "03 · The experience / #experience": a flight plan with three stops. From `lg` up the stops
// sit along the dashed trajectory, placed as shares of the design's 1248 x 750 box; below that they
// stack along a straight path.

const BOX = { w: 1248, h: 750 };
const pct = (x: number, y: number, w?: number): CSSProperties => ({
  left: `${(x / BOX.w) * 100}%`,
  top: `${(y / BOX.h) * 100}%`,
  ...(w ? { width: `${(w / BOX.w) * 100}%` } : {}),
});

function Waypoint({ number, className = "", style }: { number: string; className?: string; style?: CSSProperties }) {
  return (
    <span
      aria-hidden
      style={style}
      className={`${heading} flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-tn-cyan bg-tn-bg text-xl leading-none ${className}`}
    >
      {number}
    </span>
  );
}

function Copy({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className={`${heading} text-[26px] leading-[1.1] lg:text-3xl`}>{title}</h3>
      <p className="text-lg leading-[1.4] text-tn-muted lg:text-xl">{children}</p>
    </div>
  );
}

const photo =
  "h-auto w-full transition-transform duration-500 hover:-translate-y-1.5 hover:rotate-0 drop-shadow-[0_18px_40px_rgb(5_0_38_/_0.5)]";

const STOPS = [
  { number: "01", title: "Learn with mentors", text: "Workshops and help when you get stuck." },
  { number: "02", title: "Meet your team", text: "Find collaborators and new friends." },
  { number: "03", title: "Launch your idea", text: "Build, demo, and share what you made." },
];

/* eslint-disable @next/next/no-img-element */

/** `lg` and up: the design's flight plan. */
function FlightPlan() {
  return (
    <div className="scroll-in relative mt-14 hidden aspect-[1248/750] w-full lg:block">
      {/* The trajectory spans the full 1440px frame, 96px beyond the column on each side. */}
      <svg
        aria-hidden
        viewBox="0 0 1440 427"
        fill="none"
        preserveAspectRatio="none"
        className="pointer-events-none absolute overflow-visible"
        style={{ left: `${(-96 / BOX.w) * 100}%`, top: `${(11 / BOX.h) * 100}%`, width: `${(1440 / BOX.w) * 100}%`, height: `${(427 / BOX.h) * 100}%` }}
      >
        <defs>
          <linearGradient id="trajectory" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#9edae6" />
            <stop offset="0.5" stopColor="#ffd0f0" />
            <stop offset="1" stopColor="#fdf4b8" />
          </linearGradient>
        </defs>
        <path
          d="M0 139C56 79 86 49 114 37C256-31 496 49 534 302C566 549 876 409 974 57C996-11 1256-41 1440 99"
          stroke="url(#trajectory)"
          strokeWidth="2.5"
          strokeDasharray="3 12"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <img src={art("ringed-planet-green")} alt="" aria-hidden className="anim-float absolute h-auto -rotate-[18deg]" style={{ ...pct(540, 90, 230), "--dur": "17s", "--float-y": "-6%" } as CSSProperties} />

      <img src={art("photo-build")} alt="" width={931} height={672} loading="lazy" className={`${photo} absolute rotate-3`} style={pct(0, 48, 452)} />
      <Waypoint number="01" className="absolute" style={pct(-14, 20)} />
      <div className="absolute" style={pct(20, 413, 470)}>
        <Copy title={STOPS[0].title}>{STOPS[0].text}</Copy>
      </div>

      <img src={art("photo-community")} alt="" width={876} height={574} loading="lazy" className={`${photo} absolute -rotate-[4deg]`} style={pct(480, 322, 414)} />
      <Waypoint number="02" className="absolute" style={pct(456, 316)} />
      <div className="absolute" style={pct(494, 660, 430)}>
        <Copy title={STOPS[1].title}>{STOPS[1].text}</Copy>
      </div>

      <img src={art("ringed-planet-sunset")} alt="" aria-hidden className="anim-float absolute h-auto" style={{ ...pct(880, 112, 340), "--dur": "21s", "--float-y": "-4%" } as CSSProperties} />
      {/* The satellite, launched and riding the end of the trajectory. */}
      <img src="/images/satellite.svg" alt="" aria-hidden className="anim-float absolute h-auto -rotate-[18deg]" style={{ ...pct(1090, 6, 170), "--dur": "10s", "--float-y": "-70%", "--float-x": "-22%", "--float-rotate": "14deg" } as CSSProperties} />
      <Waypoint number="03" className="absolute" style={pct(850, 40)} />
      <div className="absolute" style={pct(900, 346, 348)}>
        <Copy title={STOPS[2].title}>{STOPS[2].text}</Copy>
      </div>

      <TwinkleStar className="absolute" dur={4.6} style={pct(1010, 540, 56)} />
    </div>
  );
}

/** Below `lg`: the three stops in a column, joined by a straight dashed path. */
function FlightList() {
  const pictures = [
    <img key="a" src={art("photo-build")} alt="" width={931} height={672} loading="lazy" className={`${photo} rotate-2`} />,
    <img key="b" src={art("photo-community")} alt="" width={876} height={574} loading="lazy" className={`${photo} -rotate-2`} />,
    <div key="c" className="relative mx-auto w-[78%] py-4">
      <img src={art("ringed-planet-sunset")} alt="" className="h-auto w-full" />
      <img src="/images/satellite.svg" alt="" className="absolute -top-1 -right-3 h-auto w-[38%] -rotate-[18deg]" />
    </div>,
  ];
  return (
    <ol className="relative mt-10 flex flex-col gap-12 lg:hidden">
      <span aria-hidden className="absolute top-7 bottom-10 left-[27px] border-l-2 border-dashed border-tn-cyan/60" />
      {STOPS.map(({ number, title, text }, index) => (
        <li key={number} className="scroll-in relative flex gap-4">
          <Waypoint number={number} />
          <div className="flex min-w-0 flex-1 flex-col gap-5 pt-1">
            <div aria-hidden className="max-w-[440px]">
              {pictures[index]}
            </div>
            <Copy title={title}>{text}</Copy>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Experience() {
  return (
    <section id="experience" className="relative overflow-x-clip">
      <div className={`${wrap} py-20 lg:py-28`}>
        <SectionHeading title="The experience">Workshops, mentors, and new teammates.</SectionHeading>
        <FlightPlan />
        <FlightList />
      </div>
    </section>
  );
}
