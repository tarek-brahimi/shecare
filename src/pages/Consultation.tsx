import { ConsultationPanel } from "@/features/doctor-access";

export default function Consultation() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Doctor Consultation</h1>
        <p className="text-muted-foreground text-sm mt-1">Connect with healthcare professionals</p>
      </div>
      <ConsultationPanel />
    </div>
  );
}
