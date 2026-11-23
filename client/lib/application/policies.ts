// Policy documents an applicant can read in a popup without leaving the form. The text is not
// copied into this repo: /api/policies/[slug] fetches the published Markdown, so it stays current.

export type PolicySlug = "mlh-code-of-conduct" | "mlh-privacy-policy" | "mlh-contest-terms";

const MLH_REPO = "MLH/mlh-policies";
const mlhPolicy = (title: string, file: string) => ({
  title,
  publisher: "Major League Hacking",
  /** The page a person can open. */
  href: `https://github.com/${MLH_REPO}/blob/main/${file}`,
  /** The Markdown the popup renders. */
  source: `https://raw.githubusercontent.com/${MLH_REPO}/main/${file}`,
});

export const POLICIES = {
  "mlh-code-of-conduct": mlhPolicy("MLH Code of Conduct", "code-of-conduct.md"),
  "mlh-privacy-policy": mlhPolicy("MLH Privacy Policy", "privacy-policy.md"),
  "mlh-contest-terms": mlhPolicy("MLH Contest Terms and Conditions", "contest-terms.md"),
} satisfies Record<PolicySlug, { title: string; publisher: string; href: string; source: string }>;

export const isPolicySlug = (value: string): value is PolicySlug => Object.hasOwn(POLICIES, value);
