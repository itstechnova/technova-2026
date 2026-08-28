import { useMemo, useState } from "react";

/**
 * Generic client-side search hook.
 *
 * To move to server-side search later, replace the body with a
 * debounced useQuery / SWR call and keep the same return shape —
 * SearchBar and Table never need to change.
 */
export function useTableSearch<T>(
  data: T[],
  searchableKeys: (keyof T)[],
  options?: {
    /** Custom matcher for nested fields or non-string comparisons */
    matcher?: (item: T, query: string) => boolean;
  }
) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return data;

    if (options?.matcher) {
      return data.filter((item) => options.matcher!(item, trimmed));
    }

    return data.filter((item) =>
      searchableKeys.some((key) => {
        const value = item[key];
        return value != null && String(value).toLowerCase().includes(trimmed);
      })
    );
  }, [data, query, searchableKeys, options]);

  return { query, setQuery, results };
}
