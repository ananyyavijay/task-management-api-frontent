"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * The API's list endpoints only accept skip/limit and return a page of
 * results — no total count. So instead of "Page 2 of 8" we show what we
 * can know for certain: the current page number and whether a further
 * page is likely to exist (the current page came back full).
 */
export function PaginationControl({
  page,
  pageSize,
  itemCount,
  isLoading = false,
  onPrevious,
  onNext,
  className,
}) {
  const hasNextPage = itemCount === pageSize;
  const hasPreviousPage = page > 1;
  const rangeStart = itemCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = (page - 1) * pageSize + itemCount;

  return (
    <div
      className={
        "flex flex-col-reverse items-center justify-between gap-3 border-t border-border px-1 pt-4 sm:flex-row " +
        (className || "")
      }
    >
      <p className="text-xs text-muted-foreground">
        {itemCount === 0
          ? "No results"
          : `Showing ${rangeStart}–${rangeEnd}`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={!hasPreviousPage || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="min-w-[2.5rem] text-center text-sm font-medium text-foreground">
          {page}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!hasNextPage || isLoading}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
