import { PageHeader } from "@/components/common/PageHeader";
import { ProfileCard } from "@/features/profile/ProfileCard";

export const metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your account details and session." />
      <ProfileCard />
    </div>
  );
}
