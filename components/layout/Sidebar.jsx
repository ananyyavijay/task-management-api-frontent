import { Logo } from "@/components/layout/Logo";
import { NavLinks } from "@/components/layout/NavLinks";

export function Sidebar() {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-sidebar-border lg:bg-sidebar">
      <div className="flex h-16 shrink-0 items-center px-5">
        <Logo />
      </div>
      <div className="flex flex-1 flex-col justify-between overflow-y-auto px-3 pb-4">
        <NavLinks />
        <div className="mt-6 rounded-lg border border-dashed border-border bg-secondary/40 p-3.5">
          <p className="text-xs font-medium text-foreground">Task Management API</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Every action here maps 1:1 to the documented backend contract.
          </p>
        </div>
      </div>
    </aside>
  );
}
