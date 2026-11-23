"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { BandedPlanet, art } from "@/components/landing/shared";

// Far-off planets and a satellite, behind everything. Each wanders slowly across the window on its
// own long loop (`.drift` in globals.css), and the whole layer scrolls more slowly than the page, each
// body at its own rate, so they read as distant. They are fixed to the window and start spread over
// several screens' worth of height, so different ones come into view as the page scrolls.
// For visitors who prefer reduced motion they neither wander nor shift with scrolling.

type Body = {
  key: string;
  /** Starting place: share of the window's width, and of its height (can be below the fold). */
  x: number;
  y: number;
  width: number;
  /** How far it moves per pixel scrolled: smaller = further away. */
  depth: number;
  /** Seconds for one wander, and how far it goes (shares of the window). */
  seconds: number;
  dx: number;
  dy: number;
  opacity: number;
};

const BODIES: Body[] = [
  { key: "banded", x: 8, y: 62, width: 58, depth: 0.1, seconds: 140, dx: 70, dy: -22, opacity: 0.55 },
  { key: "purple", x: 86, y: 118, width: 84, depth: 0.22, seconds: 110, dx: -74, dy: 16, opacity: 0.6 },
  { key: "green", x: 14, y: 176, width: 120, depth: 0.3, seconds: 95, dx: 66, dy: -30, opacity: 0.7 },
  { key: "satellite", x: 82, y: 70, width: 76, depth: 0.16, seconds: 46, dx: -78, dy: 44, opacity: 0.7 },
  { key: "sunset", x: 72, y: 236, width: 150, depth: 0.34, seconds: 125, dx: -60, dy: -18, opacity: 0.7 },
  { key: "banded-2", x: 30, y: 300, width: 46, depth: 0.14, seconds: 150, dx: 52, dy: 26, opacity: 0.5 },
];

function picture(key: string) {
  /* eslint-disable @next/next/no-img-element */
  switch (key.split("-")[0]) {
    case "banded":
      return <BandedPlanet className="w-full" />;
    case "purple":
      return <img src={art("purple-planet")} alt="" className="h-auto w-full" />;
    case "green":
      return <img src={art("ringed-planet-green")} alt="" className="h-auto w-full -rotate-12" />;
    case "sunset":
      return <img src={art("ringed-planet-sunset")} alt="" className="h-auto w-full" />;
    default:
      return <img src="/images/satellite.svg" alt="" className="h-auto w-full" />;
  }
  /* eslint-enable @next/next/no-img-element */
}

export function Drifters() {
  const layer = useRef<HTMLDivElement>(null);

  // `--scroll` is how far the page has scrolled, in px; each body multiplies it by its own depth.
  useEffect(() => {
    const el = layer.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      el.style.setProperty("--scroll", String(window.scrollY));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={layer} aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden select-none">
      {BODIES.map(({ key, x, y, width, depth, seconds, dx, dy, opacity }, index) => (
        <div
          key={key}
          className="absolute will-change-transform"
          style={{ left: `${x}%`, top: `${y}%`, width, opacity, transform: `translate3d(0, calc(var(--scroll, 0) * ${-depth}px), 0)` }}
        >
          <div
            className="drift"
            style={{ "--dur": `${seconds}s`, "--delay": `${-index * 17}s`, "--dx": `${dx}vw`, "--dy": `${dy}vh` } as CSSProperties}
          >
            {picture(key)}
          </div>
        </div>
      ))}
    </div>
  );
}
