import { Check } from "lucide-react";

export type Step = { id: string; label: string };

/**
 * Progress through the form: a bar, then one pill per step on a single row. Any step can be
 * opened at any time; a tick marks the ones whose required questions are all answered. Every pill shows its name when the row is wide enough (a container
 * query); otherwise only the current step does, and the row scrolls sideways rather than wrapping.
 */
export function StepTabs({
  steps,
  current,
  done,
  onSelect,
}: {
  steps: Step[];
  current: number;
  /** Whether each step's required questions are all answered (Review has no entry). */
  done: boolean[];
  onSelect: (index: number) => void;
}) {
  return (
    <nav aria-label="Application steps" className="@container flex flex-col gap-3">
      <div aria-hidden className="h-1.5 overflow-hidden rounded-full bg-tn-line/70">
        <div
          className="h-full rounded-full bg-tn-cyan transition-[width] duration-300 ease-out"
          style={{ width: `${(done.filter(Boolean).length / steps.length) * 100}%` }}
        />
      </div>

      <ol className="-mx-1 flex gap-1.5 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {steps.map((step, index) => {
          const isCurrent = index === current;
          const isDone = !isCurrent && done[index] === true;
          const content = (
            <>
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[13px] leading-none font-semibold tabular-nums ${
                  isCurrent ? "bg-tn-cyan text-tn-bg" : isDone ? "bg-tn-cyan/20 text-tn-cyan" : "bg-white/10"
                }`}
              >
                {isDone ? <Check aria-hidden size={14} strokeWidth={3} /> : index + 1}
                {isDone && <span className="sr-only">{index + 1}, done</span>}
              </span>
              <span className={`whitespace-nowrap ${isCurrent ? "" : "sr-only @4xl:not-sr-only"}`}>{step.label}</span>
            </>
          );
          const layout = "flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-2.5 text-[15px] leading-none";

          return (
            <li key={step.id} className="shrink-0">
              <button
                type="button"
                aria-current={isCurrent ? "step" : undefined}
                onClick={() => onSelect(index)}
                className={`${layout} cursor-pointer transition focus-visible:outline-2 focus-visible:outline-tn-cyan ${
                  isCurrent
                    ? "bg-white/10 pr-3.5 font-semibold text-tn-ink"
                    : "text-tn-muted hover:bg-white/5 hover:text-tn-ink"
                }`}
              >
                {content}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
