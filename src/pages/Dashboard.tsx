import { WelcomeHeader, StatsGrid, TreatmentProgress, QuickActions } from "@/features/health-tracking";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <WelcomeHeader />
      <StatsGrid />
      <div className="grid lg:grid-cols-2 gap-6">
        <TreatmentProgress />
        <QuickActions />
      </div>
    </div>
  );
}
