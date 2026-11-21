// Event and application dates, in one place (Figma "02 · Login & participant").
export const EVENT_DATES_LABEL = "January 22-24, 2027";
export const APPLICATIONS_CLOSE_DATE_LABEL = "Dec 4, 2026";
export const APPLICATIONS_CLOSE_TIME_LABEL = "11:59 PM ET";
// 11:59 PM Eastern (EST, UTC-5) on Dec 4, 2026.
export const APPLICATIONS_CLOSE_AT = new Date("2026-12-05T23:59:59Z");
export const SUPPORT_EMAIL = "hello@itstechnova.org";

export const applicationsOpen = (now: Date = new Date()) => now <= APPLICATIONS_CLOSE_AT;
