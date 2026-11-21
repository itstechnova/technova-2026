import { countWords } from "@/lib/application/validate";

/** Live "112 / 150 words" counter; turns to the error colour once over the limit. */
export function WordCount({ id, text, max }: { id: string; text: string; max: number }) {
  const count = countWords(text);
  const over = count > max;
  return (
    <p
      id={id}
      className={`shrink-0 text-sm leading-[1.35] tabular-nums ${over ? "font-semibold text-tn-error" : "text-tn-muted"}`}
    >
      {count} / {max} words
      {over && <span className="sr-only"> (over the limit)</span>}
    </p>
  );
}
