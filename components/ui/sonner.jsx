"use client";

import { Toaster as Sonner } from "sonner";

function Toaster({ ...props }) {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast rounded-xl border border-border bg-white shadow-elevated text-foreground font-sans",
          title: "text-sm font-medium",
          description: "text-sm text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground rounded-md",
          cancelButton: "bg-secondary text-secondary-foreground rounded-md",
          success: "!border-green-200",
          error: "!border-red-200",
          warning: "!border-amber-200",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
