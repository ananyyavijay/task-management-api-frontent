import { WelcomeSection } from "@/features/dashboard/WelcomeSection";
import { StatsGrid } from "@/features/dashboard/StatsGrid";
import { RecentTasksList } from "@/features/dashboard/RecentTasksList";
import { RecentProjectsList } from "@/features/dashboard/RecentProjectsList";
import { QuickActions } from "@/features/dashboard/QuickActions";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <WelcomeSection />
      <StatsGrid />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RecentTasksList />
          <RecentProjectsList />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
