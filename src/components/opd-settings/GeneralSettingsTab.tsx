// src/components/opd-settings/GeneralSettingsTab.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Building2, Save } from 'lucide-react';
import { toast } from 'sonner';

export const GeneralSettingsTab: React.FC = () => {
  // Basic Information
  const [hospitalName, setHospitalName] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [address, setAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // Header Configuration
  const [headerLayout, setHeaderLayout] = useState<'split' | 'centered'>('split');
  const [headerBgColor, setHeaderBgColor] = useState('#3b82f6');
  const [headerGradientStart, setHeaderGradientStart] = useState('#3b82f6');
  const [headerGradientEnd, setHeaderGradientEnd] = useState('#8b5cf6');
  const [headerUseGradient, setHeaderUseGradient] = useState(false);
  const [headerTextColor, setHeaderTextColor] = useState('#ffffff');

  // Footer Configuration
  const [footerAlignment, setFooterAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [useSeparateFooterColor, setUseSeparateFooterColor] = useState(false);
  const [footerBgColor, setFooterBgColor] = useState('#3b82f6');
  const [footerGradientStart, setFooterGradientStart] = useState('#3b82f6');
  const [footerGradientEnd, setFooterGradientEnd] = useState('#8b5cf6');
  const [footerUseGradient, setFooterUseGradient] = useState(false);
  const [footerTextColor, setFooterTextColor] = useState('#ffffff');

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
      websiteUrl,
      header: {
        layout: headerLayout,
        backgroundColor: headerUseGradient
          ? `linear-gradient(to right, ${headerGradientStart}, ${headerGradientEnd})`
          : headerBgColor,
        textColor: headerTextColor,
      },
      footer: {
        alignment: footerAlignment,
        backgroundColor: useSeparateFooterColor
          ? footerUseGradient
            ? `linear-gradient(to right, ${footerGradientStart}, ${footerGradientEnd})`
            : footerBgColor
          : headerUseGradient
            ? `linear-gradient(to right, ${headerGradientStart}, ${headerGradientEnd})`
            : headerBgColor,
        textColor: useSeparateFooterColor ? footerTextColor : headerTextColor,
      },
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

      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <CardTitle>Hospital Information</CardTitle>
          </div>
          <CardDescription>
            Basic hospital details and contact information
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

          {/* Website URL - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input
              id="websiteUrl"
              type="url"
              placeholder="https://www.hospital.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Header Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle>Header Configuration</CardTitle>
          <CardDescription>
            Customize the header layout, colors, and appearance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header Layout Selection */}
          <div className="space-y-3">
            <Label>Header Layout</Label>
            <RadioGroup value={headerLayout} onValueChange={(value: any) => setHeaderLayout(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="split" id="layout-split" />
                <Label htmlFor="layout-split" className="font-normal cursor-pointer">
                  Split Layout - Logo & Name on left, Contact Email & Website on right
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="centered" id="layout-centered" />
                <Label htmlFor="layout-centered" className="font-normal cursor-pointer">
                  Centered Layout - Logo, Name, Email, Contact, Address, Website (all centered)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Header Background Color */}
          <div className="space-y-4">
            <Label>Header Background Color</Label>

            {/* Gradient Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="headerUseGradient"
                checked={headerUseGradient}
                onChange={(e) => setHeaderUseGradient(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <Label htmlFor="headerUseGradient" className="font-normal cursor-pointer">
                Use gradient
              </Label>
            </div>

            {headerUseGradient ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Gradient Start */}
                  <div className="space-y-2">
                    <Label htmlFor="headerGradientStart" className="text-sm">
                      Gradient Start
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="headerGradientStart"
                        type="color"
                        value={headerGradientStart}
                        onChange={(e) => setHeaderGradientStart(e.target.value)}
                        className="w-20 h-10 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={headerGradientStart}
                        onChange={(e) => setHeaderGradientStart(e.target.value)}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Gradient End */}
                  <div className="space-y-2">
                    <Label htmlFor="headerGradientEnd" className="text-sm">
                      Gradient End
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="headerGradientEnd"
                        type="color"
                        value={headerGradientEnd}
                        onChange={(e) => setHeaderGradientEnd(e.target.value)}
                        className="w-20 h-10 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={headerGradientEnd}
                        onChange={(e) => setHeaderGradientEnd(e.target.value)}
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
                      background: `linear-gradient(to right, ${headerGradientStart}, ${headerGradientEnd})`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <Input
                    id="headerBgColor"
                    type="color"
                    value={headerBgColor}
                    onChange={(e) => setHeaderBgColor(e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={headerBgColor}
                    onChange={(e) => setHeaderBgColor(e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
                {/* Solid Color Preview */}
                <div className="space-y-2">
                  <Label className="text-sm">Preview</Label>
                  <div
                    className="h-12 rounded-lg border"
                    style={{ backgroundColor: headerBgColor }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Header Text Color */}
          <div className="space-y-2">
            <Label htmlFor="headerTextColor">Header Text Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="headerTextColor"
                type="color"
                value={headerTextColor}
                onChange={(e) => setHeaderTextColor(e.target.value)}
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={headerTextColor}
                onChange={(e) => setHeaderTextColor(e.target.value)}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle>Footer Configuration</CardTitle>
          <CardDescription>
            Customize the footer alignment and colors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Footer Alignment */}
          <div className="space-y-3">
            <Label>Footer Alignment</Label>
            <RadioGroup value={footerAlignment} onValueChange={(value: any) => setFooterAlignment(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="left" id="align-left" />
                <Label htmlFor="align-left" className="font-normal cursor-pointer">
                  Left Aligned
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="center" id="align-center" />
                <Label htmlFor="align-center" className="font-normal cursor-pointer">
                  Center Aligned
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="right" id="align-right" />
                <Label htmlFor="align-right" className="font-normal cursor-pointer">
                  Right Aligned
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Use Separate Footer Color */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useSeparateFooterColor"
              checked={useSeparateFooterColor}
              onChange={(e) => setUseSeparateFooterColor(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <Label htmlFor="useSeparateFooterColor" className="font-normal cursor-pointer">
              Use different colors for footer
            </Label>
          </div>

          {useSeparateFooterColor && (
            <>
              {/* Footer Background Color */}
              <div className="space-y-4">
                <Label>Footer Background Color</Label>

                {/* Gradient Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="footerUseGradient"
                    checked={footerUseGradient}
                    onChange={(e) => setFooterUseGradient(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label htmlFor="footerUseGradient" className="font-normal cursor-pointer">
                    Use gradient
                  </Label>
                </div>

                {footerUseGradient ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Gradient Start */}
                      <div className="space-y-2">
                        <Label htmlFor="footerGradientStart" className="text-sm">
                          Gradient Start
                        </Label>
                        <div className="flex gap-2 items-center">
                          <Input
                            id="footerGradientStart"
                            type="color"
                            value={footerGradientStart}
                            onChange={(e) => setFooterGradientStart(e.target.value)}
                            className="w-20 h-10 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={footerGradientStart}
                            onChange={(e) => setFooterGradientStart(e.target.value)}
                            placeholder="#3b82f6"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      {/* Gradient End */}
                      <div className="space-y-2">
                        <Label htmlFor="footerGradientEnd" className="text-sm">
                          Gradient End
                        </Label>
                        <div className="flex gap-2 items-center">
                          <Input
                            id="footerGradientEnd"
                            type="color"
                            value={footerGradientEnd}
                            onChange={(e) => setFooterGradientEnd(e.target.value)}
                            className="w-20 h-10 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={footerGradientEnd}
                            onChange={(e) => setFooterGradientEnd(e.target.value)}
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
                          background: `linear-gradient(to right, ${footerGradientStart}, ${footerGradientEnd})`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <Input
                        id="footerBgColor"
                        type="color"
                        value={footerBgColor}
                        onChange={(e) => setFooterBgColor(e.target.value)}
                        className="w-20 h-10 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={footerBgColor}
                        onChange={(e) => setFooterBgColor(e.target.value)}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                    {/* Solid Color Preview */}
                    <div className="space-y-2">
                      <Label className="text-sm">Preview</Label>
                      <div
                        className="h-12 rounded-lg border"
                        style={{ backgroundColor: footerBgColor }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Text Color */}
              <div className="space-y-2">
                <Label htmlFor="footerTextColor">Footer Text Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="footerTextColor"
                    type="color"
                    value={footerTextColor}
                    onChange={(e) => setFooterTextColor(e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={footerTextColor}
                    onChange={(e) => setFooterTextColor(e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </>
          )}

          {!useSeparateFooterColor && (
            <p className="text-sm text-muted-foreground">
              Footer will use the same colors as the header
            </p>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};
