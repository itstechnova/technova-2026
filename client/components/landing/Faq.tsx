"use client";

import { MapPin } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { DrawnPlanet, SectionHeading, wrap } from "@/components/landing/shared";
import { SUPPORT_EMAIL } from "@/lib/application/config";

// Figma "06 · Questions / #faq", without the console chrome: a plain list, one answer open at a time.

// The venue, for the "Where is it held?" answer and its map.
const VENUE = {
  name: "Pearl Sullivan Engineering Building (PSE)",
  short: "PSE",
  address: "200 University Avenue West, Waterloo, Ontario N2L 3G1",
  query: "Pearl Sullivan Engineering Building, University of Waterloo",
};
const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(VENUE.query)}&z=16&output=embed`;
const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE.query)}`;

/**
 * The venue map. Until Google's frame has loaded, a quiet placeholder in the page's own colours
 * holds its place (a pin and the venue's name over a slow shimmer); the map then fades in over it.
 */
function VenueMap() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-tn-line bg-[#120838]">
      <div
        aria-hidden
        className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-500 ${loaded ? "opacity-0" : "opacity-100"}`}
      >
        <div className="map-shimmer absolute inset-0" />
        <MapPin size={28} strokeWidth={1.75} className="relative text-tn-cyan motion-safe:animate-bounce" />
        <p className="relative text-sm text-tn-muted">Finding {VENUE.short} on the map…</p>
      </div>
      <iframe
        title={`Map showing the ${VENUE.name}`}
        src={mapEmbed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 size-full transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

type Question = { q: string; a: string; map?: boolean };

const QUESTIONS: Question[] = [
  {
    q: "What is a hackathon?",
    a: "A weekend where you team up to build a project and show it off at the end. It can be an app, a website, a piece of hardware, anything you like. Along the way there are workshops, mentors and plenty of activities.",
  },
  {
    q: "Who can join TechNova?",
    a: "TechNova is open to women and non-binary students. You can be enrolled at a university or at a non-traditional institution such as a code bootcamp, homeschool or online program.",
  },
  {
    q: "Where is TechNova held?",
    a: `TechNova 6 takes place in person at the ${VENUE.name} at the University of Waterloo. The address is ${VENUE.address}.`,
    map: true,
  },
  {
    q: "Do I need coding experience?",
    a: "No. You do not need any prior coding experience to apply as a hacker. Whether you are just starting out in technology or have years of experience, we would love to hear from you.",
  },
  {
    q: "Do I need a team?",
    a: "No. You can apply on your own and find teammates at the event, or come with people you already know.",
  },
  {
    q: "Is the event free?",
    a: "Yes. TechNova is free to attend.",
  },
  {
    q: "What about travel & accessibility?",
    a: `TechNova does not provide or arrange transportation, so you are responsible for getting to and from the venue in Waterloo, Ontario. If you need an accommodation, email ${SUPPORT_EMAIL} and we will work it out with you.`,
  },
  {
    q: "What happens after I apply?",
    a: "Applications are reviewed on a rolling basis, so applying early helps. We will email you when your status changes, and you can check it any time in your hacker dashboard.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative">
      <div className={`${wrap} grid gap-x-16 gap-y-12 py-20 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:py-24`}>
        <div className="flex flex-col gap-8">
          <SectionHeading title="Questions?" size="stacked">
            A few things to know before you apply.
          </SectionHeading>
          <p className="scroll-in text-lg leading-[1.35] text-tn-cyan">
            Ask us at
            <br />
            <a href={`mailto:${SUPPORT_EMAIL}`} className="underline decoration-from-font underline-offset-4 hover:text-tn-ink">
              {SUPPORT_EMAIL}
            </a>
          </p>
          <DrawnPlanet
            kind="meadow"
            className="anim-float mt-6 ml-6 hidden w-[210px] lg:block"
            style={{ "--dur": "17s", "--float-y": "-4%", "--float-x": "3%", "--float-rotate": "6deg" } as CSSProperties}
          />
        </div>

        <div className="scroll-in">
          <ul className="border-t border-tn-line">
            {QUESTIONS.map(({ q, a, map }, index) => {
              const expanded = open === index;
              return (
                <li key={q} className="border-b border-tn-line">
                  <h3>
                    <button
                      type="button"
                      id={`faq-question-${index}`}
                      aria-expanded={expanded}
                      aria-controls={`faq-answer-${index}`}
                      onClick={() => setOpen(expanded ? null : index)}
                      className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-lg leading-[1.35] font-semibold text-tn-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tn-cyan sm:text-xl"
                    >
                      {q}
                      <span aria-hidden className={`text-2xl leading-none text-tn-cyan transition-transform duration-200 ${expanded ? "rotate-45" : ""}`}>
                        +
                      </span>
                    </button>
                  </h3>
                  {/* The row goes from 0fr to 1fr, so the height animates without being measured. */}
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    inert={!expanded}
                    className={`grid transition-[grid-template-rows] duration-[250ms] ease-out motion-reduce:transition-none ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden text-base leading-[1.5] text-tn-muted sm:text-lg">
                      <p className="max-w-[52ch] pb-6">{a}</p>
                      {/* The map is only requested from Google once the answer is opened. */}
                      {map && expanded && (
                        <div className="flex flex-col gap-3 pb-6">
                          <VenueMap />
                          <a
                            href={mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-fit text-[15px] text-tn-cyan underline decoration-from-font underline-offset-4 hover:text-tn-ink"
                          >
                            Open in Google Maps<span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
