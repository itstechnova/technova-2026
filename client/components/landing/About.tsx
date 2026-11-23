import type { CSSProperties } from "react";
import { SectionHeading, Tag, art, place, wrap } from "@/components/landing/shared";
import { TwinkleStar } from "@/components/portal/ui";

// Figma "02 · Your people / #about". The collage is placed as shares of its 670 x 600 design box.

const BOX = { w: 670, h: 600 };
const at = (x: number, y: number, w: number) => place(BOX, x, y, w);

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
      {/* The moon travels the dashed orbit once a minute or so. */}
      <div className="anim-spin absolute aspect-square" style={{ ...at(50, 10, 560), "--dur": "54s" } as CSSProperties}>
        <img src="/images/cratered-moon.svg" alt="" className="absolute h-auto" style={{ left: "70%", top: "-3%", width: "29%" }} />
      </div>
      <Tag className="absolute rotate-[5deg] whitespace-nowrap shadow-lg" style={{ left: "59.7%", top: "75.3%" }}>
        Find your people
      </Tag>
      <TwinkleStar className="absolute" dur={4.4} style={at(600, 250, 56)} />
      <TwinkleStar className="absolute" dur={5.2} style={at(64, 60, 44)} />
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="relative">
      <div className={`${wrap} grid items-center gap-x-14 gap-y-14 py-20 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:py-24`}>
        <div className="flex flex-col gap-8">
          <SectionHeading title="About TechNova" size="stacked">
            A hackathon for women and non-binary people.
          </SectionHeading>
          <p className="scroll-in text-lg leading-[1.4] text-tn-muted sm:text-xl">
            Come with an idea, or find one here.
            <br />
            No experience needed.
          </p>
          <ul className="scroll-in flex flex-col gap-2 border-l-2 border-tn-cyan/60 pl-4 text-[17px] leading-[1.35] font-semibold text-tn-ink">
            {["For women + non-binary hackers", "Beginner friendly", "January 22–24, 2027"].map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>
        <Collage />
      </div>
    </section>
  );
}
