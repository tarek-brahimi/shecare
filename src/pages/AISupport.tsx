import { AIChatPanel } from "@/features/ai";

export default function AISupport() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Support</h1>
        <p className="text-muted-foreground text-sm mt-1">Your personal wellness assistant</p>
      </div>
      <AIChatPanel />
    </div>
  );
}
