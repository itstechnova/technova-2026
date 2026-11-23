"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { DrawnPlanet, type PlanetKind } from "@/components/landing/shared";

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

// Kept sparse and slow so the background stays calm. Neither planet appears elsewhere on the page.
const BODIES: Body[] = [
  { key: "ember", x: 6, y: 78, width: 54, depth: 0.12, seconds: 240, dx: 34, dy: -12, opacity: 0.5 },
  { key: "ice", x: 88, y: 190, width: 88, depth: 0.26, seconds: 280, dx: -30, dy: 10, opacity: 0.55 },
];

function picture(key: string) {
  if (key === "satellite") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/images/satellite.svg" alt="" className="h-auto w-full" />;
  }
  return <DrawnPlanet kind={key as PlanetKind} className="w-full" />;
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
