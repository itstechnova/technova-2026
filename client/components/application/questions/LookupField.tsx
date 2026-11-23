"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { controlInput } from "@/components/portal/ui";
import type { ListName, LookupQuestion } from "@/lib/application/types";

import { describedBy, QuestionShell, useFieldIds } from "./QuestionShell";

export type LookupFieldProps = {
  question: LookupQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

type Entry = { name: string; key: string };

const MAX_MATCHES = 40;
const MIN_QUERY = 2;

/** Lowercase and without accents, so "universite" finds "Université". */
const searchKey = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

// Each list is fetched once per page, the first time a field that uses it gets focus.
const requests = new Map<ListName, Promise<Entry[]>>();

function loadList(list: ListName): Promise<Entry[]> {
  let request = requests.get(list);
  if (!request) {
    request = fetch(`/api/lists/${list}`)
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then((names: unknown) =>
        Array.isArray(names)
          ? names
              .filter((name): name is string => typeof name === "string")
              .map((name) => ({ name, key: searchKey(name) }))
          : [],
      );
    // A failed request is forgotten so the next focus tries again.
    request.catch(() => requests.delete(list));
    requests.set(list, request);
  }
  return request;
}

/**
 * Entries containing every word of the query: those that start with the query first, then the
 * others, both in list order.
 */
function findMatches(entries: Entry[], query: string): string[] {
  const words = query.split(/\s+/);
  const starts: string[] = [];
  const others: string[] = [];
  for (const entry of entries) {
    if (entry.key.startsWith(query)) starts.push(entry.name);
    else if (others.length < MAX_MATCHES && words.every((word) => entry.key.includes(word))) others.push(entry.name);
    if (starts.length >= MAX_MATCHES) break;
  }
  return [...starts, ...others].slice(0, MAX_MATCHES);
}

const optionClass =
  "cursor-pointer px-[18px] py-2.5 text-[17px] leading-[1.35] text-tn-ink aria-selected:bg-white/10";
const noteClass = "px-[18px] py-2.5 text-[15px] leading-[1.45] text-tn-muted";

/**
 * A text box that searches a long list (MLH's schools) and stores the entry that is picked. What
 * is typed is only a search: the answer changes when an option is chosen, and leaving the field
 * puts the stored answer back in the box.
 */
export function LookupField({ question, value = "", onChange, error, disabled }: LookupFieldProps) {
  const ids = useFieldIds(question);
  const listboxId = `${ids.control}-options`;
  const inputRef = useRef<HTMLInputElement>(null);

  const [entries, setEntries] = useState<Entry[] | "loading" | "error">("loading");
  // null while the field is at rest and shows the stored answer.
  const [typed, setTyped] = useState<string | null>(null);
  const [active, setActive] = useState(0);

  const open = typed !== null;
  const query = searchKey(typed ?? "");
  const searching = query.length >= MIN_QUERY;

  const matches = useMemo(
    () => (Array.isArray(entries) && searching ? findMatches(entries, query) : []),
    [entries, query, searching],
  );
  const options = question.otherValue ? [...matches, question.otherValue] : matches;

  function start() {
    if (open) return;
    // Starts from the stored answer, selected, so typing replaces it.
    setTyped(value);
    setActive(0);
    inputRef.current?.select();
    if (entries !== "loading" && entries !== "error") return;
    setEntries("loading");
    loadList(question.list).then(setEntries, () => setEntries("error"));
  }

  function close() {
    setTyped(null);
  }

  function choose(option: string) {
    onChange(option);
    close();
  }

  function leave() {
    // Typing a listed name in full counts as choosing it.
    const exact = Array.isArray(entries) && query !== "" ? entries.find((entry) => entry.key === query) : undefined;
    if (exact) onChange(exact.name);
    close();
  }

  // Keep the highlighted option in view while moving through the list with the keyboard.
  useEffect(() => {
    if (open) document.getElementById(`${listboxId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, listboxId]);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) return start();
      if (options.length === 0) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((active + step + options.length) % options.length);
    } else if (event.key === "Enter" && open) {
      // Never submits the form from here: Enter picks the highlighted option.
      event.preventDefault();
      if (options[active] !== undefined) choose(options[active]);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      close();
    }
  }

  let note: string | null = null;
  if (entries === "error") note = "The list could not be loaded. Check your connection and try again.";
  else if (!searching) note = "Type at least two letters to search.";
  else if (entries === "loading") note = "Loading…";
  else if (matches.length === 0) note = "No matches. Check the spelling, or try a shorter name.";
  else if (matches.length === MAX_MATCHES) note = "Keep typing to narrow the list.";

  return (
    <QuestionShell question={question} ids={ids} error={error}>
      <div className="relative">
        <input
          ref={inputRef}
          id={ids.control}
          name={question.id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={open && options.length > 0 ? `${listboxId}-${active}` : undefined}
          autoComplete="off"
          spellCheck={false}
          className={`${controlInput} truncate pr-12`}
          value={typed ?? value}
          placeholder={question.placeholder}
          onFocus={start}
          onClick={start}
          onBlur={leave}
          onChange={(event) => {
            setTyped(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          aria-required={question.required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(question, ids, { error })}
          disabled={disabled}
        />
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="pointer-events-none absolute top-1/2 right-[18px] size-5 -translate-y-1/2 text-tn-cyan"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="9" r="5.5" />
          <path d="M13.5 13.5L17 17" />
        </svg>

        <div
          // Keeps focus in the text box while an option is clicked, so the click lands before the field closes.
          onMouseDown={(event) => event.preventDefault()}
          className={`absolute top-full right-0 left-0 z-20 mt-1.5 overflow-hidden rounded-[10px] border border-tn-muted/55 bg-[#150a44] shadow-[0_16px_48px_rgba(5,0,38,0.6)] ${open ? "" : "hidden"}`}
        >
          <ul id={listboxId} role="listbox" aria-label={question.prompt} className="max-h-72 overflow-y-auto py-1.5">
            {options.map((option, index) => {
              const other = option === question.otherValue && index === matches.length;
              return (
                <li
                  key={other ? "other-option" : option}
                  id={`${listboxId}-${index}`}
                  role="option"
                  aria-selected={index === active}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(option)}
                  className={`${optionClass} ${other && matches.length > 0 ? "border-t border-tn-line" : ""}`}
                >
                  {other ? `${option} (not listed)` : option}
                </li>
              );
            })}
          </ul>
          {note && (
            <p role="status" className={`${noteClass} border-t border-tn-line`}>
              {note}
            </p>
          )}
        </div>
      </div>
    </QuestionShell>
  );
}
