import type { CSSProperties } from "react";
import { ApplyLink, KeyDatesLine } from "@/components/landing/deadline";
import { DrawnPlanet, ShootingStar, wrap } from "@/components/landing/shared";
import { TwinkleStar, heading } from "@/components/portal/ui";

// Figma "07 · Community & contact / #community": the closing call to action.

export function Closing() {
  return (
    <section className="relative">
      <div className={`${wrap} relative flex flex-col items-center gap-6 pt-24 pb-36 text-center lg:pt-28 lg:pb-52`}>
        <DrawnPlanet
          kind="dusk"
          className="anim-float absolute top-24 left-[4%] hidden w-[120px] lg:block"
          style={{ "--dur": "19s", "--float-y": "-8%", "--float-x": "4%" } as CSSProperties}
        />
        <DrawnPlanet
          kind="mint"
          className="anim-float absolute top-44 right-[4%] hidden w-[92px] lg:block"
          style={{ "--dur": "16s", "--float-y": "-10%", "--float-x": "-6%", "--float-rotate": "-8deg" } as CSSProperties}
        />
        <ShootingStar className="absolute top-6 left-[26%] hidden w-[320px] lg:block" seconds={11} delay={3} />
        <TwinkleStar className="absolute top-[58%] left-[22%] hidden w-[70px] lg:block" dur={4.8} />
        <TwinkleStar className="absolute top-12 left-[53%] w-9" dur={5.3} />

        <p className="scroll-in text-lg leading-none text-tn-cyan">Ready for liftoff?</p>
        <h2 className={`${heading} scroll-in text-[clamp(2.5rem,1.4rem+4.4vw,4.5rem)] leading-[1.1] text-balance`}>Come build with us.</h2>
        <ApplyLink />
        <KeyDatesLine />
      </div>
    </section>
  );
}
