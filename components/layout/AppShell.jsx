import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <Navbar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl animate-fade-in">
            <ErrorBoundary message="This page ran into a problem. Try retrying, or navigate elsewhere.">
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
