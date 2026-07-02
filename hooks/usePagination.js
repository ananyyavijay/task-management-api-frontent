"use client";

import { useCallback, useMemo, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

/**
 * Manages page state in terms of the API's skip/limit contract.
 * @param {number} [pageSize]
 */
export function usePagination(pageSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1); // 1-indexed for UI display

  const skip = useMemo(() => (page - 1) * pageSize, [page, pageSize]);

  const goToPage = useCallback((nextPage) => {
    setPage(Math.max(1, nextPage));
  }, []);

  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const previousPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const reset = useCallback(() => setPage(1), []);

  return {
    page,
    skip,
    limit: pageSize,
    goToPage,
    nextPage,
    previousPage,
    reset,
  };
}
