import type { CSSProperties } from "react";
import { Drifters } from "@/components/landing/Drifters";
import { ShootingStar } from "@/components/landing/shared";

// The living sky behind the whole landing page, kept quiet: a field of small stars that twinkle in
// two sparse, out-of-step layers (fixed to the window, like the nebula), a meteor every so often down the
// page, and distant planets and a satellite wandering across with parallax (Drifters).
// Everything here is decoration and holds still for visitors who prefer reduced motion.

// Each layer is one tile of dots, repeated. The tiles are different sizes so the repeats never line up.
const STAR_LAYERS = [
  { image: "radial-gradient(1px 1px at 304px 68px, #cfc4ff 98%, transparent), radial-gradient(1px 1px at 235px 540px, #fdf4b8 98%, transparent), radial-gradient(1px 1px at 557px 376px, #cfc4ff 98%, transparent), radial-gradient(1px 1px at 291px 184px, #ffffff 98%, transparent), radial-gradient(1px 1px at 854px 116px, #ffffff 98%, transparent), radial-gradient(1px 1px at 276px 227px, #fdf4b8 98%, transparent)", size: "930px 790px", dur: 7, delay: 0 },
  { image: "radial-gradient(1px 1px at 770px 96px, #fdf4b8 98%, transparent), radial-gradient(1px 1px at 699px 695px, #cfc4ff 98%, transparent), radial-gradient(1px 1px at 802px 526px, #ffffff 98%, transparent), radial-gradient(1px 1px at 517px 190px, #cfc4ff 98%, transparent)", size: "1210px 1030px", dur: 9.5, delay: -4 },
];

// Meteors down the page: where (share of the page's height, side), how big, and how often.
const METEORS = [
  { top: "36%", side: "left-[6%]", width: 220, seconds: 47, delay: 14 },
  { top: "70%", side: "right-[10%]", width: 200, seconds: 61, delay: 33 },
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
        <ShootingStar key={top} className={`absolute opacity-70 ${side}`} style={{ top, width }} seconds={seconds} delay={delay} />
      ))}

      <Drifters />
    </div>
  );
}
