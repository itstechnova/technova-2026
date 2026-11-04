'use client';

import { useRef } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Controlled search input — holds NO filtering logic.
 * Wire to useTableSearch or a debounced server query; neither this
 * component nor <Table /> needs to change when you swap strategies.
 */
export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className,
  disabled = false,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div initial={false} className={cn("relative flex items-center", className)}>
      <Search
        size={14}
        className="pointer-events-none absolute left-3 text-muted-foreground"
        aria-hidden
      />

      <Input
        ref={inputRef}
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          "h-9 pl-8 pr-8 text-sm transition-shadow duration-150",
          "placeholder:text-muted-foreground",
          disabled && "cursor-not-allowed opacity-50"
        )}
      />

      <AnimatePresence>
        {value && !disabled && (
          <motion.button
            key="clear"
            type="button"
            aria-label="Clear search"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={11} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
