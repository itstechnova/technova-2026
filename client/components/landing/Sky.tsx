import type { CSSProperties } from "react";
import { BandedPlanet, ShootingStar, art } from "@/components/landing/shared";

// The living sky behind the whole landing page, kept quiet: a field of small stars that twinkle in
// three out-of-step layers (fixed to the window, like the nebula), a meteor every so often down the
// page, a satellite wandering past, and a few small planets drifting in the margins.
// Everything here is decoration and holds still for visitors who prefer reduced motion.

// Each layer is one tile of dots, repeated. The tiles are different sizes so the repeats never line up.
const STAR_LAYERS = [
  { image: "radial-gradient(1px 1px at 235px 290px, #cfc4ff 98%, transparent), radial-gradient(1px 1px at 264px 304px, #ffffff 98%, transparent), radial-gradient(1px 1px at 415px 266px, #ffffff 98%, transparent), radial-gradient(1px 1px at 52px 232px, #ffffff 98%, transparent), radial-gradient(1.5px 1.5px at 50px 279px, #ffffff 98%, transparent), radial-gradient(1px 1px at 308px 206px, #ffffff 98%, transparent), radial-gradient(1.5px 1.5px at 323px 11px, #ffffff 98%, transparent), radial-gradient(1px 1px at 34px 22px, #ffffff 98%, transparent), radial-gradient(1px 1px at 311px 19px, #cfc4ff 98%, transparent), radial-gradient(1px 1px at 229px 306px, #ffffff 98%, transparent), radial-gradient(1px 1px at 331px 154px, #ffffff 98%, transparent), radial-gradient(1px 1px at 343px 47px, #cfc4ff 98%, transparent), radial-gradient(1px 1px at 212px 286px, #cfc4ff 98%, transparent), radial-gradient(1px 1px at 165px 392px, #cfc4ff 98%, transparent)", size: "470px 410px", dur: 5.5, delay: 0 },
  { image: "radial-gradient(2px 2px at 34px 75px, #ffffff 98%, transparent), radial-gradient(1.5px 1.5px at 414px 114px, #fdf4b8 98%, transparent), radial-gradient(2px 2px at 72px 21px, #ffffff 98%, transparent), radial-gradient(1px 1px at 222px 218px, #fdf4b8 98%, transparent), radial-gradient(1.5px 1.5px at 388px 410px, #ffffff 98%, transparent), radial-gradient(2px 2px at 583px 207px, #fdf4b8 98%, transparent), radial-gradient(1.5px 1.5px at 348px 93px, #fdf4b8 98%, transparent), radial-gradient(1px 1px at 19px 423px, #ffffff 98%, transparent), radial-gradient(1px 1px at 256px 107px, #ffffff 98%, transparent), radial-gradient(1px 1px at 480px 502px, #9edae6 98%, transparent)", size: "610px 530px", dur: 7.5, delay: -3 },
  { image: "radial-gradient(2px 2px at 576px 196px, #ffffff 98%, transparent), radial-gradient(2px 2px at 753px 138px, #ffd0f0 98%, transparent), radial-gradient(2px 2px at 123px 408px, #ffffff 98%, transparent), radial-gradient(2px 2px at 4px 280px, #ffffff 98%, transparent), radial-gradient(2px 2px at 219px 195px, #ffffff 98%, transparent), radial-gradient(1.5px 1.5px at 47px 153px, #ffd0f0 98%, transparent)", size: "830px 710px", dur: 4.2, delay: -1.5 },
];

// Meteors down the page: where (share of the page's height, side), how big, and how often.
const METEORS = [
  { top: "24%", side: "left-[4%]", width: 230, seconds: 23, delay: 9 },
  { top: "41%", side: "right-[6%]", width: 200, seconds: 31, delay: 17 },
  { top: "58%", side: "left-[30%]", width: 260, seconds: 27, delay: 4 },
  { top: "74%", side: "right-[22%]", width: 210, seconds: 37, delay: 21 },
];

const float = (dur: number, y: string, x = "0", rotate = "0deg") =>
  ({ "--dur": `${dur}s`, "--float-y": y, "--float-x": x, "--float-rotate": rotate }) as CSSProperties;

// Just outside the page column, on screens wide enough to have margins.
const leftMargin = "left-[max(0.5rem,calc(50%-720px))]";
const rightMargin = "right-[max(0.5rem,calc(50%-720px))]";

export function Sky() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none">
      {STAR_LAYERS.map(({ image, size, dur, delay }) => (
        <div
          key={size}
          className="sky-stars fixed inset-0"
          style={{ backgroundImage: image, backgroundSize: size, "--dur": `${dur}s`, "--delay": `${delay}s` } as CSSProperties}
        />
      ))}

      {METEORS.map(({ top, side, width, seconds, delay }) => (
        <ShootingStar key={top} className={`absolute opacity-80 ${side}`} style={{ top, width }} seconds={seconds} delay={delay} />
      ))}

      {/* eslint-disable @next/next/no-img-element */}
      <img src="/images/satellite.svg" alt="" className="anim-satellite-drift absolute top-[47%] left-[3%] hidden h-auto w-[84px] opacity-80 md:block" />

      <img
        src={art("saturn")}
        alt=""
        className={`anim-float absolute top-[34%] hidden h-auto w-[92px] opacity-90 xl:block ${rightMargin}`}
        style={float(23, "-14%", "-6%", "-4deg")}
      />
      <BandedPlanet className={`anim-float absolute top-[52%] hidden w-[64px] opacity-90 xl:block ${leftMargin}`} style={float(19, "-18%", "8%")} />
      <img
        src={art("purple-planet")}
        alt=""
        className={`anim-float absolute top-[68%] hidden h-auto w-[76px] opacity-80 xl:block ${rightMargin}`}
        style={float(27, "-12%", "-10%")}
      />
      <img
        src={art("ringed-planet-green")}
        alt=""
        className={`anim-float absolute top-[86%] hidden h-auto w-[110px] -rotate-12 opacity-85 xl:block ${leftMargin}`}
        style={float(21, "-10%", "6%", "5deg")}
      />
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  );
}
