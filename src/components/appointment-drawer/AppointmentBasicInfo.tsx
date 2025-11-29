// src/components/appointment-drawer/AppointmentBasicInfo.tsx
import { forwardRef, useImperativeHandle, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { Appointment, AppointmentCreateData, AppointmentUpdateData } from '@/types/appointment.types';
import type { Doctor } from '@/types/doctor.types';
import type { Patient } from '@/types/patient.types';
import { useDoctor } from '@/hooks/useDoctor';
import { usePatient } from '@/hooks/usePatient';
import { useAppointmentType } from '@/hooks/useAppointmentType';

// Validation schemas
const createAppointmentSchema = z.object({
  doctor_id: z.coerce.number().min(1, 'Doctor is required'),
  patient_id: z.coerce.number().min(1, 'Patient is required'),
  appointment_date: z.string().min(1, 'Appointment date is required'),
  appointment_time: z.string().min(1, 'Appointment time is required'),
  duration_minutes: z.coerce.number().min(5, 'Duration must be at least 5 minutes').default(30),
  appointment_type: z.enum(['consultation', 'follow_up', 'emergency', 'routine_checkup']),
  consultation_mode: z.enum(['online', 'offline']),
  reason_for_visit: z.string().optional(),
  symptoms: z.string().optional(),
  notes: z.string().optional(),
  fee_amount: z.coerce.number().min(0, 'Fee cannot be negative').optional(),
  is_follow_up: z.boolean().optional(),
  parent_appointment_id: z.coerce.number().optional(),
});

const updateAppointmentSchema = z.object({
  appointment_date: z.string().optional(),
  appointment_time: z.string().optional(),
  duration_minutes: z.coerce.number().min(5).optional(),
  appointment_type: z.enum(['consultation', 'follow_up', 'emergency', 'routine_checkup']).optional(),
  status: z.enum(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']).optional(),
  consultation_mode: z.enum(['online', 'offline']).optional(),
  reason_for_visit: z.string().optional(),
  symptoms: z.string().optional(),
  diagnosis: z.string().optional(),
  prescription: z.string().optional(),
  notes: z.string().optional(),
  fee_amount: z.coerce.number().min(0).optional(),
  payment_status: z.enum(['pending', 'paid', 'partially_paid', 'refunded']).optional(),
});

type AppointmentFormData = z.infer<typeof createAppointmentSchema> | z.infer<typeof updateAppointmentSchema>;

export interface AppointmentBasicInfoHandle {
  getFormValues: () => Promise<AppointmentCreateData | AppointmentUpdateData | null>;
}

interface AppointmentBasicInfoProps {
  appointment?: Appointment | null;
  mode: 'view' | 'edit' | 'create';
  onSuccess?: () => void;
}

const AppointmentBasicInfo = forwardRef<AppointmentBasicInfoHandle, AppointmentBasicInfoProps>(
  ({ appointment, mode, onSuccess }, ref) => {
    const isReadOnly = mode === 'view';
    const isCreateMode = mode === 'create';

    // Fetch doctors, patients, and appointment types for selects
    const { useDoctors } = useDoctor();
    const { usePatients } = usePatient();
    const { useAppointmentTypes } = useAppointmentType();
    const { data: doctorsData } = useDoctors({ page_size: 100 });
    const { data: patientsData } = usePatients({ page_size: 100 });
    const { data: appointmentTypesData } = useAppointmentTypes({ is_active: true, page_size: 100 });

    const doctors = doctorsData?.results || [];
    const patients = patientsData?.results || [];
    const appointmentTypes = appointmentTypesData?.results || [];

    const schema = isCreateMode ? createAppointmentSchema : updateAppointmentSchema;

    const defaultValues = isCreateMode
      ? {
          doctor_id: 0,
          patient_id: 0,
          appointment_date: '',
          appointment_time: '',
          duration_minutes: 30,
          appointment_type: 'consultation' as const,
          consultation_mode: 'offline' as const,
          reason_for_visit: '',
          symptoms: '',
          notes: '',
          fee_amount: 0,
          is_follow_up: false,
        }
      : {
          appointment_date: appointment?.appointment_date || '',
          appointment_time: appointment?.appointment_time || '',
          duration_minutes: appointment?.duration_minutes || 30,
          appointment_type: appointment?.appointment_type || 'consultation',
          status: appointment?.status || 'scheduled',
          consultation_mode: appointment?.consultation_mode || 'offline',
          reason_for_visit: appointment?.reason_for_visit || '',
          symptoms: appointment?.symptoms || '',
          diagnosis: appointment?.diagnosis || '',
          prescription: appointment?.prescription || '',
          notes: appointment?.notes || '',
          fee_amount: parseFloat(appointment?.fee_amount || '0'),
          payment_status: appointment?.payment_status || 'pending',
        };

    const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
      setValue,
    } = useForm<any>({
      resolver: zodResolver(schema),
      defaultValues,
    });

    const watchedDoctorId = watch('doctor_id');
    const watchedAppointmentType = watch('appointment_type');
    const watchedConsultationMode = watch('consultation_mode');
    const watchedStatus = watch('status');
    const watchedPaymentStatus = watch('payment_status');

    // Auto-set fee based on selected doctor
    useEffect(() => {
      if (isCreateMode && watchedDoctorId) {
        const selectedDoctor = doctors.find(d => d.id === Number(watchedDoctorId));
        if (selectedDoctor) {
          const fee = watchedAppointmentType === 'follow_up'
            ? parseFloat(selectedDoctor.follow_up_fee || '0')
            : parseFloat(selectedDoctor.consultation_fee || '0');
          setValue('fee_amount', fee);
        }
      }
    }, [watchedDoctorId, watchedAppointmentType, doctors, isCreateMode, setValue]);

    // Expose form validation and data collection to parent
    useImperativeHandle(ref, () => ({
      getFormValues: async (): Promise<AppointmentCreateData | AppointmentUpdateData | null> => {
        return new Promise((resolve) => {
          handleSubmit(
            (data) => {
              if (isCreateMode) {
                const payload: AppointmentCreateData = {
                  doctor_id: Number(data.doctor_id),
                  patient_id: Number(data.patient_id),
                  appointment_date: data.appointment_date,
                  appointment_time: data.appointment_time,
                  duration_minutes: Number(data.duration_minutes),
                  appointment_type: data.appointment_type,
                  consultation_mode: data.consultation_mode,
                  reason_for_visit: data.reason_for_visit,
                  symptoms: data.symptoms,
                  notes: data.notes,
                  fee_amount: Number(data.fee_amount),
                  is_follow_up: data.is_follow_up,
                  parent_appointment_id: data.parent_appointment_id,
                };
                resolve(payload);
              } else {
                const payload: AppointmentUpdateData = {
                  appointment_date: data.appointment_date,
                  appointment_time: data.appointment_time,
                  duration_minutes: Number(data.duration_minutes),
                  appointment_type: data.appointment_type,
                  status: data.status,
                  consultation_mode: data.consultation_mode,
                  reason_for_visit: data.reason_for_visit,
                  symptoms: data.symptoms,
                  diagnosis: data.diagnosis,
                  prescription: data.prescription,
                  notes: data.notes,
                  fee_amount: Number(data.fee_amount),
                  payment_status: data.payment_status,
                };
                resolve(payload);
              }
            },
            () => resolve(null)
          )();
        });
      },
    }));

    return (
      <div className="space-y-6">
        {/* Doctor & Patient Selection (Create Mode Only) */}
        {isCreateMode && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Doctor & Patient</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Doctor Selection */}
              <div className="space-y-2">
                <Label htmlFor="doctor_id">Doctor *</Label>
                <Select
                  value={String(watchedDoctorId || '')}
                  onValueChange={(value) => setValue('doctor_id', Number(value))}
                >
                  <SelectTrigger className={errors.doctor_id ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={String(doctor.id)}>
                        {doctor.full_name} - {doctor.specialties?.map(s => s.name).join(', ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.doctor_id && (
                  <p className="text-sm text-destructive">{errors.doctor_id.message as string}</p>
                )}
              </div>

              {/* Patient Selection */}
              <div className="space-y-2">
                <Label htmlFor="patient_id">Patient *</Label>
                <Select
                  value={String(watch('patient_id') || '')}
                  onValueChange={(value) => setValue('patient_id', Number(value))}
                >
                  <SelectTrigger className={errors.patient_id ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={String(patient.id)}>
                        {patient.full_name} - {patient.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.patient_id && (
                  <p className="text-sm text-destructive">{errors.patient_id.message as string}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Mode: Show Doctor & Patient Info */}
        {!isCreateMode && appointment && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Doctor & Patient</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Doctor</Label>
                  <p className="font-medium">{appointment.doctor?.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {appointment.doctor?.specialties?.map(s => s.name).join(', ')}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Patient</Label>
                  <p className="font-medium">{appointment.patient?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{appointment.patient?.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appointment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Appointment Number (View/Edit only) */}
            {!isCreateMode && appointment && (
              <div className="space-y-2">
                <Label>Appointment Number</Label>
                <p className="font-mono font-medium">{appointment.appointment_number}</p>
              </div>
            )}

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointment_date">Appointment Date *</Label>
                <Input
                  id="appointment_date"
                  type="date"
                  {...register('appointment_date')}
                  disabled={isReadOnly}
                  className={errors.appointment_date ? 'border-destructive' : ''}
                />
                {errors.appointment_date && (
                  <p className="text-sm text-destructive">{errors.appointment_date.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointment_time">Appointment Time *</Label>
                <Input
                  id="appointment_time"
                  type="time"
                  {...register('appointment_time')}
                  disabled={isReadOnly}
                  className={errors.appointment_time ? 'border-destructive' : ''}
                />
                {errors.appointment_time && (
                  <p className="text-sm text-destructive">{errors.appointment_time.message as string}</p>
                )}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duration (minutes) *</Label>
              <Input
                id="duration_minutes"
                type="number"
                min="5"
                step="5"
                {...register('duration_minutes')}
                disabled={isReadOnly}
                className={errors.duration_minutes ? 'border-destructive' : ''}
              />
              {errors.duration_minutes && (
                <p className="text-sm text-destructive">{errors.duration_minutes.message as string}</p>
              )}
            </div>

            {/* Appointment Type */}
            <div className="space-y-2">
              <Label htmlFor="appointment_type">Appointment Type *</Label>
              {isReadOnly ? (
                <div className="pt-2">
                  <Badge variant="secondary">
                    {(typeof watchedAppointmentType === 'string' ? watchedAppointmentType.replace('_', ' ').toUpperCase() : 'N/A')}
                  </Badge>
                </div>
              ) : (
                <Select
                  value={watchedAppointmentType}
                  onValueChange={(value) => setValue('appointment_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.length > 0 ? (
                      appointmentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.code}>
                          {type.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        No appointment types available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Consultation Mode */}
            <div className="space-y-2">
              <Label htmlFor="consultation_mode">Consultation Mode *</Label>
              {isReadOnly ? (
                <div className="pt-2">
                  <Badge variant={watchedConsultationMode === 'online' ? 'default' : 'secondary'}>
                    {(typeof watchedConsultationMode === 'string' ? watchedConsultationMode.toUpperCase() : 'N/A')}
                  </Badge>
                </div>
              ) : (
                <Select
                  value={watchedConsultationMode}
                  onValueChange={(value) => setValue('consultation_mode', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select consultation mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Fee Amount */}
            <div className="space-y-2">
              <Label htmlFor="fee_amount">Fee Amount</Label>
              <Input
                id="fee_amount"
                type="number"
                min="0"
                step="0.01"
                {...register('fee_amount')}
                disabled={isReadOnly}
                className={errors.fee_amount ? 'border-destructive' : ''}
              />
              {errors.fee_amount && (
                <p className="text-sm text-destructive">{errors.fee_amount.message as string}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Reason for Visit */}
            <div className="space-y-2">
              <Label htmlFor="reason_for_visit">Reason for Visit</Label>
              <Textarea
                id="reason_for_visit"
                {...register('reason_for_visit')}
                placeholder="Brief description of the visit reason..."
                disabled={isReadOnly}
                rows={2}
              />
            </div>

            {/* Symptoms */}
            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms</Label>
              <Textarea
                id="symptoms"
                {...register('symptoms')}
                placeholder="Patient symptoms..."
                disabled={isReadOnly}
                rows={3}
              />
            </div>

            {/* Diagnosis (Edit Mode Only) */}
            {!isCreateMode && (
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Textarea
                  id="diagnosis"
                  {...register('diagnosis')}
                  placeholder="Doctor's diagnosis..."
                  disabled={isReadOnly}
                  rows={3}
                />
              </div>
            )}

            {/* Prescription (Edit Mode Only) */}
            {!isCreateMode && (
              <div className="space-y-2">
                <Label htmlFor="prescription">Prescription</Label>
                <Textarea
                  id="prescription"
                  {...register('prescription')}
                  placeholder="Prescribed medications and treatment..."
                  disabled={isReadOnly}
                  rows={3}
                />
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Additional notes..."
                disabled={isReadOnly}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Status & Payment (Edit/View Mode Only) */}
        {!isCreateMode && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status & Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Appointment Status</Label>
                {isReadOnly ? (
                  <div className="pt-2">
                    <Badge
                      variant={
                        watchedStatus === 'completed' ? 'default' :
                        watchedStatus === 'cancelled' || watchedStatus === 'no_show' ? 'destructive' :
                        'secondary'
                      }
                      className={
                        watchedStatus === 'completed' ? 'bg-green-600' :
                        watchedStatus === 'in_progress' ? 'bg-blue-600' :
                        watchedStatus === 'confirmed' ? 'bg-purple-600' : ''
                      }
                    >
                      {(typeof watchedStatus === 'string' ? watchedStatus.replace('_', ' ').toUpperCase() : 'N/A')}
                    </Badge>
                  </div>
                ) : (
                  <Select
                    value={watchedStatus}
                    onValueChange={(value) => setValue('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="no_show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Payment Status */}
              <div className="space-y-2">
                <Label htmlFor="payment_status">Payment Status</Label>
                {isReadOnly ? (
                  <div className="pt-2">
                    <Badge
                      variant={watchedPaymentStatus === 'paid' ? 'default' : 'secondary'}
                      className={watchedPaymentStatus === 'paid' ? 'bg-green-600' : ''}
                    >
                      {(typeof watchedPaymentStatus === 'string' ? watchedPaymentStatus.replace('_', ' ').toUpperCase() : 'N/A')}
                    </Badge>
                  </div>
                ) : (
                  <Select
                    value={watchedPaymentStatus}
                    onValueChange={(value) => setValue('payment_status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="partially_paid">Partially Paid</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
);

AppointmentBasicInfo.displayName = 'AppointmentBasicInfo';

export default AppointmentBasicInfo;
