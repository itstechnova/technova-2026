import type { CSSProperties } from "react";
import { ApplyLink, DateChips } from "@/components/landing/deadline";
import { art, caps, wrap } from "@/components/landing/shared";
import { TwinkleStar, heading } from "@/components/portal/ui";

// Figma "07 · Community & contact / #community": the closing call to action. The rocket bobs at
// rest and lifts off while Apply now is hovered (`.liftoff` in globals.css).

/* eslint-disable @next/next/no-img-element */

export function Closing() {
  return (
    <section className="closing relative">
      <div className={`${wrap} relative flex flex-col items-center gap-7 pt-24 pb-36 text-center lg:pt-28 lg:pb-52`}>
        <img
          src={art("saturn")}
          alt=""
          aria-hidden
          className="anim-float pointer-events-none absolute top-24 left-[5%] hidden h-auto w-[190px] select-none lg:block"
          style={{ "--dur": "19s", "--float-y": "-8%", "--float-x": "4%" } as CSSProperties}
        />
        <div aria-hidden className="liftoff pointer-events-none absolute top-44 right-[2%] hidden w-[130px] select-none lg:block">
          <img src={art("rocket-liftoff")} alt="" className="anim-float h-auto w-full" style={{ "--dur": "5s", "--float-y": "-5%" } as CSSProperties} />
        </div>
        <img
          src={art("comet")}
          alt=""
          aria-hidden
          className="shooting-star pointer-events-none absolute top-10 left-[30%] hidden h-auto w-[170px] select-none motion-reduce:hidden! lg:block"
          style={{ "--dur": "11s", "--delay": "3s" } as CSSProperties}
        />
        <TwinkleStar className="absolute top-[58%] left-[22%] hidden w-[70px] lg:block" dur={4.8} />
        <TwinkleStar className="absolute top-14 right-[27%] hidden w-12 lg:block" dur={3.9} />
        <TwinkleStar className="absolute top-12 left-[53%] w-9" dur={5.3} />

        <p className={`${caps} scroll-in text-[15px] text-tn-cyan`}>Ready for liftoff?</p>
        <h2 className={`${heading} scroll-in text-[clamp(2.75rem,1.2rem+6.4vw,6rem)] leading-[1.1] text-balance`}>Come build with us.</h2>
        <ApplyLink className="closing-apply" />
        <DateChips />
      </div>
    </section>
  );
}
