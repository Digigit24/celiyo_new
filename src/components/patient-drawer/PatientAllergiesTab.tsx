// src/components/patient-drawer/PatientAllergiesTab.tsx
import { usePatientAllergies } from '@/hooks/usePatients';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';

interface PatientAllergiesTabProps {
  patientId: number;
  readOnly: boolean;
}

export default function PatientAllergiesTab({ patientId, readOnly }: PatientAllergiesTabProps) {
  const { allergies, isLoading, error } = usePatientAllergies(patientId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Failed to load allergies: {error.message}
      </div>
    );
  }

  if (allergies.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No allergies recorded
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'life_threatening':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'severe':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Allergies</h3>
        {!readOnly && (
          <Badge variant="outline">Add allergy feature coming soon</Badge>
        )}
      </div>

      <div className="space-y-3">
        {allergies.map((allergy) => (
          <div key={allergy.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <h4 className="font-semibold">{allergy.allergen}</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {allergy.allergy_type.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <Badge className={getSeverityColor(allergy.severity)}>
                {allergy.severity.replace('_', ' ')}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Symptoms:</span>
                <p className="mt-1">{allergy.symptoms}</p>
              </div>

              {allergy.treatment && (
                <div>
                  <span className="text-muted-foreground">Treatment:</span>
                  <p className="mt-1">{allergy.treatment}</p>
                </div>
              )}
            </div>

            {!allergy.is_active && (
              <Badge variant="outline" className="text-gray-500">
                Inactive
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
