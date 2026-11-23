"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { AnswerValue, Answers } from "@/lib/application/types";

// An unsubmitted application is kept in this browser's localStorage, one entry per user, as the
// applicant types. (It is also saved to their account at milestones: see lib/application/draft.ts.)
// Everything here tolerates a missing, corrupt, full or blocked localStorage: the form then
// simply works without a saved draft.

export type Draft = {
  answers: Answers;
  /** Id of the step the applicant was on (a section id, or "review"). */
  step: string;
  /** ISO time of the last save. */
  savedAt: string;
};

type DraftContent = Pick<Draft, "answers" | "step">;

const SAVE_DELAY_MS = 400;
// `storage` events only fire in other tabs; this one tells hooks in this tab about a write.
const CHANGE_EVENT = "technova:draft-change";

export const draftKey = (userId: string) => `technova:hacker-application:draft:${userId}`;

function readRaw(userId: string): string | null {
  try {
    return window.localStorage.getItem(draftKey(userId));
  } catch {
    return null;
  }
}

function isAnswerValue(value: unknown): value is AnswerValue {
  return (
    typeof value === "string" ||
    typeof value === "boolean" ||
    (Array.isArray(value) && value.every((item) => typeof item === "string"))
  );
}

/** Parses a stored draft, dropping anything that isn't the expected shape. */
function parseDraft(raw: string | null): Draft | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return null;
    const { answers, step, savedAt } = data as Record<string, unknown>;
    if (typeof answers !== "object" || answers === null || Array.isArray(answers)) return null;

    const clean: Answers = {};
    for (const [id, value] of Object.entries(answers)) {
      if (isAnswerValue(value)) clean[id] = value;
    }
    return {
      answers: clean,
      step: typeof step === "string" ? step : "",
      savedAt: typeof savedAt === "string" && !Number.isNaN(Date.parse(savedAt)) ? savedAt : "",
    };
  } catch {
    return null;
  }
}

/** Writes the draft and returns its save time, or null when the browser refused to store it. */
function writeDraft(userId: string, content: DraftContent): string | null {
  const draft: Draft = { ...content, savedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(draftKey(userId), JSON.stringify(draft));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return draft.savedAt;
  } catch {
    return null;
  }
}

function removeDraft(userId: string) {
  try {
    window.localStorage.removeItem(draftKey(userId));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Nothing was stored, or storage is blocked: nothing to remove.
  }
}

/**
 * Changes some answers in this browser's draft, if there is one, without touching its save time
 * (Profile & settings does this, so the application shows the details just saved there).
 */
export function patchStoredDraft(userId: string, answers: Answers) {
  const draft = parseDraft(readRaw(userId));
  if (!draft) return;
  try {
    const next: Draft = { ...draft, answers: { ...draft.answers, ...answers } };
    window.localStorage.setItem(draftKey(userId), JSON.stringify(next));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Storage is full or blocked: the copy on their account has the change.
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/**
 * The stored draft: `undefined` while rendering on the server and during hydration (render a
 * skeleton), then the draft or `null` when there is none.
 */
export function useStoredDraft(userId: string): Draft | null | undefined {
  // The snapshot is the raw string, which is stable between renders; `undefined` = not loaded.
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(userId),
    () => undefined,
  );
  return useMemo(() => (raw === undefined ? undefined : parseDraft(raw)), [raw]);
}

/**
 * The editable draft. Mount it only once `useStoredDraft` has loaded and pass that draft as
 * `initial`; changes are written back to localStorage after a short pause.
 */
export function useApplicationDraft(userId: string, initial: DraftContent, initialSavedAt: string | null) {
  const [content, setContent] = useState(initial);
  const [savedAt, setSavedAt] = useState(initialSavedAt);
  const [saveFailed, setSaveFailed] = useState(false);

  // The latest content and whether it still has to be written, readable from timers and cleanup.
  const latest = useRef(initial);
  const dirty = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  /** Writes pending changes now (also runs when leaving the page). */
  const save = useCallback(() => {
    window.clearTimeout(timer.current);
    if (!dirty.current) return;
    dirty.current = false;
    const time = writeDraft(userId, latest.current);
    setSaveFailed(time === null);
    if (time) setSavedAt(time);
  }, [userId]);

  const change = useCallback(
    (next: DraftContent) => {
      latest.current = next;
      dirty.current = true;
      setContent(next);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(save, SAVE_DELAY_MS);
    },
    [save],
  );

  const setAnswer = useCallback(
    (id: string, value: AnswerValue) =>
      change({ ...latest.current, answers: { ...latest.current.answers, [id]: value } }),
    [change],
  );

  const setStep = useCallback(
    (step: string) => {
      if (step !== latest.current.step) change({ ...latest.current, step });
    },
    [change],
  );

  /** Removes the stored draft (after a successful submit) and stops further saves. */
  const clear = useCallback(() => {
    window.clearTimeout(timer.current);
    dirty.current = false;
    removeDraft(userId);
  }, [userId]);

  // Don't lose the last few keystrokes when the tab is hidden or closed, or on navigating away.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") save();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", save);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", save);
      window.clearTimeout(timer.current);
      if (dirty.current) {
        dirty.current = false;
        writeDraft(userId, latest.current);
      }
    };
  }, [save, userId]);

  return { answers: content.answers, step: content.step, savedAt, saveFailed, setAnswer, setStep, save, clear };
}

/** The more recently saved of two drafts (either may be missing). */
export function newerDraft(a: Draft | null, b: Draft | null): Draft | null {
  if (!a || !b) return a ?? b;
  return (Date.parse(b.savedAt) || 0) > (Date.parse(a.savedAt) || 0) ? b : a;
}

/** "Saved just now", "Saved 2 min ago", "Saved 3 hr ago", "Saved Dec 1". */
export function savedLabel(savedAt: string, now: number): string {
  const minutes = Math.floor((now - Date.parse(savedAt)) / 60_000);
  if (Number.isNaN(minutes)) return "Saved";
  if (minutes < 1) return "Saved just now";
  if (minutes < 60) return `Saved ${minutes} min ago`;
  if (minutes < 24 * 60) return `Saved ${Math.floor(minutes / 60)} hr ago`;
  const date = new Date(savedAt).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
  return `Saved ${date}`;
}

/** The current time, refreshed every 30 seconds so "Saved … ago" text stays right. */
export function useNow(): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(interval);
  }, []);
  return now;
}
