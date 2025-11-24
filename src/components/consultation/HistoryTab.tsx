// src/components/consultation/HistoryTab.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, FileText, Activity } from 'lucide-react';

interface HistoryTabProps {
  patientId: number;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ patientId }) => {
  // TODO: Fetch patient visit history from API using patientId

  // Placeholder data
  const visitHistory = [
    {
      id: 1,
      visitNumber: 'OPD-2024-001',
      date: '2024-01-15',
      doctor: 'Dr. Smith',
      chiefComplaint: 'Lower back pain',
      diagnosis: 'Lumbar strain',
      status: 'completed',
    },
    {
      id: 2,
      visitNumber: 'OPD-2024-002',
      date: '2024-01-22',
      doctor: 'Dr. Smith',
      chiefComplaint: 'Follow-up for lower back pain',
      diagnosis: 'Improved lumbar strain',
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Visits</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Visit</p>
                <p className="text-sm font-semibold">Jan 22, 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Issues</p>
                <p className="text-xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visit History List */}
      <Card>
        <CardHeader>
          <CardTitle>Previous Visits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {visitHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No previous visits found
            </p>
          ) : (
            visitHistory.map((visit, index) => (
              <div key={visit.id}>
                {index > 0 && <Separator className="my-4" />}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{visit.visitNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {visit.date} • {visit.doctor}
                      </p>
                    </div>
                    <Badge
                      variant="default"
                      className="bg-green-600"
                    >
                      {visit.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">Chief Complaint: </span>
                      <span>{visit.chiefComplaint}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Diagnosis: </span>
                      <span>{visit.diagnosis}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Medical Timeline Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Detailed medical timeline will appear here
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
