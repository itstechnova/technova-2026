"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { ShootingStar } from "@/components/landing/shared";

// Hidden extras. Typing "nova" anywhere on the page (outside a text field) sets off a meteor
// shower. The other one is the moon over the crew, which spins when clicked (components/landing/Crew.tsx).

const WORD = "nova";

// A dozen meteors across the window, each with its own place, size and moment.
const SHOWER = Array.from({ length: 12 }, (_, index) => ({
  left: `${(index * 37 + 5) % 82}%`,
  top: `${(index * 23 + 4) % 62}%`,
  width: 220 + ((index * 53) % 180),
  delay: (index * 0.22) % 1.9,
}));

export function EasterEggs() {
  // Counts showers, so each one mounts fresh stars; 0 = none yet.
  const [shower, setShower] = useState(0);

  useEffect(() => {
    let typed = "";
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (event.key.length !== 1) return;
      typed = (typed + event.key.toLowerCase()).slice(-WORD.length);
      if (typed !== WORD) return;
      typed = "";
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      setShower((count) => count + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Clear the shower away once the last meteor has gone.
  useEffect(() => {
    if (shower === 0) return;
    const id = window.setTimeout(() => setShower(0), 4500);
    return () => window.clearTimeout(id);
  }, [shower]);

  if (shower === 0) return null;
  return (
    <div key={shower} aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {SHOWER.map(({ left, top, width, delay }) => (
        <ShootingStar key={left + top} once seconds={9} delay={delay} className="absolute" style={{ left, top, width } as CSSProperties} />
      ))}
    </div>
  );
}
