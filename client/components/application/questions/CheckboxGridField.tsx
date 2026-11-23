import { gridCellValue, type CheckboxGridQuestion } from "@/lib/application/types";

import { ChoiceInput } from "./ChoiceOption";
import { QuestionShell, useFieldIds } from "./QuestionShell";

export type CheckboxGridFieldProps = {
  question: CheckboxGridQuestion;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  error?: string;
  disabled?: boolean;
};

const NONE: string[] = [];

/** A table of checkboxes (rows × columns); cells listed in `skip` are shown as unavailable. */
export function CheckboxGridField({ question, value = NONE, onChange, error, disabled }: CheckboxGridFieldProps) {
  const ids = useFieldIds(question);
  const ticked = new Set(value);
  const skip = new Set(question.skip);

  // Answers are always emitted in grid order (row by row), so the stored list reads in time order.
  const toggle = (cell: string, checked: boolean) => {
    const next = question.rows.flatMap((row) =>
      question.columns
        .map((column) => gridCellValue(column, row))
        .filter((candidate) => (candidate === cell ? checked : ticked.has(candidate))),
    );
    onChange(next);
  };

  return (
    <QuestionShell question={question} ids={ids} error={error} group>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[360px] border-separate border-spacing-0 text-base leading-[1.35]">
          <thead>
            <tr>
              <th scope="col" className="sr-only">
                Time
              </th>
              {question.columns.map((column) => (
                <th key={column.value} scope="col" className="w-16 px-1 pb-1 text-center font-semibold text-tn-ink sm:w-24">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {question.rows.map((row) => (
              <tr key={row.value} className="border-t border-tn-line/60">
                <th scope="row" className="border-t border-tn-line/60 py-1 pr-3 text-left font-normal text-tn-ink">
                  {row.label}
                </th>
                {question.columns.map((column) => {
                  const cell = gridCellValue(column, row);
                  return (
                    <td key={column.value} className="border-t border-tn-line/60 text-center">
                      {skip.has(cell) ? (
                        <span className="text-tn-muted/60" title="Outside the event">
                          <span aria-hidden>—</span>
                          <span className="sr-only">
                            {column.label} {row.label}: outside the event
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex">
                          <ChoiceInput
                            type="checkbox"
                            name={question.id}
                            value={cell}
                            aria-label={`${column.label}, ${row.label}`}
                            checked={ticked.has(cell)}
                            onChange={(event) => toggle(cell, event.target.checked)}
                            disabled={disabled}
                          />
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </QuestionShell>
  );
}
