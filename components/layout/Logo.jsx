import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, iconOnly = false }) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        "flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        className
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft">
        <LayoutGrid className="h-4 w-4" strokeWidth={2.25} />
      </span>
      {!iconOnly && (
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          TaskFlow
        </span>
      )}
    </Link>
  );
}
