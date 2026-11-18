"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

// The one place a layer name becomes a URL — change the extension here.
export const layerUrl = (name: string) => `/images/${name}.webp`;

// Deferred layers start downloading once they are within half a viewport of the screen.
const ROOT_MARGIN = "50% 0px";

// One observer shared by every deferred layer; each element maps to its own "load now" callback.
const callbacks = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | undefined;

function observe(el: Element, onNear: () => void) {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer?.unobserve(entry.target);
        callbacks.get(entry.target)?.();
        callbacks.delete(entry.target);
      }
    },
    { rootMargin: ROOT_MARGIN },
  );
  callbacks.set(el, onNear);
  observer.observe(el);
  return () => {
    callbacks.delete(el);
    observer?.unobserve(el);
  };
}

// Animated layers pause while they are off screen, so the compositor isn't redrawing spinning and
// twinkling layers nobody can see. The attribute is set directly (no React state, no re-render);
// globals.css pauses `img[data-offscreen]`. A small margin resumes them just before they show.
let visibility: IntersectionObserver | undefined;

function watchVisibility(el: Element) {
  visibility ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) entry.target.toggleAttribute("data-offscreen", !entry.isIntersecting);
    },
    { rootMargin: "10% 0px" },
  );
  visibility.observe(el);
  return () => visibility?.unobserve(el);
}

type Props = {
  name: string;
  // Intrinsic size of the exported image, so a deferred layer has its real box before it loads.
  width: number;
  height: number;
  // Eager layers ship their src in the server HTML; the rest wait for the observer.
  eager?: boolean;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function BackgroundLayer({ name, width, height, eager = false, priority, className, style }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [near, setNear] = useState(eager);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (near || !ref.current) return;
    return observe(ref.current, () => setNear(true));
  }, [near]);

  const animated = className?.includes("anim-") ?? false;
  useEffect(() => {
    if (!animated || !ref.current) return;
    return watchVisibility(ref.current);
  }, [animated]);

  const sizedStyle: CSSProperties = { aspectRatio: `${width} / ${height}`, ...style };

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative vector art positioned by hand; lazy-loaded below */}
      <img
        ref={ref}
        src={near ? layerUrl(name) : undefined}
        alt=""
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        // Deferred layers fade in; eager ones paint as soon as they arrive, as before.
        data-lazy={eager ? undefined : loaded ? "loaded" : "pending"}
        onLoad={eager ? undefined : () => setLoaded(true)}
        className={className}
        style={sizedStyle}
      />
      {!eager && (
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element -- no-JS fallback for the deferred layer above */}
          <img src={layerUrl(name)} alt="" className={className} style={sizedStyle} />
        </noscript>
      )}
    </>
  );
}
