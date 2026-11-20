// Planet depth: size and parallax, per layout.
//
// Every planet has, for each layout, a spot (`x`/`y`: where its centre sits, in that layout's frame
// px), a `scale` and a parallax `factor`. Both of the latter say how far away the planet is, so tune
// them together: a planet further back is drawn smaller AND lags the scroll more.
//
// - `scale` resizes all of the planet's layers (body, bands, spots, ring, glint, halo) about its
//   centre. 1 = as drawn in Figma (on mobile: as drawn at MOBILE_ART_SCALE).
// - `factor` is the fraction of the scroll speed the planet lags by: 0 scrolls with the page (the
//   text), so on screen a planet moves at (1 - factor) of the scroll speed.
// - Keeping them in step: on-screen speed shrinks with the size, so pushing a planet back from
//   scale 1 / factor f0 to scale s gives factor ≈ 1 - s × (1 - f0). The Figma depths (scale 1) are
//   saturn 0.3, pink 0.15, green 0.2: pink, the hero, is the nearest planet.
//
// The planet sits exactly on its spot when its anchor scroll position is reached and is offset by
// (scrollY - anchorScroll) × factor elsewhere. Browsers with scroll-driven animations evaluate that
// in CSS (`.parallax` in globals.css) off the main thread; elsewhere the fallback below applies it
// from a passive scroll listener, once per animation frame, writing only `transform`.

import { FRAME_HEIGHT, FRAME_WIDTH, MOBILE_FRAME_HEIGHT, MOBILE_FRAME_WIDTH, MOBILE_QUERY } from "@/lib/frame";

export type PlanetDepth = {
  /** Where the planet's centre sits, in that layout's frame px. */
  x: number;
  y: number;
  scale: number;
  factor: number;
};

type Planet = {
  /** Centre of the planet body in the Figma frame; every layer of the planet is scaled about it. */
  center: { x: number; y: number };
  /**
   * Scroll position at which the planet is exactly on its spot: the top of the page (so it only
   * drifts down and its cropped top edge never shows), when its centre is mid-viewport, or the
   * bottom of the page (so it only drifts up and never crosses the artwork's end).
   */
  anchor: "top" | "center" | "bottom";
  desktop: PlanetDepth;
  mobile: PlanetDepth;
};

export const PLANETS = {
  saturn: {
    center: { x: 83.5, y: 265.5 },
    anchor: "top",
    // Nudged up-left as it shrinks, so the ring still runs off the left edge and the body off the top.
    desktop: { x: 70, y: 250, scale: 0.86, factor: 0.4 },
    // Peeking in at the top-left corner, furthest away.
    mobile: { x: 22, y: 88, scale: 0.7, factor: 0.5 },
  },
  pink: {
    center: { x: 1045.44, y: 1258 },
    anchor: "center",
    // The hero and the nearest planet; the "Website coming soon!" arc rides along.
    desktop: { x: 1045.44, y: 1258, scale: 1, factor: 0.15 },
    mobile: { x: 250, y: 880, scale: 1, factor: 0.15 },
  },
  green: {
    center: { x: 217.44, y: 2300.44 },
    anchor: "bottom",
    desktop: { x: 217.44, y: 2300.44, scale: 0.86, factor: 0.31 },
    mobile: { x: 92, y: 1960, scale: 0.75, factor: 0.4 },
  },
} satisfies Record<string, Planet>;

export type PlanetName = keyof typeof PLANETS;

/** Which planet a background layer belongs to, by its file name. */
export function planetOf(src: string): PlanetName | undefined {
  if (src.startsWith("saturn-")) return "saturn";
  if (src.startsWith("pink-planet-")) return "pink";
  if (src.startsWith("green-planet-")) return "green";
}

/** Frame-px y that is mid-viewport when the planet is on its spot (0 / frame height pin it to the page's top / bottom). */
export function anchorY(name: PlanetName, layout: "desktop" | "mobile") {
  const planet: Planet = PLANETS[name];
  if (planet.anchor === "top") return 0;
  if (planet.anchor === "bottom") return layout === "desktop" ? FRAME_HEIGHT : MOBILE_FRAME_HEIGHT;
  return planet[layout].y;
}

// ---------- JS fallback ----------

type Entry = { el: HTMLElement; planet: PlanetName; factor: number; anchor: number };

const entries = new Set<Entry>();
let maxScroll = 0;
let frame = 0;
let enabled = false;
let teardown: (() => void) | undefined;

const supportsScrollTimeline = () =>
  typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()");

// Layout reads happen here only: on mount, resize and when the frame changes size.
function measure() {
  maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const viewport = window.innerHeight;
  const layout = window.matchMedia(MOBILE_QUERY).matches ? "mobile" : "desktop";
  const frameWidth = layout === "mobile" ? MOBILE_FRAME_WIDTH : FRAME_WIDTH;
  for (const entry of entries) {
    // The wrapper fills the untransformed frame layer it sits in.
    const frameBox = (entry.el.parentElement ?? entry.el).getBoundingClientRect();
    const unit = frameBox.width / frameWidth;
    const focal = frameBox.top + window.scrollY + anchorY(entry.planet, layout) * unit;
    entry.factor = PLANETS[entry.planet][layout].factor;
    entry.anchor = Math.min(Math.max(focal - viewport / 2, 0), Math.max(maxScroll, 0));
  }
  apply();
}

function apply() {
  frame = 0;
  const y = window.scrollY;
  for (const { el, factor, anchor } of entries) {
    const offset = maxScroll > 0 ? (y - anchor) * factor : 0;
    el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
  }
}

const onScroll = () => {
  if (!frame) frame = requestAnimationFrame(apply);
};
const onResize = () => {
  if (!enabled) return;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(measure);
};

function setEnabled(on: boolean) {
  if (on === enabled) return;
  enabled = on;
  if (on) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    measure();
  } else {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    cancelAnimationFrame(frame);
    frame = 0;
    for (const { el } of entries) el.style.transform = "";
  }
}

function start() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sync = () => setEnabled(!reduced.matches);
  // Catches the frame resizing without a window resize (e.g. scrollbar appearing).
  const observer = new ResizeObserver(onResize);
  observer.observe(document.documentElement);
  reduced.addEventListener("change", sync);
  sync();
  return () => {
    reduced.removeEventListener("change", sync);
    observer.disconnect();
    setEnabled(false);
  };
}

/** Registers a planet wrapper with the JS fallback; returns the cleanup. No-op where CSS drives it. */
export function registerParallax(el: HTMLElement, planet: PlanetName) {
  if (supportsScrollTimeline()) return () => {};
  const entry: Entry = { el, planet, factor: 0, anchor: 0 };
  entries.add(entry);
  if (!teardown) teardown = start();
  else onResize();
  return () => {
    entries.delete(entry);
    el.style.transform = "";
    if (!entries.size) {
      teardown?.();
      teardown = undefined;
    }
  };
}
