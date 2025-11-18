// src/components/patient-drawer/PatientMedicalTab.tsx
import { usePatientMedicalHistory, usePatientMedications } from '@/hooks/usePatients';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

interface PatientMedicalTabProps {
  patientId: number;
  readOnly: boolean;
}

export default function PatientMedicalTab({ patientId, readOnly }: PatientMedicalTabProps) {
  const { medicalHistory, isLoading: historyLoading, error: historyError } = usePatientMedicalHistory(patientId);
  const { medications, isLoading: medsLoading, error: medsError } = usePatientMedications(patientId);

  return (
    <Tabs defaultValue="history" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="history">Medical History</TabsTrigger>
        <TabsTrigger value="medications">Medications</TabsTrigger>
      </TabsList>

      <TabsContent value="history" className="space-y-4 mt-4">
        {historyLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : historyError ? (
          <div className="text-center py-8 text-destructive">
            Failed to load medical history: {historyError.message}
          </div>
        ) : medicalHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No medical history recorded
          </div>
        ) : (
          <div className="space-y-3">
            {medicalHistory.map((history) => (
              <div key={history.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{history.condition}</h4>
                    {history.diagnosed_date && (
                      <p className="text-sm text-muted-foreground">
                        Diagnosed: {format(new Date(history.diagnosed_date), 'dd MMM yyyy')}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={history.status === 'active' ? 'default' : 'outline'}
                    className={
                      history.status === 'active'
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                        : history.status === 'chronic'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }
                  >
                    {history.status}
                  </Badge>
                </div>

                {history.notes && (
                  <p className="text-sm text-muted-foreground">{history.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="medications" className="space-y-4 mt-4">
        {medsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : medsError ? (
          <div className="text-center py-8 text-destructive">
            Failed to load medications: {medsError.message}
          </div>
        ) : medications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No medications recorded
          </div>
        ) : (
          <div className="space-y-3">
            {medications.map((medication) => (
              <div key={medication.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{medication.medication_name}</h4>
                    {medication.prescribed_by && (
                      <p className="text-sm text-muted-foreground">
                        Prescribed by: {medication.prescribed_by}
                      </p>
                    )}
                  </div>
                  <Badge variant={medication.is_active ? 'default' : 'outline'}>
                    {medication.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {medication.dosage && (
                    <div>
                      <span className="text-muted-foreground">Dosage:</span>
                      <p className="font-medium">{medication.dosage}</p>
                    </div>
                  )}
                  {medication.frequency && (
                    <div>
                      <span className="text-muted-foreground">Frequency:</span>
                      <p className="font-medium">{medication.frequency}</p>
                    </div>
                  )}
                  {medication.start_date && (
                    <div>
                      <span className="text-muted-foreground">Start Date:</span>
                      <p className="font-medium">
                        {format(new Date(medication.start_date), 'dd MMM yyyy')}
                      </p>
                    </div>
                  )}
                  {medication.end_date && (
                    <div>
                      <span className="text-muted-foreground">End Date:</span>
                      <p className="font-medium">
                        {format(new Date(medication.end_date), 'dd MMM yyyy')}
                      </p>
                    </div>
                  )}
                </div>

                {medication.notes && (
                  <p className="text-sm text-muted-foreground border-t pt-2">
                    {medication.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
