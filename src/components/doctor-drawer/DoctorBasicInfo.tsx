// src/components/doctor-drawer/DoctorBasicInfo.tsx
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type {
  Doctor,
  DoctorCreateWithUserData,
  DoctorUpdateData,
  Specialty
} from '@/types/doctor.types';

// ==================== VALIDATION SCHEMAS ====================

// Schema for creating doctor with new user account
const createDoctorWithNewUserSchema = z.object({
  // User Account fields (create_user=true)
  create_user: z.literal(true),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirm: z.string().min(8, 'Password confirmation required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional().default(''),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  timezone: z.string().optional().default('Asia/Kolkata'),

  // Doctor Profile fields
  medical_license_number: z.string().min(1, 'Medical license number is required'),
  license_issuing_authority: z.string().min(1, 'License issuing authority is required'),
  license_issue_date: z.string().min(1, 'License issue date is required'),
  license_expiry_date: z.string().min(1, 'License expiry date is required'),
  qualifications: z.string().min(1, 'Qualifications are required'),
  specialty_ids: z.array(z.number()).optional(),
  years_of_experience: z.coerce.number().min(0, 'Experience cannot be negative').optional().default(0),
  consultation_fee: z.coerce.number().min(0, 'Consultation fee cannot be negative').optional().default(0),
  follow_up_fee: z.coerce.number().min(0, 'Follow-up fee cannot be negative').optional().default(0),
  consultation_duration: z.coerce.number().min(5, 'Consultation duration must be at least 5 minutes').optional().default(30),
  is_available_online: z.boolean().optional().default(true),
  is_available_offline: z.boolean().optional().default(true),
  status: z.enum(['active', 'on_leave', 'inactive']).optional().default('active'),
  signature: z.string().optional(),
  languages_spoken: z.string().optional(),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ["password_confirm"],
});

// Schema for creating doctor with existing user
const createDoctorWithExistingUserSchema = z.object({
  // Link to existing user (create_user=false)
  create_user: z.literal(false),
  user_id: z.string().uuid('Invalid user ID format').min(1, 'User ID is required'),

  // Doctor Profile fields
  medical_license_number: z.string().min(1, 'Medical license number is required'),
  license_issuing_authority: z.string().min(1, 'License issuing authority is required'),
  license_issue_date: z.string().min(1, 'License issue date is required'),
  license_expiry_date: z.string().min(1, 'License expiry date is required'),
  qualifications: z.string().min(1, 'Qualifications are required'),
  specialty_ids: z.array(z.number()).optional(),
  years_of_experience: z.coerce.number().min(0, 'Experience cannot be negative').optional().default(0),
  consultation_fee: z.coerce.number().min(0, 'Consultation fee cannot be negative').optional().default(0),
  follow_up_fee: z.coerce.number().min(0, 'Follow-up fee cannot be negative').optional().default(0),
  consultation_duration: z.coerce.number().min(5, 'Consultation duration must be at least 5 minutes').optional().default(30),
  is_available_online: z.boolean().optional().default(true),
  is_available_offline: z.boolean().optional().default(true),
  status: z.enum(['active', 'on_leave', 'inactive']).optional().default('active'),
  signature: z.string().optional(),
  languages_spoken: z.string().optional(),
});

// Update schema (for edit mode)
const updateDoctorSchema = z.object({
  medical_license_number: z.string().optional(),
  license_issuing_authority: z.string().optional(),
  license_issue_date: z.string().optional(),
  license_expiry_date: z.string().optional(),
  qualifications: z.string().optional(),
  specialty_ids: z.array(z.number()).optional(),
  years_of_experience: z.coerce.number().min(0).optional(),
  consultation_fee: z.coerce.number().min(0).optional(),
  follow_up_fee: z.coerce.number().min(0).optional(),
  consultation_duration: z.coerce.number().min(5).optional(),
  is_available_online: z.boolean().optional(),
  is_available_offline: z.boolean().optional(),
  status: z.enum(['active', 'on_leave', 'inactive']).optional(),
  signature: z.string().optional(),
  languages_spoken: z.string().optional(),
});

// ==================== COMPONENT INTERFACES ====================

export interface DoctorBasicInfoHandle {
  getFormValues: () => Promise<DoctorCreateWithUserData | DoctorUpdateData | null>;
}

interface DoctorBasicInfoProps {
  doctor?: Doctor | null;
  specialties: Specialty[];
  mode: 'view' | 'edit' | 'create';
  onSuccess?: () => void;
}

// ==================== COMPONENT ====================

const DoctorBasicInfo = forwardRef<DoctorBasicInfoHandle, DoctorBasicInfoProps>(
  ({ doctor, specialties, mode, onSuccess }, ref) => {
    const isReadOnly = mode === 'view';
    const isCreateMode = mode === 'create';

    // State for toggling between create new user vs link existing user
    const [createNewUser, setCreateNewUser] = useState(true);

    // Determine schema based on mode and createNewUser state
    const schema = isCreateMode
      ? createNewUser
        ? createDoctorWithNewUserSchema
        : createDoctorWithExistingUserSchema
      : updateDoctorSchema;

    const defaultValues = isCreateMode
      ? createNewUser
        ? {
            create_user: true,
            email: '',
            password: '',
            password_confirm: '',
            first_name: '',
            last_name: '',
            phone: '',
            timezone: 'Asia/Kolkata',
            medical_license_number: '',
            license_issuing_authority: '',
            license_issue_date: '',
            license_expiry_date: '',
            qualifications: '',
            specialty_ids: [],
            years_of_experience: 0,
            consultation_fee: 0,
            follow_up_fee: 0,
            consultation_duration: 30,
            is_available_online: true,
            is_available_offline: true,
            status: 'active' as const,
            signature: '',
            languages_spoken: '',
          }
        : {
            create_user: false,
            user_id: '',
            medical_license_number: '',
            license_issuing_authority: '',
            license_issue_date: '',
            license_expiry_date: '',
            qualifications: '',
            specialty_ids: [],
            years_of_experience: 0,
            consultation_fee: 0,
            follow_up_fee: 0,
            consultation_duration: 30,
            is_available_online: true,
            is_available_offline: true,
            status: 'active' as const,
            signature: '',
            languages_spoken: '',
          }
      : {
          medical_license_number: doctor?.medical_license_number || '',
          license_issuing_authority: doctor?.license_issuing_authority || '',
          license_issue_date: doctor?.license_issue_date || '',
          license_expiry_date: doctor?.license_expiry_date || '',
          qualifications: doctor?.qualifications || '',
          specialty_ids: doctor?.specialties?.map((s) => s.id) || [],
          years_of_experience: doctor?.years_of_experience || 0,
          consultation_fee: parseFloat(doctor?.consultation_fee || '0'),
          follow_up_fee: parseFloat(doctor?.follow_up_fee || '0'),
          consultation_duration: doctor?.consultation_duration || 30,
          is_available_online: doctor?.is_available_online ?? true,
          is_available_offline: doctor?.is_available_offline ?? true,
          status: doctor?.status || 'active',
          signature: doctor?.signature || '',
          languages_spoken: doctor?.languages_spoken || '',
        };

    const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
      setValue,
      reset,
    } = useForm<any>({
      resolver: zodResolver(schema),
      defaultValues,
    });

    const watchedSpecialtyIds = watch('specialty_ids') || [];
    const watchedStatus = watch('status');
    const watchedIsAvailableOnline = watch('is_available_online');
    const watchedIsAvailableOffline = watch('is_available_offline');

    // Handle create user toggle
    const handleCreateUserToggle = (checked: boolean) => {
      setCreateNewUser(checked);
      // Reset form when toggling
      reset(
        checked
          ? {
              create_user: true,
              email: '',
              password: '',
              password_confirm: '',
              first_name: '',
              last_name: '',
              phone: '',
              timezone: 'Asia/Kolkata',
              medical_license_number: '',
              license_issuing_authority: '',
              license_issue_date: '',
              license_expiry_date: '',
              qualifications: '',
              specialty_ids: [],
              years_of_experience: 0,
              consultation_fee: 0,
              follow_up_fee: 0,
              consultation_duration: 30,
              is_available_online: true,
              is_available_offline: true,
              status: 'active',
              signature: '',
              languages_spoken: '',
            }
          : {
              create_user: false,
              user_id: '',
              medical_license_number: '',
              license_issuing_authority: '',
              license_issue_date: '',
              license_expiry_date: '',
              qualifications: '',
              specialty_ids: [],
              years_of_experience: 0,
              consultation_fee: 0,
              follow_up_fee: 0,
              consultation_duration: 30,
              is_available_online: true,
              is_available_offline: true,
              status: 'active',
              signature: '',
              languages_spoken: '',
            }
      );
    };

    // Expose form validation and data collection to parent
    useImperativeHandle(ref, () => ({
      getFormValues: async (): Promise<DoctorCreateWithUserData | DoctorUpdateData | null> => {
        return new Promise((resolve) => {
          handleSubmit(
            (data) => {
              if (isCreateMode) {
                const payload: DoctorCreateWithUserData = {
                  create_user: createNewUser,
                  ...(createNewUser
                    ? {
                        email: data.email,
                        password: data.password,
                        password_confirm: data.password_confirm,
                        first_name: data.first_name,
                        last_name: data.last_name || '',
                        phone: data.phone || '',
                        timezone: data.timezone || 'Asia/Kolkata',
                      }
                    : {
                        user_id: data.user_id,
                      }),
                  medical_license_number: data.medical_license_number,
                  license_issuing_authority: data.license_issuing_authority,
                  license_issue_date: data.license_issue_date,
                  license_expiry_date: data.license_expiry_date,
                  qualifications: data.qualifications,
                  specialty_ids: data.specialty_ids || [],
                  years_of_experience: Number(data.years_of_experience) || 0,
                  consultation_fee: Number(data.consultation_fee) || 0,
                  follow_up_fee: Number(data.follow_up_fee) || 0,
                  consultation_duration: Number(data.consultation_duration) || 30,
                  is_available_online: data.is_available_online ?? true,
                  is_available_offline: data.is_available_offline ?? true,
                  status: data.status || 'active',
                  signature: data.signature || '',
                  languages_spoken: data.languages_spoken || '',
                };
                resolve(payload);
              } else {
                const payload: DoctorUpdateData = {
                  medical_license_number: data.medical_license_number,
                  license_issuing_authority: data.license_issuing_authority,
                  license_issue_date: data.license_issue_date,
                  license_expiry_date: data.license_expiry_date,
                  qualifications: data.qualifications,
                  specialty_ids: data.specialty_ids,
                  years_of_experience: Number(data.years_of_experience),
                  consultation_fee: Number(data.consultation_fee),
                  follow_up_fee: Number(data.follow_up_fee),
                  consultation_duration: Number(data.consultation_duration),
                  is_available_online: data.is_available_online,
                  is_available_offline: data.is_available_offline,
                  status: data.status,
                  signature: data.signature,
                  languages_spoken: data.languages_spoken,
                };
                resolve(payload);
              }
            },
            (errors) => {
              console.error('Form validation errors:', errors);
              resolve(null);
            }
          )();
        });
      },
    }));

    const toggleSpecialty = (specialtyId: number) => {
      if (isReadOnly) return;

      const currentIds = watchedSpecialtyIds;
      if (currentIds.includes(specialtyId)) {
        setValue('specialty_ids', currentIds.filter((id: number) => id !== specialtyId));
      } else {
        setValue('specialty_ids', [...currentIds, specialtyId]);
      }
    };

    return (
      <div className="space-y-6">
        {/* User Account Mode Selection (Create Mode Only) */}
        {isCreateMode && (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">User Account Setup</CardTitle>
              <CardDescription>
                Choose whether to create a new user account or link to an existing user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="create-new-user"
                  checked={createNewUser}
                  onCheckedChange={handleCreateUserToggle}
                />
                <Label htmlFor="create-new-user" className="font-medium">
                  {createNewUser ? 'Creating new user account' : 'Linking to existing user'}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {createNewUser
                  ? 'A new user account will be created in SuperAdmin along with the doctor profile'
                  : 'Doctor profile will be linked to an existing user account'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* User Account Information (Create Mode with Create New User) */}
        {isCreateMode && createNewUser && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">New User Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="doctor@example.com"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message as string}</p>
                )}
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="••••••••"
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message as string}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirm">Confirm Password *</Label>
                  <Input
                    id="password_confirm"
                    type="password"
                    {...register('password_confirm')}
                    placeholder="••••••••"
                    className={errors.password_confirm ? 'border-destructive' : ''}
                  />
                  {errors.password_confirm && (
                    <p className="text-sm text-destructive">
                      {errors.password_confirm.message as string}
                    </p>
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    {...register('first_name')}
                    placeholder="John"
                    className={errors.first_name ? 'border-destructive' : ''}
                  />
                  {errors.first_name && (
                    <p className="text-sm text-destructive">{errors.first_name.message as string}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    {...register('last_name')}
                    placeholder="Smith"
                    className={errors.last_name ? 'border-destructive' : ''}
                  />
                  {errors.last_name && (
                    <p className="text-sm text-destructive">{errors.last_name.message as string}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+1234567890"
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message as string}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Link to Existing User (Create Mode with Link Existing User) */}
        {isCreateMode && !createNewUser && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Existing User Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user_id">User ID (UUID) *</Label>
                <Input
                  id="user_id"
                  {...register('user_id')}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  className={errors.user_id ? 'border-destructive' : ''}
                />
                {errors.user_id && (
                  <p className="text-sm text-destructive">{errors.user_id.message as string}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Enter the UUID of the existing user account from SuperAdmin
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personal Information (View/Edit Mode Only) */}
        {!isCreateMode && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">User ID</Label>
                  <p className="font-mono text-xs">{doctor?.user_id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medical License Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Medical License</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isReadOnly ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="medical_license_number">License Number *</Label>
                  <Input
                    id="medical_license_number"
                    {...register('medical_license_number')}
                    placeholder="MED-12345"
                    className={errors.medical_license_number ? 'border-destructive' : ''}
                  />
                  {errors.medical_license_number && (
                    <p className="text-sm text-destructive">
                      {errors.medical_license_number.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license_issuing_authority">Issuing Authority *</Label>
                  <Input
                    id="license_issuing_authority"
                    {...register('license_issuing_authority')}
                    placeholder="Medical Board of..."
                    className={errors.license_issuing_authority ? 'border-destructive' : ''}
                  />
                  {errors.license_issuing_authority && (
                    <p className="text-sm text-destructive">
                      {errors.license_issuing_authority.message as string}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="license_issue_date">Issue Date *</Label>
                    <Input
                      id="license_issue_date"
                      type="date"
                      {...register('license_issue_date')}
                      className={errors.license_issue_date ? 'border-destructive' : ''}
                    />
                    {errors.license_issue_date && (
                      <p className="text-sm text-destructive">
                        {errors.license_issue_date.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="license_expiry_date">Expiry Date *</Label>
                    <Input
                      id="license_expiry_date"
                      type="date"
                      {...register('license_expiry_date')}
                      className={errors.license_expiry_date ? 'border-destructive' : ''}
                    />
                    {errors.license_expiry_date && (
                      <p className="text-sm text-destructive">
                        {errors.license_expiry_date.message as string}
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">License Number</Label>
                  <p className="font-mono">{doctor?.medical_license_number}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Issuing Authority</Label>
                  <p>{doctor?.license_issuing_authority || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Issue Date</Label>
                  <p>{doctor?.license_issue_date || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Expiry Date</Label>
                  <p>{doctor?.license_expiry_date || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">License Status</Label>
                  <p>
                    {doctor?.is_license_valid ? (
                      <Badge variant="default" className="bg-green-600">
                        Valid
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Expired</Badge>
                    )}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Qualifications */}
            <div className="space-y-2">
              <Label htmlFor="qualifications">Qualifications *</Label>
              <Textarea
                id="qualifications"
                {...register('qualifications')}
                placeholder="MBBS, MD, etc."
                disabled={isReadOnly}
                rows={3}
                className={errors.qualifications ? 'border-destructive' : ''}
              />
              {errors.qualifications && (
                <p className="text-sm text-destructive">{errors.qualifications.message as string}</p>
              )}
            </div>

            {/* Specialties */}
            <div className="space-y-2">
              <Label>Specialties</Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[60px]">
                {specialties.map((specialty) => (
                  <Badge
                    key={specialty.id}
                    variant={watchedSpecialtyIds.includes(specialty.id) ? 'default' : 'outline'}
                    className={`cursor-pointer ${isReadOnly ? 'cursor-default' : ''}`}
                    onClick={() => toggleSpecialty(specialty.id)}
                  >
                    {specialty.name}
                    {watchedSpecialtyIds.includes(specialty.id) && !isReadOnly && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
              {errors.specialty_ids && (
                <p className="text-sm text-destructive">{errors.specialty_ids.message as string}</p>
              )}
            </div>

            {/* Years of Experience */}
            <div className="space-y-2">
              <Label htmlFor="years_of_experience">Years of Experience</Label>
              <Input
                id="years_of_experience"
                type="number"
                min="0"
                {...register('years_of_experience')}
                disabled={isReadOnly}
                className={errors.years_of_experience ? 'border-destructive' : ''}
              />
              {errors.years_of_experience && (
                <p className="text-sm text-destructive">
                  {errors.years_of_experience.message as string}
                </p>
              )}
            </div>

            {/* Languages Spoken */}
            <div className="space-y-2">
              <Label htmlFor="languages_spoken">Languages Spoken</Label>
              <Input
                id="languages_spoken"
                {...register('languages_spoken')}
                placeholder="English, Hindi, etc."
                disabled={isReadOnly}
                className={errors.languages_spoken ? 'border-destructive' : ''}
              />
              {errors.languages_spoken && (
                <p className="text-sm text-destructive">{errors.languages_spoken.message as string}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Consultation & Fees */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Consultation & Fees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="consultation_fee">Consultation Fee</Label>
                <Input
                  id="consultation_fee"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('consultation_fee')}
                  disabled={isReadOnly}
                  className={errors.consultation_fee ? 'border-destructive' : ''}
                />
                {errors.consultation_fee && (
                  <p className="text-sm text-destructive">
                    {errors.consultation_fee.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="follow_up_fee">Follow-up Fee</Label>
                <Input
                  id="follow_up_fee"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('follow_up_fee')}
                  disabled={isReadOnly}
                  className={errors.follow_up_fee ? 'border-destructive' : ''}
                />
                {errors.follow_up_fee && (
                  <p className="text-sm text-destructive">
                    {errors.follow_up_fee.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultation_duration">Consultation Duration (minutes)</Label>
              <Input
                id="consultation_duration"
                type="number"
                min="5"
                step="5"
                {...register('consultation_duration')}
                disabled={isReadOnly}
                className={errors.consultation_duration ? 'border-destructive' : ''}
              />
              {errors.consultation_duration && (
                <p className="text-sm text-destructive">
                  {errors.consultation_duration.message as string}
                </p>
              )}
            </div>

            {/* Availability Toggles */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_available_online">Available Online</Label>
                  <p className="text-sm text-muted-foreground">
                    Doctor can provide online consultations
                  </p>
                </div>
                <Switch
                  id="is_available_online"
                  checked={watchedIsAvailableOnline}
                  onCheckedChange={(checked) => setValue('is_available_online', checked)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_available_offline">Available Offline</Label>
                  <p className="text-sm text-muted-foreground">
                    Doctor can provide in-person consultations
                  </p>
                </div>
                <Switch
                  id="is_available_offline"
                  checked={watchedIsAvailableOffline}
                  onCheckedChange={(checked) => setValue('is_available_offline', checked)}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="status">Doctor Status</Label>
              {isReadOnly ? (
                <div className="pt-2">
                  <Badge
                    variant={
                      doctor?.status === 'active'
                        ? 'default'
                        : doctor?.status === 'on_leave'
                        ? 'secondary'
                        : 'destructive'
                    }
                    className={
                      doctor?.status === 'active'
                        ? 'bg-green-600'
                        : doctor?.status === 'on_leave'
                        ? 'bg-orange-600'
                        : ''
                    }
                  >
                    {doctor?.status === 'active' && 'Active'}
                    {doctor?.status === 'on_leave' && 'On Leave'}
                    {doctor?.status === 'inactive' && 'Inactive'}
                  </Badge>
                </div>
              ) : (
                <Select value={watchedStatus} onValueChange={(value) => setValue('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics (View Mode Only) */}
        {mode === 'view' && doctor && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Average Rating</Label>
                  <p className="text-lg font-bold">{doctor.average_rating} ⭐</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Reviews</Label>
                  <p className="text-lg font-bold">{doctor.total_reviews}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Consultations</Label>
                  <p className="text-lg font-bold">{doctor.total_consultations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
);

DoctorBasicInfo.displayName = 'DoctorBasicInfo';

export default DoctorBasicInfo;
