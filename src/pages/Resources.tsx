import { ResourcesGrid } from "@/features/community/components/ResourcesGrid";

export default function Resources() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Resources</h1>
        <p className="text-muted-foreground text-sm mt-1">Guides, videos, and materials to support your journey</p>
      </div>
      <ResourcesGrid />
    </div>
  );
}
