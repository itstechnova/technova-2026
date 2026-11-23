import type { CSSProperties } from "react";
import { Drifters } from "@/components/landing/Drifters";
import { ShootingStar } from "@/components/landing/shared";

// The living sky behind the whole landing page, kept quiet: a field of small stars that twinkle in
// three out-of-step layers (fixed to the window, like the nebula), a meteor every so often down the
// page, and distant planets and a satellite wandering across with parallax (Drifters).
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

      <Drifters />
    </div>
  );
}
