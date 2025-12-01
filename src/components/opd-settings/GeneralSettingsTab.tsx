// src/components/opd-settings/GeneralSettingsTab.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Upload, Save } from 'lucide-react';
import { toast } from 'sonner';

export const GeneralSettingsTab: React.FC = () => {
  // Form state
  const [hospitalName, setHospitalName] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [address, setAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [headerFooterColor, setHeaderFooterColor] = useState('#3b82f6');
  const [gradientStart, setGradientStart] = useState('#3b82f6');
  const [gradientEnd, setGradientEnd] = useState('#8b5cf6');
  const [useGradient, setUseGradient] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log({
      hospitalName,
      logo,
      address,
      contactEmail,
      contactNumber,
      headerFooterColor: useGradient
        ? `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`
        : headerFooterColor,
    });
    toast.success('Hospital settings saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">General Settings</h2>
          <p className="text-muted-foreground">
            Configure hospital information and branding
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <CardTitle>Hospital Configuration</CardTitle>
          </div>
          <CardDescription>
            Update your hospital's basic information and appearance settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Row 1: Hospital Name and Logo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hospital Name */}
            <div className="space-y-2">
              <Label htmlFor="hospitalName">Hospital Name</Label>
              <Input
                id="hospitalName"
                placeholder="Enter hospital name"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
              />
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended: 200x200px
                  </p>
                </div>
                {logoPreview && (
                  <div className="w-20 h-20 border rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="Enter hospital address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
            />
          </div>

          {/* Row 2: Contact Email and Contact Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Email */}
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="contact@hospital.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Header/Footer Color */}
          <div className="space-y-4">
            <Label>Header/Footer Color</Label>

            {/* Gradient Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useGradient"
                checked={useGradient}
                onChange={(e) => setUseGradient(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <Label htmlFor="useGradient" className="font-normal cursor-pointer">
                Use gradient
              </Label>
            </div>

            {useGradient ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Gradient Start */}
                  <div className="space-y-2">
                    <Label htmlFor="gradientStart" className="text-sm">
                      Gradient Start
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="gradientStart"
                        type="color"
                        value={gradientStart}
                        onChange={(e) => setGradientStart(e.target.value)}
                        className="w-20 h-10 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={gradientStart}
                        onChange={(e) => setGradientStart(e.target.value)}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Gradient End */}
                  <div className="space-y-2">
                    <Label htmlFor="gradientEnd" className="text-sm">
                      Gradient End
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="gradientEnd"
                        type="color"
                        value={gradientEnd}
                        onChange={(e) => setGradientEnd(e.target.value)}
                        className="w-20 h-10 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={gradientEnd}
                        onChange={(e) => setGradientEnd(e.target.value)}
                        placeholder="#8b5cf6"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Gradient Preview */}
                <div className="space-y-2">
                  <Label className="text-sm">Preview</Label>
                  <div
                    className="h-12 rounded-lg border"
                    style={{
                      background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <Input
                    id="headerFooterColor"
                    type="color"
                    value={headerFooterColor}
                    onChange={(e) => setHeaderFooterColor(e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={headerFooterColor}
                    onChange={(e) => setHeaderFooterColor(e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
                {/* Solid Color Preview */}
                <div className="space-y-2">
                  <Label className="text-sm">Preview</Label>
                  <div
                    className="h-12 rounded-lg border"
                    style={{ backgroundColor: headerFooterColor }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} size="lg">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
