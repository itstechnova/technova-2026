'use client';

import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  accessor?: (row: T) => string | number | null | undefined;
  widthClass?: string;
  align?: "left" | "right" | "center";
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  className?: string;
}

const alignClass = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.2, ease: "easeOut" as const },
  }),
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

const emptyVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: "easeOut" as const } },
};

/**
 * Generic data-driven table. Pass any T and a columns config —
 * no business logic lives here. Swap `data` + `isLoading` for
 * a server query at any time without touching this component.
 */
export function Table<T>({
  columns,
  data,
  getRowId,
  onRowClick,
  emptyMessage = "No results found.",
  isLoading = false,
  className,
}: TableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-100/80">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-slate-500 whitespace-nowrap",
                  col.widthClass,
                  alignClass[col.align ?? "left"]
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="popLayout" initial={false}>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <motion.tr
                  key={`skeleton-${i}`}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  className="border-b border-slate-200 last:border-none"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 w-3/4 animate-pulse rounded-md bg-slate-200" />
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : data.length === 0 ? (
              <motion.tr
                key="empty"
                variants={emptyVariants}
                initial="hidden"
                animate="visible"
              >
                <td colSpan={columns.length} className="py-14 text-center text-sm text-slate-500">
                  {emptyMessage}
                </td>
              </motion.tr>
            ) : (
              data.map((row, i) => (
                <motion.tr
                  key={getRowId(row)}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-b border-slate-200 last:border-none",
                    "transition-colors duration-100 hover:bg-slate-50",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-4 text-slate-700",
                        alignClass[col.align ?? "left"]
                      )}
                    >
                      {col.render
                        ? col.render(row)
                        : col.accessor
                        ? col.accessor(row)
                        : null}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
