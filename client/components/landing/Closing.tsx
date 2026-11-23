import type { CSSProperties } from "react";
import { ApplyLink, KeyDatesLine } from "@/components/landing/deadline";
import { BandedPlanet, ShootingStar, art, wrap } from "@/components/landing/shared";
import { TwinkleStar, heading } from "@/components/portal/ui";

// Figma "07 · Community & contact / #community": the closing call to action. The rocket bobs at
// rest and lifts off while Apply now is hovered (`.liftoff` in globals.css).

/* eslint-disable @next/next/no-img-element */

export function Closing() {
  return (
    <section className="closing relative">
      <div className={`${wrap} relative flex flex-col items-center gap-6 pt-24 pb-36 text-center lg:pt-28 lg:pb-52`}>
        <BandedPlanet
          className="anim-float absolute top-24 left-[4%] hidden w-[120px] lg:block"
          style={{ "--dur": "19s", "--float-y": "-8%", "--float-x": "4%" } as CSSProperties}
        />
        {/* The design system's rocket, turned nose-up on the launch pad. */}
        <div aria-hidden className="liftoff pointer-events-none absolute top-36 right-0 hidden w-[190px] select-none lg:block">
          <img src={art("rocket-red")} alt="" className="anim-float h-auto w-full rotate-[55deg]" style={{ "--dur": "5s", "--float-y": "-4%" } as CSSProperties} />
        </div>
        <ShootingStar className="absolute top-6 left-[26%] hidden w-[320px] lg:block" seconds={11} delay={3} />
        <TwinkleStar className="absolute top-[58%] left-[22%] hidden w-[70px] lg:block" dur={4.8} />
        <TwinkleStar className="absolute top-14 right-[27%] hidden w-12 lg:block" dur={3.9} />
        <TwinkleStar className="absolute top-12 left-[53%] w-9" dur={5.3} />

        <p className="scroll-in text-lg leading-none text-tn-cyan">Ready for liftoff?</p>
        <h2 className={`${heading} scroll-in text-[clamp(2.5rem,1.4rem+4.4vw,4.5rem)] leading-[1.1] text-balance`}>Come build with us.</h2>
        <ApplyLink className="closing-apply" />
        <KeyDatesLine />
      </div>
    </section>
  );
}
