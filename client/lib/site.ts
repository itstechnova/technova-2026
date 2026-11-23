// Single source of truth for the site's search/social metadata (layout, robots, sitemap, OG image).

// Canonical origin. NEXT_PUBLIC_SITE_URL is set per environment on Netlify; the fallback is the
// production domain so canonical/OG URLs are still absolute if it's missing.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://itstechnova.org").replace(/\/+$/, "");

export const SITE_NAME = "TechNova";
export const EVENT_NAME = "TechNova 6";
export const SITE_TAGLINE = "University of Waterloo's Women+ in Tech Hackathon";

// Event dates: shown in the hero, and as ISO dates in the Event structured data.
export const EVENT_DATE_TEXT = "January 22nd-24th, 2027";
export const EVENT_START_DATE = "2027-01-22";
export const EVENT_END_DATE = "2027-01-24";

export const SITE_TITLE = `${EVENT_NAME} | Women+ in Tech Hackathon at the University of Waterloo`;

export const SITE_DESCRIPTION =
  "TechNova is the University of Waterloo's hackathon for women and non-binary students in tech. " +
  "Join us at PSE in Waterloo, Ontario on January 22-24, 2027 for a weekend of hacking, workshops and mentorship, from first-time hackers to seasoned builders.";

export const SITE_KEYWORDS = [
  "TechNova",
  "TechNova 6",
  "TechNova 2027",
  "TechNova hackathon",
  "TechNova Waterloo",
  "Waterloo hackathon",
  "Waterloo hackathon 2027",
  "University of Waterloo hackathon",
  "UWaterloo hackathon",
  "women in tech hackathon",
  "women+ hackathon",
  "non-binary hackathon",
  "student hackathon",
  "hackathon Ontario",
  "hackathon Canada",
  "beginner-friendly hackathon",
];
