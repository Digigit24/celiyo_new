// src/pages/opd/Consultation.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOpdVisit } from '@/hooks/useOpdVisit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';

export const OPDConsultation: React.FC = () => {
  const { visitId } = useParams<{ visitId: string }>();
  const navigate = useNavigate();
  const { useOpdVisitById } = useOpdVisit();

  const { data: visit, isLoading, error } = useOpdVisitById(visitId ? parseInt(visitId) : null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !visit) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-destructive">Failed to load visit details</p>
            <Button onClick={() => navigate('/opd/visits')} className="mt-4">
              Back to Visits
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/opd/visits')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Consultation</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Visit: {visit.visit_number}
          </p>
        </div>
      </div>

      {/* Visit Info */}
      <Card>
        <CardHeader>
          <CardTitle>Visit Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Patient</p>
              <p className="font-medium">{visit.patient_details?.full_name || 'N/A'}</p>
              <p className="text-xs text-muted-foreground">
                {visit.patient_details?.patient_id} • {visit.patient_details?.mobile_primary}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {visit.patient_details?.age} years • {visit.patient_details?.gender}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Doctor</p>
              <p className="font-medium">{visit.doctor_details?.full_name || 'N/A'}</p>
              <p className="text-xs text-muted-foreground">
                {visit.doctor_details?.specialties?.map(s => s.name).join(', ')}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">
              {visit.visit_type?.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge
              variant={visit.priority === 'urgent' || visit.priority === 'high' ? 'destructive' : 'outline'}
              className={visit.priority === 'high' ? 'bg-orange-600 text-white' : ''}
            >
              {visit.priority?.toUpperCase() || 'NORMAL'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Chief Complaint & Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle>Chief Complaint & Symptoms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Chief Complaint</Label>
            <p className="mt-1 text-sm">
              {visit.chief_complaint || 'No chief complaint recorded'}
            </p>
          </div>
          <div>
            <Label>Symptoms</Label>
            <p className="mt-1 text-sm">
              {visit.symptoms || 'No symptoms recorded'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Vitals */}
      {(visit.temperature || visit.blood_pressure_systolic || visit.heart_rate) && (
        <Card>
          <CardHeader>
            <CardTitle>Vitals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {visit.temperature && (
                <div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p className="font-medium">{visit.temperature}°F</p>
                </div>
              )}
              {visit.blood_pressure_systolic && (
                <div>
                  <p className="text-sm text-muted-foreground">Blood Pressure</p>
                  <p className="font-medium">
                    {visit.blood_pressure_systolic}/{visit.blood_pressure_diastolic}
                  </p>
                </div>
              )}
              {visit.heart_rate && (
                <div>
                  <p className="text-sm text-muted-foreground">Heart Rate</p>
                  <p className="font-medium">{visit.heart_rate} bpm</p>
                </div>
              )}
              {visit.oxygen_saturation && (
                <div>
                  <p className="text-sm text-muted-foreground">SpO2</p>
                  <p className="font-medium">{visit.oxygen_saturation}%</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consultation Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Consultation Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Diagnosis</Label>
            <p className="mt-1 text-sm">
              {visit.diagnosis || 'No diagnosis recorded'}
            </p>
          </div>
          <div>
            <Label>Treatment Plan</Label>
            <p className="mt-1 text-sm">
              {visit.treatment_plan || 'No treatment plan recorded'}
            </p>
          </div>
          <div>
            <Label>Prescription</Label>
            <p className="mt-1 text-sm whitespace-pre-wrap">
              {visit.prescription || 'No prescription recorded'}
            </p>
          </div>
          <div>
            <Label>Additional Notes</Label>
            <p className="mt-1 text-sm">
              {visit.notes || 'No additional notes'}
            </p>
          </div>

          {/* TODO: Add consultation form/interface here */}
          <div className="pt-4">
            <p className="text-sm text-muted-foreground italic">
              Consultation interface for editing coming soon...
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Follow-up */}
      {visit.follow_up_required && (
        <Card>
          <CardHeader>
            <CardTitle>Follow-up</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Follow-up Date</p>
                <p className="font-medium">{visit.follow_up_date || 'Not scheduled'}</p>
              </div>
              {visit.follow_up_notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Follow-up Notes</p>
                  <p className="text-sm">{visit.follow_up_notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => navigate('/opd/visits')}>
          Back to Visits
        </Button>
        <Button>Save Consultation</Button>
      </div>
    </div>
  );
};

export default OPDConsultation;
