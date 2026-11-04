"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { anchorY, PLANETS, registerParallax, type PlanetName } from "@/lib/parallax";

/**
 * Full-frame wrapper that drifts its children with a planet's parallax. Place it inside an
 * untransformed layer that fills the frame; children keep their frame-relative positions.
 */
export function ParallaxGroup({ planet, children }: { planet: PlanetName; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => registerParallax(ref.current!, planet), [planet]);

  const { desktop, mobile } = PLANETS[planet];
  return (
    <div
      ref={ref}
      className="parallax"
      style={
        {
          // globals.css picks the pair for the current layout.
          "--parallax-factor-d": desktop.factor,
          "--parallax-anchor-d": anchorY(planet, "desktop"),
          "--parallax-factor-m": mobile.factor,
          "--parallax-anchor-m": anchorY(planet, "mobile"),
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
