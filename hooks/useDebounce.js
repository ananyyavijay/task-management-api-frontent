"use client";

import { useEffect, useState } from "react";

/**
 * Debounce a fast-changing value (e.g. search input) so dependent
 * effects/queries only fire once the user pauses typing.
 * @template T
 * @param {T} value
 * @param {number} [delayMs]
 * @returns {T}
 */
export function useDebounce(value, delayMs = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
