import { About } from "@/components/landing/About";
import { Closing } from "@/components/landing/Closing";
import { Crew } from "@/components/landing/Crew";
import { Experience } from "@/components/landing/Experience";
import { Faq } from "@/components/landing/Faq";
import { Hero } from "@/components/landing/Hero";
import { Nav } from "@/components/landing/Nav";
import { Sponsors } from "@/components/landing/Sponsors";
import { SiteFooter } from "@/components/SiteFooter";
import { SpaceBackdrop } from "@/components/portal/ui";

// The public landing page (Figma "05 · Public website · redesign v2", frame 125:1065): one long
// scroll from the launch countdown to the closing call to action.

/** Soft colour glows down the page, over the fixed nebula backdrop. */
function Glows() {
  const glow = "absolute size-[760px] rounded-full blur-[180px]";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className={`${glow} top-[14%] -left-[200px] bg-tn-cyan/15`} />
      <div className={`${glow} top-[30%] -right-[220px] bg-[#ffd0f0]/12`} />
      <div className={`${glow} top-[49%] -left-[250px] bg-[#ffd0f0]/10`} />
      <div className={`${glow} top-[62%] -right-[270px] bg-tn-cyan/12`} />
      <div className={`${glow} top-[78%] left-[14%] bg-[#ffd0f0]/10`} />
    </div>
  );
}

/** The horizon of a pink planet rising behind the closing call to action and the footer. */
function Horizon() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[min(38vw,400px)] overflow-hidden">
      <div className="absolute top-0 left-1/2 aspect-square w-[max(280vw,2400px)] -translate-x-1/2 rounded-full border-[3px] border-[#ffd0f0]/80 bg-[radial-gradient(circle_at_50%_0%,#ff9bd8_0%,#9a5ff3_12%,#d233e4_34%,#3a0f5a_52%)] shadow-[0_0_60px_rgb(255_208_240_/_0.55)]" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative isolate text-tn-ink">
      <SpaceBackdrop />
      <Glows />
      <Nav />
      {/* MLH's season banner hangs from the top right corner, over the navigation. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/sponsors/mlh-badge.webp"
        alt="Major League Hacking 2027 hackathon season"
        width={88}
        height={154}
        className="absolute top-0 right-[max(1.25rem,calc((100vw-1440px)/2+40px))] z-50 hidden h-auto w-[88px] xl:block"
      />
      <main>
        <Hero />
        <About />
        <Experience />
        <Sponsors />
        <Crew />
        <Faq />
        <div className="relative isolate">
          <Horizon />
          <Closing />
          <SiteFooter />
        </div>
      </main>
    </div>
  );
}
