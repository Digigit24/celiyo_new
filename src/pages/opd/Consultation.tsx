// src/pages/opd/Consultation.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOpdVisit } from '@/hooks/useOpdVisit';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, User, Phone, Calendar, Activity, Droplet, Ruler, Weight } from 'lucide-react';
import { format } from 'date-fns';
import { ConsultationTab } from '@/components/consultation/ConsultationTab';
import { BillingTab } from '@/components/consultation/BillingTab';
import { HistoryTab } from '@/components/consultation/HistoryTab';
import { ProfileTab } from '@/components/consultation/ProfileTab';

export const OPDConsultation: React.FC = () => {
  const { visitId } = useParams<{ visitId: string }>();
  const navigate = useNavigate();
  const { useOpdVisitById } = useOpdVisit();
  const [activeTab, setActiveTab] = useState('consultation');

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

  const patient = visit.patient_details;
  const doctor = visit.doctor_details;

  // Calculate BMI if height and weight are available
  const calculateBMI = () => {
    // Placeholder - would need height and weight from patient data
    return 'N/A';
  };

  // Format visit date
  const formatVisitDate = (date: string) => {
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return date;
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/opd/visits')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Patient Consultation</h1>
          <p className="text-muted-foreground text-sm">
            Visit: {visit.visit_number} • {formatVisitDate(visit.visit_date)}
          </p>
        </div>
      </div>

      {/* Patient Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl font-semibold bg-primary/10">
                  {patient?.full_name?.charAt(0) || 'P'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">{patient?.full_name || 'N/A'}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>ID: {patient?.patient_id || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{patient?.mobile_primary || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Patient Details Grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Age & Gender */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Age / Gender
                </p>
                <p className="font-semibold">
                  {patient?.age || 'N/A'} yrs • {patient?.gender || 'N/A'}
                </p>
              </div>

              {/* Blood Group */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Droplet className="h-3 w-3" />
                  Blood Group
                </p>
                <p className="font-semibold">
                  {patient?.blood_group || 'N/A'}
                </p>
              </div>

              {/* BMI */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  BMI
                </p>
                <p className="font-semibold">{calculateBMI()}</p>
              </div>

              {/* Visit Status */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge
                  variant={visit.status === 'completed' ? 'default' : 'secondary'}
                  className={
                    visit.status === 'completed'
                      ? 'bg-green-600'
                      : visit.status === 'in_progress'
                      ? 'bg-blue-600'
                      : 'bg-orange-600'
                  }
                >
                  {visit.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Doctor & Visit Info */}
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Consulting Doctor</p>
              <p className="font-medium">{doctor?.full_name || 'N/A'}</p>
              <p className="text-xs text-muted-foreground">
                {doctor?.specialties?.map(s => s.name).join(', ')}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Visit Type</p>
              <Badge variant="secondary" className="mt-1">
                {visit.visit_type?.replace('_', ' ').toUpperCase() || 'N/A'}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Priority</p>
              <Badge
                variant={visit.priority === 'urgent' || visit.priority === 'high' ? 'destructive' : 'outline'}
                className={`mt-1 ${visit.priority === 'high' ? 'bg-orange-600 text-white' : ''}`}
              >
                {visit.priority?.toUpperCase() || 'NORMAL'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content with Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-8">
          <Card>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b px-6 pt-6">
                <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="consultation"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    Consultation
                  </TabsTrigger>
                  <TabsTrigger
                    value="billing"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    Billing
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    History
                  </TabsTrigger>
                  <TabsTrigger
                    value="profile"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    Profile
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="consultation" className="mt-0">
                  <ConsultationTab visit={visit} />
                </TabsContent>

                <TabsContent value="billing" className="mt-0">
                  <BillingTab visit={visit} />
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  <HistoryTab patientId={visit.patient} />
                </TabsContent>

                <TabsContent value="profile" className="mt-0">
                  <ProfileTab patientId={visit.patient} />
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>

        {/* Sticky Cost Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-6">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Cost Summary
                </h3>

                <div className="space-y-4">
                  {/* Consultation Fee */}
                  <div className="flex justify-between items-center pb-3 border-b">
                    <div>
                      <p className="text-sm font-medium">Consultation Fee</p>
                      <p className="text-xs text-muted-foreground">
                        {visit.visit_type === 'follow_up' ? 'Follow-up Visit' : 'First Visit'}
                      </p>
                    </div>
                    <p className="text-lg font-semibold">₹{visit.consultation_fee || doctor?.consultation_fee || '0'}</p>
                  </div>

                  {/* Additional Charges */}
                  {visit.additional_charges && parseInt(visit.additional_charges) > 0 && (
                    <div className="flex justify-between items-center pb-3 border-b">
                      <div>
                        <p className="text-sm font-medium">Additional Charges</p>
                        <p className="text-xs text-muted-foreground">Tests & Procedures</p>
                      </div>
                      <p className="text-lg font-semibold">₹{visit.additional_charges}</p>
                    </div>
                  )}

                  {/* Discount */}
                  {visit.discount && parseInt(visit.discount) > 0 && (
                    <div className="flex justify-between items-center pb-3 border-b text-green-600">
                      <div>
                        <p className="text-sm font-medium">Discount</p>
                        <p className="text-xs opacity-75">Applied</p>
                      </div>
                      <p className="text-lg font-semibold">-₹{visit.discount}</p>
                    </div>
                  )}

                  {/* Total Amount */}
                  <div className="flex justify-between items-center pt-2 bg-primary/5 -mx-6 px-6 py-4 rounded-lg">
                    <div>
                      <p className="text-base font-bold">Total Amount</p>
                      <p className="text-xs text-muted-foreground">Amount Payable</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">₹{visit.total_amount || '0'}</p>
                  </div>

                  {/* Payment Status */}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm font-medium">Payment Status</p>
                      <Badge
                        variant={visit.payment_status === 'paid' ? 'default' : 'secondary'}
                        className={`${visit.payment_status === 'paid' ? 'bg-green-600' : 'bg-orange-600'}`}
                      >
                        {visit.payment_status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                      </Badge>
                    </div>

                    {visit.payment_status !== 'paid' && (
                      <Button className="w-full" size="lg">
                        <Activity className="h-4 w-4 mr-2" />
                        Process Payment
                      </Button>
                    )}

                    {visit.payment_status === 'paid' && (
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Paid On</span>
                          <span className="font-medium">{formatVisitDate(visit.visit_date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment Mode</span>
                          <span className="font-medium">Cash</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-4 border-t space-y-2">
                    <Button variant="outline" className="w-full" size="sm">
                      <Activity className="h-4 w-4 mr-2" />
                      Generate Invoice
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      <Activity className="h-4 w-4 mr-2" />
                      Print Receipt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visit Quick Info */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <h4 className="text-sm font-semibold mb-3">Visit Information</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Visit Number</span>
                    <span className="font-medium font-mono">{visit.visit_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Visit Date</span>
                    <span className="font-medium">{formatVisitDate(visit.visit_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Visit Time</span>
                    <span className="font-medium">{visit.visit_time}</span>
                  </div>
                  {visit.queue_number && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Queue Number</span>
                      <Badge variant="outline" className="text-xs">#{visit.queue_number}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OPDConsultation;
