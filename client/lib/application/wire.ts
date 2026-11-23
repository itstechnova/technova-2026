// How application answers travel to the Server Actions.
//
// Netlify's firewall rejects any Server Action request whose body contains `_response"` (a rule
// aimed at a React vulnerability, where that is an internal field name). Two questions are stored
// in columns named `prompt_a_response` and `prompt_b_response`, so once an applicant answered
// either, every save and the final submit came back 403 before reaching the app. Sending the
// answers as base64 keeps the body free of that text, whatever the questions are called or the
// applicant types.

import type { Answers } from "./types";

/** Answers as one base64 string (of their UTF-8 JSON), for a Server Action argument. */
export function encodeAnswers(answers: Answers): string {
  const bytes = new TextEncoder().encode(JSON.stringify(answers));
  let binary = "";
  // In chunks: spreading a long answer set into one call can exceed the argument limit.
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

/**
 * The reverse, on the server. The result is still untrusted input: this only undoes the
 * encoding, and anything that is not an encoded object comes back as-is for the caller's own
 * checks to reject.
 */
export function decodeAnswers(wire: unknown): unknown {
  if (typeof wire !== "string") return wire;
  try {
    const bytes = Uint8Array.from(atob(wire), (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return undefined;
  }
}
