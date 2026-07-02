import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Simple centered spinner for full-section loading states.
 */
export function LoadingSpinner({ className, size = 20, label = "Loading…" }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground", className)}>
      <Loader2 className="animate-spin" size={size} />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
