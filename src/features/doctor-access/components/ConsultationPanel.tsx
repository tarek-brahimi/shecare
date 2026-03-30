import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAppointment, getAppointments } from "@/services/api";
import { SheCard } from "@/ui/Card";
import { SheButton } from "@/ui/Button";
import { SheInput } from "@/ui/Input";
import { FiCalendar, FiVideo, FiMapPin, FiPlus } from "react-icons/fi";
import { formatDate } from "@/utils/helpers";
import type { Appointment } from "@/types/domain";

export function ConsultationPanel() {
  const [doctor, setDoctor] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [appointmentType, setAppointmentType] = useState<Appointment["type"]>("teleconsultation");

  const queryClient = useQueryClient();
  const { data: appointments, isLoading, isError } = useQuery({ queryKey: ["appointments"], queryFn: getAppointments });
  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      setDoctor("");
      setSpecialty("");
      setDate("");
      setTime("");
      setAppointmentType("teleconsultation");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const canSchedule = doctor.trim() && specialty.trim() && date && time;

  const handleSchedule = async () => {
    if (!canSchedule) {
      return;
    }

    const parsedTime = new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    await createAppointmentMutation.mutateAsync({
      doctor: doctor.trim(),
      specialty: specialty.trim(),
      date,
      time: parsedTime,
      type: appointmentType,
    });
  };

  return (
    <div className="space-y-6">
      <SheCard>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-shecare-blue-light text-shecare-blue flex items-center justify-center mx-auto mb-4">
            <FiVideo className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Teleconsultation</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">Connect with your healthcare provider from the comfort of your home.</p>
          <div className="grid sm:grid-cols-2 gap-2 text-left max-w-xl mx-auto mb-4">
            <SheInput
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              placeholder="Doctor name"
            />
            <SheInput
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="Specialty"
            />
            <SheInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <SheInput type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <SheButton
              variant={appointmentType === "teleconsultation" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setAppointmentType("teleconsultation")}
            >
              Teleconsultation
            </SheButton>
            <SheButton
              variant={appointmentType === "in-person" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setAppointmentType("in-person")}
            >
              In-person
            </SheButton>
          </div>
          <SheButton
            size="lg"
            onClick={handleSchedule}
            disabled={createAppointmentMutation.isPending || !canSchedule}
          >
            <FiPlus className="w-4 h-4" /> {createAppointmentMutation.isPending ? "Scheduling..." : "Schedule Consultation"}
          </SheButton>
          {createAppointmentMutation.isError && (
            <p className="text-xs text-destructive mt-3">Could not schedule consultation. Please try again.</p>
          )}
        </div>
      </SheCard>

      <SheCard>
        <h3 className="text-sm font-semibold text-foreground mb-4">Upcoming Appointments</h3>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">Could not load appointments right now.</p>
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
