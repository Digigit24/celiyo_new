// src/pages/opd/Billing.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOpdVisit } from '@/hooks/useOpdVisit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2 } from 'lucide-react';

export const OPDBilling: React.FC = () => {
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
          <h1 className="text-2xl sm:text-3xl font-bold">OPD Billing</h1>
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
            <Badge variant={visit.status === 'completed' ? 'default' : 'secondary'}>
              {visit.status?.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Consultation Fee:</span>
              <span className="font-medium">₹{visit.consultation_fee || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Additional Charges:</span>
              <span className="font-medium">₹{visit.additional_charges || '0'}</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-semibold">Total Amount:</span>
              <span className="font-bold text-lg">₹{visit.total_amount || '0'}</span>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-2">Payment Status</p>
            <Badge
              variant={visit.payment_status === 'paid' ? 'default' : 'secondary'}
              className={`${visit.payment_status === 'paid' ? 'bg-green-600' : ''}`}
            >
              {visit.payment_status?.replace('_', ' ').toUpperCase() || 'PENDING'}
            </Badge>
          </div>

          {/* TODO: Add billing form/interface here */}
          <div className="pt-4">
            <p className="text-sm text-muted-foreground italic">
              Billing interface coming soon...
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => navigate('/opd/visits')}>
          Back to Visits
        </Button>
        <Button>Process Payment</Button>
      </div>
    </div>
  );
};

export default OPDBilling;
