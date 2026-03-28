import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "@/services/api";
import { SheCard } from "@/ui/Card";
import { SheButton } from "@/ui/Button";
import { FiCalendar, FiVideo, FiMapPin, FiPlus } from "react-icons/fi";
import { formatDate } from "@/utils/helpers";

export function ConsultationPanel() {
  const { data: appointments, isLoading } = useQuery({ queryKey: ["appointments"], queryFn: getAppointments });

  return (
    <div className="space-y-6">
      <SheCard>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-shecare-blue-light text-shecare-blue flex items-center justify-center mx-auto mb-4">
            <FiVideo className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Teleconsultation</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">Connect with your healthcare provider from the comfort of your home.</p>
          <SheButton size="lg"><FiPlus className="w-4 h-4" /> Schedule Consultation</SheButton>
        </div>
      </SheCard>

      <SheCard>
        <h3 className="text-sm font-semibold text-foreground mb-4">Upcoming Appointments</h3>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {appointments?.map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${apt.type === "teleconsultation" ? "bg-shecare-blue-light text-shecare-blue" : "bg-shecare-green-light text-shecare-green"}`}>
                  {apt.type === "teleconsultation" ? <FiVideo className="w-5 h-5" /> : <FiMapPin className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{apt.doctor}</p>
                  <p className="text-xs text-muted-foreground">{apt.specialty}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{formatDate(apt.date)}</p>
                  <p className="text-xs text-muted-foreground">{apt.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheCard>
    </div>
  );
}
