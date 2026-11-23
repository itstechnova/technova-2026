import type { CSSProperties } from "react";
import { DrawnPlanet, SectionHeading, art, place, wrap } from "@/components/landing/shared";
import { TwinkleStar, heading } from "@/components/portal/ui";

// Figma "02 · Your people / #about". The collage is placed as shares of its 670 x 600 design box.

const BOX = { w: 670, h: 600 };
const at = (x: number, y: number, w: number) => place(BOX, x, y, w);

const FACTS = [
  { value: "2021", label: "First TechNova" },
  { value: "6th", label: "Edition this year" },
  { value: "Jan 22–24", label: "2027, in Waterloo" },
];

function Collage() {
  return (
    <div aria-hidden className="scroll-in relative mx-auto aspect-[670/600] w-full max-w-[560px] select-none">
      {/* eslint-disable @next/next/no-img-element */}
      <div className="absolute aspect-square rounded-full border-2 border-dashed border-tn-cyan/50" style={at(50, 10, 560)} />
      <img src={art("purple-planet")} alt="" className="anim-float absolute h-auto" style={{ ...at(410, 330, 270), "--dur": "18s", "--float-y": "-4%" } as CSSProperties} />
      <div className="absolute aspect-square rounded-full border-2 border-[#ffd0f0]/80 bg-[#120838]/35" style={at(112, 52, 436)} />
      <img
        src={art("photo-community-circle")}
        alt=""
        width={800}
        height={800}
        loading="lazy"
        className="anim-breathe absolute h-auto rounded-full shadow-[0_20px_60px_rgb(5_0_38_/_0.55)] transition-transform duration-500 hover:scale-[1.03]"
        style={{ ...at(130, 70, 400), "--dur": "14s" } as CSSProperties}
      />
      <img
        src={art("photo-build-circle")}
        alt=""
        width={400}
        height={400}
        loading="lazy"
        className="absolute h-auto rounded-full border-[3px] border-tn-cyan shadow-[0_12px_32px_rgb(5_0_38_/_0.5)]"
        style={at(6, 368, 200)}
      />
      {/* A small planet travels the dashed orbit once a minute or so. */}
      <div className="anim-spin absolute aspect-square" style={{ ...at(50, 10, 560), "--dur": "54s" } as CSSProperties}>
        <DrawnPlanet kind="rose" className="absolute" style={{ left: "76%", top: "4%", width: "11%" }} />
      </div>
      <TwinkleStar className="absolute" dur={4.4} style={at(600, 250, 56)} />
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="relative">
      <div className={`${wrap} grid items-center gap-x-14 gap-y-14 py-20 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:py-24`}>
        <div className="flex flex-col gap-7">
          <SectionHeading title="About TechNova" size="stacked">
            A hackathon for women and non-binary people.
          </SectionHeading>

          <div className="scroll-in flex flex-col gap-4 text-[17px] leading-[1.55] text-tn-muted sm:text-lg">
            <p>
              <strong className="font-semibold text-tn-ink">Our mission</strong> is to give women and non-binary
              students a safe, welcoming place to start, grow and thrive in tech. We bring people together, connect
              them with mentors and career opportunities, and hand them a weekend to build something of their own.
            </p>
            <p>
              TechNova began in 2021 at the University of Waterloo and has come back every year since. TechNova 6 is
              our sixth edition. Come with an idea, or find one here. No experience needed.
            </p>
          </div>

          <dl className="scroll-in grid grid-cols-3 gap-4 border-y border-tn-line/70 py-5">
            {FACTS.map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1">
                <dd className={`${heading} text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-none`}>{value}</dd>
                <dt className="text-sm leading-[1.3] text-tn-muted">{label}</dt>
              </div>
            ))}
          </dl>

        </div>
        <Collage />
      </div>
    </section>
  );
}
