import { SymptomsTracker } from "@/features/health-tracking/components/SymptomsTracker";

export default function Health() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Health Tracking</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor your symptoms and wellness</p>
      </div>
      <SymptomsTracker />
    </div>
  );
}
