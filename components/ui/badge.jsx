import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        outline: "border border-border text-foreground",
        accent: "bg-accent/10 text-accent",
        success: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20",
        warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
        destructive: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
