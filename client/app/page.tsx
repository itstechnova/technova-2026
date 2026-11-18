"use client";

import { Fragment, type CSSProperties } from "react";
import { BackgroundLayer, layerUrl } from "@/components/background-layer";
import { InterestSignupForm } from "@/components/interest-signup-form";
import { ParallaxGroup } from "@/components/parallax-group";
import {
  FRAME_HEIGHT,
  FRAME_WIDTH,
  MOBILE_ART_SCALE,
  MOBILE_FRAME_HEIGHT,
  MOBILE_FRAME_WIDTH,
} from "@/lib/frame";
import { PLANETS, planetOf, type PlanetName } from "@/lib/parallax";

type Motion = {
  kind: "spin" | "twinkle" | "breathe";
  dur: number;
  delay?: number;
  // Pivot as a percentage of the layer image; planets are exported centred, so they omit it.
  origin?: string;
};

type Layer = {
  src: string;
  // Figma frame px (the desktop layout).
  x: number;
  y: number;
  w: number;
  // Height of the exported image at width w, so a not-yet-loaded layer still has its real box.
  h: number;
  // Fetch ahead of everything else: the backdrop and the planet that frames the hero.
  priority?: boolean;
  motion?: Motion;
  /**
   * Mobile layout: where the layer's pivot (motion origin, else centre) sits in mobile px, and its
   * size relative to MOBILE_ART_SCALE; or `coverX`: fill the frame's height, left edge at that x.
   * Planet layers follow their planet (lib/parallax.ts) instead; other layers without it are left
   * out of the mobile layout.
   */
  mobile?: { x: number; y: number; scale?: number } | { coverX: number };
};

// A layer whose top edge is above this line in BOTH layouts (desktop: the hero, title down to the
// subscribe form; mobile: roughly the first phone screen) is in the server HTML and loads
// immediately. Everything else is fetched by an IntersectionObserver as it nears the viewport.
const EAGER_FOLD_Y = 700;
const MOBILE_EAGER_FOLD_Y = 700;

// Layers exported from Figma frame 81:74, in stacking order. The planets are drawn back to front
// (saturn, green, pink) so that, as they drift past each other, the nearer one passes in front.
const BACKGROUND_LAYERS: Layer[] = [
  // On mobile the backdrop fills the frame's height; this strip of it runs from the dark top through
  // the purple ribbons to the pale glow at the bottom, as the desktop page does.
  { src: "bg", x: 0, y: 0, w: 1512, h: 2761, priority: true, mobile: { coverX: -120 } },
  // Planet surfaces are split into layers that spin at different speeds so they drift past each other.
  { src: "saturn-planet-body", x: -236.5, y: -54.5, w: 640, h: 640, priority: true, motion: { kind: "spin", dur: 600 } },
  { src: "saturn-planet-bands", x: -146.5, y: 35.5, w: 460, h: 460, priority: true, motion: { kind: "spin", dur: 420 } },
  { src: "saturn-ring", x: 0, y: 0, w: 759.93, h: 510.5, priority: true },
  {
    src: "star-small", x: 978.05, y: 902.05, w: 87.9, h: 87.9,
    motion: { kind: "twinkle", dur: 4.2, delay: -1.1 },
    mobile: { x: 350, y: 1238 },
  },
  // Raised 180px above its Figma spot so the star's core clears the pink planet.
  {
    src: "big-star", x: 0, y: -425.02 - 180, w: 1512, h: 2504.89,
    motion: { kind: "breathe", dur: 8, origin: "82.63% 50.09%" },
    mobile: { x: 336, y: 128, scale: 0.6 },
  },
  {
    src: "star-med-1", x: 0, y: 395.63, w: 819.71, h: 1148.07,
    motion: { kind: "twinkle", dur: 5.2, delay: -2.3, origin: "29.96% 49.03%" },
    mobile: { x: 44, y: 598, scale: 0.9 },
  },
  {
    src: "star-med-2", x: 0, y: 0, w: 853.26, h: 599.25,
    motion: { kind: "twinkle", dur: 3.8, delay: -0.6, origin: "35.93% 7.59%" },
    // The star is near the image's top edge, so the box must start at the frame's top to hide the cut.
    mobile: { x: 262, y: 16 },
  },
  {
    src: "star-med-3", x: 686.09, y: 0, w: 825.91, h: 2761,
    motion: { kind: "twinkle", dur: 4.6, delay: -3.4, origin: "66.17% 81.51%" },
    mobile: { x: 336, y: 2080, scale: 0.8 },
  },
  {
    src: "star-med-5", x: 596.16, y: 0, w: 580.02, h: 517.18,
    motion: { kind: "twinkle", dur: 3.4, delay: -1.8, origin: "50% 43.19%" },
    mobile: { x: 354, y: 642 },
  },
  {
    src: "star-med-6", x: 28.16, y: 1326.16, w: 580.02, h: 580.02,
    motion: { kind: "twinkle", dur: 4.9, delay: -0.2, origin: "50% 49.34%" },
    mobile: { x: 306, y: 1530 },
  },
  { src: "green-planet-body", x: -212.56, y: 1870.44, w: 860, h: 860, motion: { kind: "spin", dur: 510 } },
  { src: "green-planet-bands", x: -72.56, y: 2010.44, w: 580, h: 580, motion: { kind: "spin", dur: 420 } },
  { src: "green-planet-spots", x: -72.56, y: 2010.44, w: 580, h: 580, motion: { kind: "spin", dur: 345 } },
  { src: "pink-planet-halo", x: 164.04, y: 376.6, w: 1762.8, h: 1762.8 },
  { src: "pink-planet-base", x: 500.44, y: 713, w: 1090, h: 1090, motion: { kind: "spin", dur: 780 } },
  { src: "pink-planet-color", x: 500.44, y: 713, w: 1090, h: 1090, motion: { kind: "spin", dur: 600 } },
  { src: "pink-planet-bands", x: 500.44, y: 713, w: 1090, h: 1090, motion: { kind: "spin", dur: 450 } },
  // The big star's reflection stays put while the surface turns beneath it.
  { src: "pink-planet-glint", x: 500.44, y: 713, w: 1090, h: 1090 },
];

// "Website coming soon!" arc: a smile just under the pink planet, concentric with it (centre
// 1045.44,1258; radius 600), in Figma px. It is placed like one of the planet's layers.
const ARC_BOX = { x: 560, y: 1600, w: 952 };

type Box = { x: number; y: number; w: number };
type Placement = { desktop: Box; mobile?: Box };

/** A Figma-px box that belongs to a planet, moved and scaled with it in each layout. */
function planetBox(name: PlanetName, { x, y, w }: Box): Placement {
  const { center, desktop, mobile } = PLANETS[name];
  const around = (spot: { x: number; y: number }, k: number): Box => ({
    x: spot.x + (x - center.x) * k,
    y: spot.y + (y - center.y) * k,
    w: w * k,
  });
  return {
    desktop: around(desktop, desktop.scale),
    mobile: around(mobile, mobile.scale * MOBILE_ART_SCALE),
  };
}

function layerBox(layer: Layer): Placement {
  const planet = planetOf(layer.src);
  if (planet) return planetBox(planet, layer);
  const desktop = { x: layer.x, y: layer.y, w: layer.w };
  const { mobile } = layer;
  if (!mobile) return { desktop };
  if ("coverX" in mobile) {
    return { desktop, mobile: { x: mobile.coverX, y: 0, w: layer.w * (MOBILE_FRAME_HEIGHT / layer.h) } };
  }
  const [px, py] = (layer.motion?.origin ?? "50% 50%").split(" ").map((p) => parseFloat(p) / 100);
  const k = (mobile.scale ?? 1) * MOBILE_ART_SCALE;
  return {
    desktop,
    mobile: { x: mobile.x - layer.w * px * k, y: mobile.y - layer.h * py * k, w: layer.w * k },
  };
}

const n = (v: number) => Math.round(v * 100) / 100;

/** CSS variables read by `.art` in globals.css; it switches between the two layouts. */
function placementVars({ desktop, mobile }: Placement) {
  return {
    "--x-d": n(desktop.x),
    "--y-d": n(desktop.y),
    "--w-d": n(desktop.w),
    ...(mobile && { "--x-m": n(mobile.x), "--y-m": n(mobile.y), "--w-m": n(mobile.w) }),
  };
}

// Consecutive layers of one planet share a parallax wrapper, which keeps the stacking order.
const LAYER_RUNS = BACKGROUND_LAYERS.reduce<{ planet?: PlanetName; layers: Layer[] }[]>(
  (runs, layer) => {
    const planet = planetOf(layer.src);
    const last = runs.at(-1);
    if (last && last.planet === planet) last.layers.push(layer);
    else runs.push({ planet, layers: [layer] });
    return runs;
  },
  [],
);

export default function Home() {
  return (
    // Sized from its own width (not vw, which includes a classic scrollbar) so the page ends exactly
    // where the artwork does; children are positioned in frame px against it (`--u` in globals.css).
    // `overflow: clip` (not hidden) so the oversized layers can't make it a sideways scroll container.
    <main
      className="frame relative w-full overflow-clip bg-[#111c4c]"
      style={
        {
          "--frame-width-d": FRAME_WIDTH,
          "--frame-height-d": FRAME_HEIGHT,
          "--frame-width-m": MOBILE_FRAME_WIDTH,
          "--frame-height-m": MOBILE_FRAME_HEIGHT,
        } as CSSProperties
      }
    >
      {/* ===== Background Layer ===== */}
      <div className="absolute inset-0 overflow-clip pointer-events-none select-none">
        {/* Desktop layout on viewports taller than the artwork: the backdrop mirrored below it, so its
            bottom edge continues seamlessly. Hidden (and never fetched) everywhere else. */}
        <img src={layerUrl("bg")} alt="" loading="lazy" decoding="async" className="bg-mirror" />

        {LAYER_RUNS.map(({ planet, layers }) => {
          const imgs = layers.map((layer) => {
            const { src, w, h, priority, motion } = layer;
            const box = layerBox(layer);
            return (
              <BackgroundLayer
                key={src}
                name={src}
                width={w}
                height={h}
                eager={
                  box.desktop.y < EAGER_FOLD_Y && box.mobile !== undefined && box.mobile.y < MOBILE_EAGER_FOLD_Y
                }
                priority={priority}
                className={`art${box.mobile ? "" : " max-md:hidden"}${motion ? ` anim-${motion.kind}` : ""}`}
                style={
                  {
                    ...placementVars(box),
                    "--dur": motion && `${motion.dur}s`,
                    "--delay": motion?.delay !== undefined ? `${motion.delay}s` : undefined,
                    "--origin": motion?.origin,
                  } as CSSProperties
                }
              />
            );
          });
          const key = layers[0].src;
          return planet ? (
            <ParallaxGroup key={key} planet={planet}>
              {imgs}
            </ParallaxGroup>
          ) : (
            <Fragment key={key}>{imgs}</Fragment>
          );
        })}
      </div>

      {/* ===== Content Layer ===== (positions in globals.css, per layout) */}
      <div className="absolute inset-0 z-10 overflow-clip">
        <img src="/images/logo.svg" alt="TechNova Logo" className="logo" />

        {/* Title, date, subscribe form — Figma nodes 81:160 and 162:13 */}
        <div className="hero">
          <h1
            className="hero-title"
            style={{
              fontFamily: "var(--font-righteous)",
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
          <p className="hero-date">January 22nd-24th, 2026</p>
          <p className="hero-subscribe">Subscribe for more updates coming soon!</p>
          <InterestSignupForm />
        </div>

        <ParallaxGroup planet="pink">
          <svg
            className="art pointer-events-none"
            style={
              {
                ...placementVars(planetBox("pink", ARC_BOX)),
                overflow: "visible",
                filter: "drop-shadow(0 2px 8px rgba(30, 10, 60, 0.55))",
              } as CSSProperties
            }
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
        </ParallaxGroup>
      </div>
    </main>
  );
}
