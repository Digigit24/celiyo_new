// src/components/opd-settings/GeneralSettingsTab.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Save, RefreshCw } from 'lucide-react';

export const GeneralSettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General OPD Settings</CardTitle>
          <CardDescription>
            Configure general settings for the OPD module
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="clinic-name">Clinic Name</Label>
              <Input
                id="clinic-name"
                placeholder="Enter clinic name"
                defaultValue="General OPD"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="visit-prefix">Visit ID Prefix</Label>
              <Input
                id="visit-prefix"
                placeholder="e.g., OPD-"
                defaultValue="OPD-"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="default-duration">Default Consultation Duration (minutes)</Label>
              <Input
                id="default-duration"
                type="number"
                placeholder="30"
                defaultValue="30"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-assign">Auto-assign Doctor</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically assign visits to available doctors
                </p>
              </div>
              <Switch id="auto-assign" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-appointment">Require Appointment</Label>
                <p className="text-sm text-muted-foreground">
                  Require patients to have an appointment before visit
                </p>
              </div>
              <Switch id="require-appointment" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable-vitals">Enable Vital Signs</Label>
                <p className="text-sm text-muted-foreground">
                  Record vital signs during patient visits
                </p>
              </div>
              <Switch id="enable-vitals" defaultChecked />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
          <CardDescription>
            Configure OPD working hours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                defaultValue="09:00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                defaultValue="17:00"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekend-hours">Enable Weekend Hours</Label>
              <p className="text-sm text-muted-foreground">
                Keep OPD open on weekends
              </p>
            </div>
            <Switch id="weekend-hours" />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
