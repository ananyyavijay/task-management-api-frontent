import { LayoutGrid, ShieldCheck, Sparkles, Zap } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: LayoutGrid,
    title: "Projects & tasks, organized",
    description: "Keep every initiative and its tasks in one focused workspace.",
  },
  {
    icon: Zap,
    title: "Fast filtering & search",
    description: "Slice by status, priority, or project in a click.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description: "JWT-authenticated sessions on every request.",
  },
];

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Branding panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <LayoutGrid className="h-4.5 w-4.5" />
          </span>
          <span className="text-base font-semibold tracking-tight">TaskFlow</span>
        </div>

        <div className="relative space-y-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              Built for focused teams
            </div>
            <h1 className="max-w-md text-3xl font-semibold leading-tight tracking-tight text-balance">
              Plan projects. Track tasks. Ship on time.
            </h1>
            <p className="max-w-sm text-sm text-white/70">
              A clean, minimal workspace for managing projects, tasks, and
              team assignments — backed by a robust task management API.
            </p>
          </div>

          <div className="space-y-5">
            {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-xs text-white/60">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/40">
          © {new Date().getFullYear()} TaskFlow. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col items-center justify-center bg-background p-6 sm:p-10">
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutGrid className="h-4.5 w-4.5" />
          </span>
          <span className="text-base font-semibold tracking-tight text-foreground">
            TaskFlow
          </span>
        </div>
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
