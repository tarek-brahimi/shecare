import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSymptom, getSymptoms } from "@/services/api";
import { SheCard } from "@/ui/Card";
import { SheButton } from "@/ui/Button";
import { SheInput } from "@/ui/Input";
import { getCurrentUser } from "@/services/api";
import { getProgressPercent } from "@/utils/helpers";
import { FiActivity, FiPlus, FiTrendingUp } from "react-icons/fi";

const severityColor = (s: number) => {
  if (s <= 3) return "bg-shecare-green";
  if (s <= 6) return "bg-shecare-orange";
  return "bg-destructive";
};

export function SymptomsTracker() {
  const [symptomName, setSymptomName] = useState("");
  const [severity, setSeverity] = useState("5");
  const queryClient = useQueryClient();
  const { data: symptoms, isLoading, isError } = useQuery({ queryKey: ["symptoms"], queryFn: getSymptoms });
  const { data: user } = useQuery({ queryKey: ["user"], queryFn: getCurrentUser });
  const createSymptomMutation = useMutation({
    mutationFn: createSymptom,
    onSuccess: () => {
      setSymptomName("");
      setSeverity("5");
      queryClient.invalidateQueries({ queryKey: ["symptoms"] });
    },
  });
  const percent = user ? getProgressPercent(user.treatmentDay, user.totalTreatmentDays) : 0;

  const handleLogSymptom = async () => {
    const parsedSeverity = Number(severity);
    if (!symptomName.trim() || Number.isNaN(parsedSeverity) || parsedSeverity < 1 || parsedSeverity > 10) {
      return;
    }

    await createSymptomMutation.mutateAsync({
      name: symptomName.trim(),
      severity: parsedSeverity,
    });
  };

  return (
    <div className="space-y-6">
      {/* Wellness Score */}
      <SheCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Wellness Score</h3>
          <FiTrendingUp className="w-4 h-4 text-shecare-green" />
        </div>
        <div className="flex items-end gap-3">
          <span className="text-5xl font-bold text-primary">{user?.wellnessScore || 0}</span>
          <span className="text-muted-foreground text-sm mb-2">/ 100</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full mt-3 overflow-hidden">
          <div className="h-full shecare-gradient rounded-full transition-all duration-700" style={{ width: `${user?.wellnessScore || 0}%` }} />
        </div>
      </SheCard>

      {/* Treatment Progress */}
      <SheCard>
        <h3 className="text-sm font-semibold text-foreground mb-3">Treatment Progress</h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Day {user?.treatmentDay || 0} of {user?.totalTreatmentDays || 0}</span>
          <span className="font-semibold text-primary">{percent}%</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full shecare-gradient rounded-full transition-all duration-700" style={{ width: `${percent}%` }} />
        </div>
      </SheCard>

      {/* Symptoms */}
      <SheCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Today's Symptoms</h3>
          <SheButton
            variant="ghost"
            size="sm"
            onClick={handleLogSymptom}
            disabled={createSymptomMutation.isPending || !symptomName.trim()}
          >
            <FiPlus className="w-4 h-4" /> {createSymptomMutation.isPending ? "Saving..." : "Log"}
          </SheButton>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          <SheInput
            value={symptomName}
            onChange={(e) => setSymptomName(e.target.value)}
            placeholder="Symptom name"
            className="sm:col-span-2"
          />
          <SheInput
            type="number"
            min={1}
            max={10}
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            placeholder="Severity 1-10"
          />
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">Could not load your symptoms right now.</p>
        ) : (
          <div className="space-y-3">
            {symptoms?.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <FiActivity className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{s.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${severityColor(s.severity)}`} style={{ width: `${s.severity * 10}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-4">{s.severity}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {createSymptomMutation.isError && (
          <p className="text-xs text-destructive mt-3">Failed to log symptom. Please try again.</p>
        )}
      </SheCard>
    </div>
  );
}
