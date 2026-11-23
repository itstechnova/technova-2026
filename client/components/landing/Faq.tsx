"use client";

import { useState, type CSSProperties } from "react";
import { BandedPlanet, SectionHeading, wrap } from "@/components/landing/shared";
import { TwinkleStar } from "@/components/portal/ui";
import { SUPPORT_EMAIL } from "@/lib/application/config";

// Figma "06 · Questions / #faq", without the console chrome: a plain list, one answer open at a time.

const QUESTIONS = [
  {
    q: "What is a hackathon?",
    a: "A weekend where you team up to build a project and show it off at the end. It can be an app, a website, a piece of hardware, anything you like. Along the way there are workshops, mentors and plenty of activities.",
  },
  {
    q: "Who can join TechNova?",
    a: "TechNova is open to women and non-binary students. You can be enrolled at a university or at a non-traditional institution such as a code bootcamp, homeschool or online program.",
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
    a: `TechNova does not provide or arrange transportation, so you are responsible for getting to and from the event in Waterloo, Ontario. If you need an accommodation, email ${SUPPORT_EMAIL} and we will work it out with you.`,
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
          {/* A banded planet with a little moon, drifting under the heading. */}
          <div aria-hidden className="relative mt-6 ml-6 hidden w-[230px] lg:block">
            <BandedPlanet className="anim-float w-full" style={{ "--dur": "17s", "--float-y": "-4%", "--float-x": "2%" } as CSSProperties} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/cratered-moon.svg"
              alt=""
              className="anim-float pointer-events-none absolute -top-10 -right-16 w-[120px] select-none"
              style={{ "--dur": "12s", "--float-y": "-10%", "--float-x": "-6%" } as CSSProperties}
            />
            <TwinkleStar className="absolute -bottom-2 -left-10 w-9" dur={4.4} />
          </div>
        </div>

        <div className="scroll-in">
          <ul className="border-t border-tn-line">
            {QUESTIONS.map(({ q, a }, index) => {
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
                    <p className="overflow-hidden text-base leading-[1.5] text-tn-muted sm:text-lg">
                      <span className="block max-w-[52ch] pb-6">{a}</span>
                    </p>
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
