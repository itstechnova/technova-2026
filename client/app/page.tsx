"use client";

import type { CSSProperties } from "react";
import { InterestSignupForm } from "@/components/interest-signup-form";
import { FRAME_WIDTH, fx } from "@/lib/frame";

type Motion = {
  kind: "spin" | "twinkle" | "breathe";
  dur: number;
  delay?: number;
  // Pivot as a percentage of the layer image; planets are exported centred, so they omit it.
  origin?: string;
};

type Layer = { src: string; x: number; y: number; w: number; motion?: Motion };

// Layers exported from Figma frame 81:74, in stacking order. x/y/w are frame pixels.
const BACKGROUND_LAYERS: Layer[] = [
  { src: "bg", x: 0, y: 0, w: 1512 },
  // Planet surfaces are split into layers that spin at different speeds so they drift past each other.
  { src: "saturn-planet-body", x: -236.5, y: -54.5, w: 640, motion: { kind: "spin", dur: 600 } },
  { src: "saturn-planet-bands", x: -146.5, y: 35.5, w: 460, motion: { kind: "spin", dur: 420 } },
  { src: "saturn-ring", x: 0, y: 0, w: 759.93 },
  { src: "star-small", x: 978.05, y: 902.05, w: 87.9, motion: { kind: "twinkle", dur: 4.2, delay: -1.1 } },
  // Raised 180px above its Figma spot so the star's core clears the pink planet.
  {
    src: "big-star", x: 0, y: -425.02 - 180, w: 1512,
    motion: { kind: "breathe", dur: 8, origin: "82.63% 50.09%" },
  },
  { src: "pink-planet-halo", x: 164.04, y: 376.6, w: 1762.8 },
  { src: "pink-planet-base", x: 500.44, y: 713, w: 1090, motion: { kind: "spin", dur: 780 } },
  { src: "pink-planet-color", x: 500.44, y: 713, w: 1090, motion: { kind: "spin", dur: 600 } },
  { src: "pink-planet-bands", x: 500.44, y: 713, w: 1090, motion: { kind: "spin", dur: 450 } },
  // The big star's reflection stays put while the surface turns beneath it.
  { src: "pink-planet-glint", x: 500.44, y: 713, w: 1090 },
  {
    src: "star-med-1", x: 0, y: 395.63, w: 819.71,
    motion: { kind: "twinkle", dur: 5.2, delay: -2.3, origin: "29.96% 49.03%" },
  },
  {
    src: "star-med-2", x: 0, y: 0, w: 853.26,
    motion: { kind: "twinkle", dur: 3.8, delay: -0.6, origin: "35.93% 7.59%" },
  },
  {
    src: "star-med-3", x: 686.09, y: 0, w: 825.91,
    motion: { kind: "twinkle", dur: 4.6, delay: -3.4, origin: "66.17% 81.51%" },
  },
  {
    src: "star-med-5", x: 596.16, y: 0, w: 580.02,
    motion: { kind: "twinkle", dur: 3.4, delay: -1.8, origin: "50% 43.19%" },
  },
  {
    src: "star-med-6", x: 28.16, y: 1326.16, w: 580.02,
    motion: { kind: "twinkle", dur: 4.9, delay: -0.2, origin: "50% 49.34%" },
  },
  { src: "green-planet-body", x: -212.56, y: 1870.44, w: 860, motion: { kind: "spin", dur: 510 } },
  { src: "green-planet-bands", x: -72.56, y: 2010.44, w: 580, motion: { kind: "spin", dur: 420 } },
  { src: "green-planet-spots", x: -72.56, y: 2010.44, w: 580, motion: { kind: "spin", dur: 345 } },
];

export default function Home() {
  return (
    <main
      className="relative w-full overflow-hidden bg-[#111c4c]"
      style={{ height: "182.6vw" }}
    >
      {/* ===== Background Layer ===== */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {BACKGROUND_LAYERS.map(({ src, x, y, w, motion }) => (
          <img
            key={src}
            src={`/images/${src}.svg`}
            alt=""
            className={motion ? `anim-${motion.kind}` : undefined}
            style={
              {
                position: "absolute",
                left: `${(x / FRAME_WIDTH) * 100}%`,
                top: fx(y),
                width: `${(w / FRAME_WIDTH) * 100}%`,
                maxWidth: "none",
                "--dur": motion && `${motion.dur}s`,
                "--delay": motion?.delay !== undefined ? `${motion.delay}s` : undefined,
                "--origin": motion?.origin,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="grain" />
      </div>

      {/* ===== Content Layer ===== */}
      <div className="relative z-10">
        {/* Logo — top right */}
        <img
          src="/images/logo.svg"
          alt="TechNova Logo"
          className="absolute"
          style={{ right: "2.3%", top: "2.6vw", width: "5.8%" }}
        />

        {/* Title, date, subscribe form — Figma nodes 81:160 and 162:13 */}
        <h1
          className="absolute whitespace-nowrap"
          style={{
            left: fx(103),
            top: fx(399),
            fontFamily: "var(--font-righteous)",
            fontSize: fx(145),
            lineHeight: 0.941,
            background:
              "linear-gradient(180deg, #ffffff 0%, #ffffff 30%, #dfc5ee 55%, #c9a0e3 75%, #B782DB 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
          }}
        >
          TechNova 6
        </h1>

        <p
          className="absolute text-white whitespace-nowrap"
          style={{
            left: fx(111),
            top: fx(558),
            fontFamily: "var(--font-josefin)",
            fontSize: fx(48),
            lineHeight: 0.941,
          }}
        >
          January 22nd-24th, 2026
        </p>

        <p
          className="absolute text-white whitespace-nowrap"
          style={{
            left: fx(113),
            top: fx(714),
            fontFamily: "var(--font-josefin)",
            fontSize: fx(40),
            lineHeight: 0.941,
          }}
        >
          Subscribe for more updates coming soon!
        </p>

        <InterestSignupForm />

        {/* Smile-shaped arc just under the pink planet (centre 1045.44,1258; radius 536) */}
        <svg
          className="absolute pointer-events-none"
          style={{
            left: fx(560),
            top: fx(1600),
            width: fx(952),
            overflow: "visible",
            filter: "drop-shadow(0 2px 8px rgba(30, 10, 60, 0.55))",
          }}
          viewBox="560 1600 952 340"
        >
          <path id="coming-soon-arc" d="M585.81 1643.67 A600 600 0 0 0 1505.07 1643.67" fill="none" />
          <text
            fill="#fff"
            fontSize={52}
            letterSpacing="0.04em"
            style={{ fontFamily: "var(--font-josefin)" }}
          >
            <textPath href="#coming-soon-arc" startOffset="50%" textAnchor="middle">
              Website coming soon!
            </textPath>
          </text>
        </svg>
      </div>
    </main>
  );
}
