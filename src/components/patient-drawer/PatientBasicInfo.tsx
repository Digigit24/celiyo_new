// src/components/patient-drawer/PatientBasicInfo.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { createPatient, updatePatient } from '@/services/patient.service';
import type { PatientDetail, PatientCreateData, PatientGender, BloodGroup, MaritalStatus, PatientStatus } from '@/types/patient.types';
import { useEffect } from 'react';

interface PatientBasicInfoProps {
  patient: PatientDetail | null;
  mode: 'view' | 'edit' | 'create';
  onSuccess?: () => void;
}

const patientSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, 'Last name is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  mobile_primary: z.string().min(10, 'Valid mobile number is required'),
  mobile_secondary: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  blood_group: z.string().optional(),
  marital_status: z.string().optional(),
  occupation: z.string().optional(),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  country: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  emergency_contact_relation: z.string().optional(),
  insurance_provider: z.string().optional(),
  insurance_policy_number: z.string().optional(),
  insurance_expiry_date: z.string().optional(),
  status: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function PatientBasicInfo({ patient, mode, onSuccess }: PatientBasicInfoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      country: 'India',
      status: 'active',
    },
  });

  const isReadOnly = mode === 'view';

  useEffect(() => {
    if (patient) {
      reset({
        first_name: patient.first_name || '',
        middle_name: patient.middle_name || '',
        last_name: patient.last_name || '',
        date_of_birth: patient.date_of_birth || '',
        gender: patient.gender || 'male',
        mobile_primary: patient.mobile_primary || '',
        mobile_secondary: patient.mobile_secondary || '',
        email: patient.email || '',
        blood_group: patient.blood_group || '',
        marital_status: patient.marital_status || '',
        occupation: patient.occupation || '',
        address_line1: patient.address_line1 || '',
        address_line2: patient.address_line2 || '',
        city: patient.city || '',
        state: patient.state || '',
        pincode: patient.pincode || '',
        country: patient.country || 'India',
        height: patient.height || '',
        weight: patient.weight || '',
        emergency_contact_name: patient.emergency_contact_name || '',
        emergency_contact_phone: patient.emergency_contact_phone || '',
        emergency_contact_relation: patient.emergency_contact_relation || '',
        insurance_provider: patient.insurance_provider || '',
        insurance_policy_number: patient.insurance_policy_number || '',
        insurance_expiry_date: patient.insurance_expiry_date || '',
        status: patient.status || 'active',
      });
    }
  }, [patient, reset]);

  const onSubmit = async (data: PatientFormData) => {
    try {
      const payload: PatientCreateData = {
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: data.date_of_birth,
        gender: data.gender as PatientGender,
        mobile_primary: data.mobile_primary,
        middle_name: data.middle_name || null,
        mobile_secondary: data.mobile_secondary || null,
        email: data.email || null,
        blood_group: data.blood_group as BloodGroup || null,
        marital_status: data.marital_status as MaritalStatus || null,
        occupation: data.occupation || null,
        address_line1: data.address_line1 || null,
        address_line2: data.address_line2 || null,
        city: data.city || null,
        state: data.state || null,
        pincode: data.pincode || null,
        country: data.country || 'India',
        height: data.height || null,
        weight: data.weight || null,
        emergency_contact_name: data.emergency_contact_name || null,
        emergency_contact_phone: data.emergency_contact_phone || null,
        emergency_contact_relation: data.emergency_contact_relation || null,
        insurance_provider: data.insurance_provider || null,
        insurance_policy_number: data.insurance_policy_number || null,
        insurance_expiry_date: data.insurance_expiry_date || null,
        status: data.status as PatientStatus || 'active',
      };

      if (mode === 'create') {
        await createPatient(payload);
        toast.success('Patient registered successfully');
      } else if (mode === 'edit' && patient) {
        await updatePatient(patient.id, payload);
        toast.success('Patient updated successfully');
      }

      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save patient');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              {...register('first_name')}
              disabled={isReadOnly}
              className={errors.first_name ? 'border-destructive' : ''}
            />
            {errors.first_name && (
              <p className="text-sm text-destructive">{errors.first_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="middle_name">Middle Name</Label>
            <Input
              id="middle_name"
              {...register('middle_name')}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              {...register('last_name')}
              disabled={isReadOnly}
              className={errors.last_name ? 'border-destructive' : ''}
            />
            {errors.last_name && (
              <p className="text-sm text-destructive">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth *</Label>
            <Input
              id="date_of_birth"
              type="date"
              {...register('date_of_birth')}
              disabled={isReadOnly}
              className={errors.date_of_birth ? 'border-destructive' : ''}
            />
            {errors.date_of_birth && (
              <p className="text-sm text-destructive">{errors.date_of_birth.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select
              value={watch('gender')}
              onValueChange={(value) => setValue('gender', value as PatientGender)}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="blood_group">Blood Group</Label>
            <Select
              value={watch('blood_group')}
              onValueChange={(value) => setValue('blood_group', value)}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="marital_status">Marital Status</Label>
            <Select
              value={watch('marital_status')}
              onValueChange={(value) => setValue('marital_status', value)}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              {...register('occupation')}
              disabled={isReadOnly}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mobile_primary">Primary Mobile *</Label>
            <Input
              id="mobile_primary"
              {...register('mobile_primary')}
              disabled={isReadOnly}
              className={errors.mobile_primary ? 'border-destructive' : ''}
            />
            {errors.mobile_primary && (
              <p className="text-sm text-destructive">{errors.mobile_primary.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile_secondary">Secondary Mobile</Label>
            <Input
              id="mobile_secondary"
              {...register('mobile_secondary')}
              disabled={isReadOnly}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            disabled={isReadOnly}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Address</h3>

        <div className="space-y-2">
          <Label htmlFor="address_line1">Address Line 1</Label>
          <Input
            id="address_line1"
            {...register('address_line1')}
            disabled={isReadOnly}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address_line2">Address Line 2</Label>
          <Input
            id="address_line2"
            {...register('address_line2')}
            disabled={isReadOnly}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...register('city')}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              {...register('state')}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              {...register('pincode')}
              disabled={isReadOnly}
            />
          </div>
        </div>
      </div>

      {!isReadOnly && (
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Register Patient' : 'Save Changes'}
          </Button>
        </div>
      )}
    </form>
  );
}
