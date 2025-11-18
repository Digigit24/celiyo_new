// src/components/patient-drawer/PatientVitalsTab.tsx
import { usePatientVitals } from '@/hooks/usePatients';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface PatientVitalsTabProps {
  patientId: number;
  readOnly: boolean;
}

export default function PatientVitalsTab({ patientId, readOnly }: PatientVitalsTabProps) {
  const { vitals, isLoading, error } = usePatientVitals(patientId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Failed to load vitals: {error.message}
      </div>
    );
  }

  if (vitals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No vitals recorded yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Vitals History</h3>
        {!readOnly && (
          <Badge variant="outline">Add vitals feature coming soon</Badge>
        )}
      </div>

      <div className="space-y-3">
        {vitals.map((vital) => (
          <div key={vital.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {format(new Date(vital.recorded_at), 'dd MMM yyyy, hh:mm a')}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              {vital.temperature && (
                <div>
                  <span className="text-muted-foreground">Temperature:</span>
                  <span className="ml-2 font-medium">{vital.temperature}°F</span>
                </div>
              )}
              {vital.blood_pressure && (
                <div>
                  <span className="text-muted-foreground">BP:</span>
                  <span className="ml-2 font-medium">{vital.blood_pressure}</span>
                </div>
              )}
              {vital.heart_rate && (
                <div>
                  <span className="text-muted-foreground">Heart Rate:</span>
                  <span className="ml-2 font-medium">{vital.heart_rate} bpm</span>
                </div>
              )}
              {vital.oxygen_saturation && (
                <div>
                  <span className="text-muted-foreground">SpO2:</span>
                  <span className="ml-2 font-medium">{vital.oxygen_saturation}%</span>
                </div>
              )}
            </div>

            {vital.notes && (
              <div className="text-sm text-muted-foreground pt-2 border-t">
                {vital.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
