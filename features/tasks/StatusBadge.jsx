import { STATUS_STYLES } from "@/lib/badge-styles";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }) {
  const style = STATUS_STYLES[status];
  if (!style) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        style.classes,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {style.label}
    </span>
  );
}
