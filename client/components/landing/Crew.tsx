"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { SectionHeading, wrap } from "@/components/landing/shared";
import { heading } from "@/components/portal/ui";
import { CREW, DEPARTMENTS, type CrewMember, type Department } from "@/lib/crew";

// Figma "Team / continuous crew strip": the organizing team standing on the moon. The strip drifts
// slowly and loops; hovering it (or focusing it) pauses the drift and shows each person's name and
// role, and it can be dragged, swiped or scrolled. The department tabs swap who is in the strip.
// Nobody is a link yet.

type Filter = "All crew" | Department;
const FILTERS: Filter[] = ["All crew", ...DEPARTMENTS];

// One pass of the full crew takes about 80 seconds.
const PIXELS_PER_SECOND = 88;
// How far down each person stands, in turn, so the line isn't ruler-straight.
const STAGGER = [24, 0, 32, 12, 40, 8];
// Characters are drawn 250px tall (their files are 395px tall, for sharp screens).
const SCALE = 250 / 395;

function Member({ member, index }: { member: CrewMember; index: number }) {
  return (
    <li className="group/member flex w-[168px] shrink-0 flex-col items-center justify-end sm:w-[188px]" style={{ paddingBottom: 40 - STAGGER[index % STAGGER.length] }}>
      <figure className="flex flex-col items-center gap-3">
        {/* Always shown where there is no hover (touch screens); otherwise on hover or focus. */}
        <figcaption className="flex flex-col items-center gap-1 text-center opacity-0 transition-opacity duration-200 group-hover/member:opacity-100 group-focus-within/strip:opacity-100 [@media(hover:none)]:opacity-100">
          <span className={`${heading} text-xl leading-none`}>{member.name}</span>
          <span className="text-[13px] leading-[1.2] text-tn-muted">{member.role}</span>
        </figcaption>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/images/crew/${member.slug}.webp`}
          alt=""
          width={Math.round(member.width * SCALE)}
          height={Math.round(member.height * SCALE)}
          loading="lazy"
          draggable={false}
          className="max-w-none transition-transform duration-300 select-none group-hover/member:-translate-y-1.5"
        />
      </figure>
    </li>
  );
}

function Strip({ people }: { people: CrewMember[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const drag = useRef<{ x: number; left: number } | null>(null);
  // A small group fits on screen and stands still; a long one is doubled so it can loop.
  const loops = people.length > 7;

  useEffect(() => {
    const el = scroller.current;
    if (!el || !loops) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let last = performance.now();
    let position = el.scrollLeft;
    const step = (time: number) => {
      const elapsed = Math.min(time - last, 60);
      last = time;
      if (paused.current) {
        // Pick up from wherever the visitor left it.
        position = el.scrollLeft;
      } else {
        const half = el.scrollWidth / 2;
        position += (elapsed / 1000) * PIXELS_PER_SECOND;
        if (position >= half) position -= half;
        el.scrollLeft = position;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [loops]);

  /** Keeps a dragged or scrolled strip inside its first copy, so it never runs out. */
  function wrapAround() {
    const el = scroller.current;
    if (!el || !loops) return;
    const half = el.scrollWidth / 2;
    if (el.scrollLeft >= half) el.scrollLeft -= half;
    else if (el.scrollLeft <= 0) el.scrollLeft += half;
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    // Touch already scrolls the strip natively.
    if (event.pointerType !== "mouse" || !scroller.current) return;
    drag.current = { x: event.clientX, left: scroller.current.scrollLeft };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current || !scroller.current) return;
    scroller.current.scrollLeft = drag.current.left - (event.clientX - drag.current.x);
  }

  const list = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className={`flex shrink-0 ${loops ? "" : "px-5"}`}>
      {people.map((member, index) => (
        <Member key={member.slug} member={member} index={index} />
      ))}
    </ul>
  );

  return (
    <div
      ref={scroller}
      role="group"
      aria-label="The TechNova crew"
      tabIndex={0}
      onScroll={wrapAround}
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => {
        paused.current = false;
        drag.current = null;
      }}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={() => (drag.current = null)}
      className={`group/strip no-scrollbar flex h-[400px] cursor-grab touch-pan-x items-end overflow-x-auto outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tn-cyan active:cursor-grabbing ${loops ? "" : "justify-safe-center"}`}
    >
      {list(false)}
      {loops && list(true)}
    </div>
  );
}

const orbit = (dur: number): CSSProperties => ({ "--dur": `${dur}s` }) as CSSProperties;

export function Crew() {
  const [filter, setFilter] = useState<Filter>("All crew");
  const people = filter === "All crew" ? CREW : CREW.filter((member) => member.department === filter);

  return (
    <section id="team" className="relative isolate overflow-clip">
      {/* The moon's surface: a very wide ellipse whose top edge is the horizon the crew stand on. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[250px] select-none">
        <div className="absolute top-0 left-1/2 h-[900px] w-[4000px] -translate-x-1/2 rounded-[50%] border-t-2 border-[#ffd1f0]/60 bg-linear-to-b from-[#785cd1]/60 via-[#4d3399]/40 via-[8%] to-[#33216b]/0 to-[26%]" />
        <span className="absolute top-[84px] left-[24%] h-[22px] w-[120px] rounded-[50%] bg-black/15" />
        <span className="absolute top-[114px] left-[55%] h-[28px] w-[180px] rounded-[50%] bg-black/15" />
        <span className="absolute top-[154px] left-[67%] h-[16px] w-[90px] rounded-[50%] bg-black/15" />
        <span className="absolute top-[154px] left-[40%] h-[12px] w-[70px] rounded-[50%] bg-black/15" />
      </div>

      <div className={`${wrap} relative pt-20 lg:pt-24`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/cratered-moon.svg"
          alt=""
          aria-hidden
          className="anim-float pointer-events-none absolute top-16 right-[8%] hidden w-[170px] select-none md:block"
          style={{ ...orbit(15), "--float-y": "-6%" } as CSSProperties}
        />
        <SectionHeading title="Meet the crew">The people making TechNova happen.</SectionHeading>

        <div role="group" aria-label="Show a department" className="no-scrollbar -mx-2 mt-6 flex gap-1 overflow-x-auto px-2 py-1">
          {FILTERS.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={filter === name}
              onClick={() => setFilter(name)}
              className={`flex min-h-12 shrink-0 cursor-pointer items-center px-3 text-lg leading-none font-semibold whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-tn-cyan ${
                filter === name ? "text-tn-ink" : "text-tn-muted hover:text-tn-ink"
              }`}
            >
              <span className={`border-b-2 pt-1 pb-2 ${filter === name ? "border-tn-cyan" : "border-transparent"}`}>{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Remounted per department so the strip starts from its left end each time. */}
      <Strip key={filter} people={people} />

      <p className={`${wrap} pt-8 pb-16 text-center text-base text-tn-muted sm:text-lg`}>
        <span className="[@media(hover:none)]:hidden">Hover to meet us. Drag to explore.</span>
        <span className="hidden [@media(hover:none)]:inline">Swipe to meet the whole crew.</span>
      </p>
    </section>
  );
}
