// src/pages/OPDSettings.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings2, FileText, Microscope, ListChecks, ClipboardList } from 'lucide-react';
import { GeneralSettingsTab } from '@/components/opd-settings/GeneralSettingsTab';
import { BillingSettingsTab } from '@/components/opd-settings/BillingSettingsTab';
import { ProcedureSettingsTab } from '@/components/opd-settings/ProcedureSettingsTab';
import { FieldConfigurationTab } from '@/components/opd-settings/FieldConfigurationTab';
import { ClinicalSettingsTab } from '@/components/opd-settings/ClinicalSettingsTab';

type SettingsTab = 'general' | 'billing' | 'procedures' | 'fields' | 'clinical';

export const OPDSettings: React.FC = () => {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();

  const activeTab = (tab as SettingsTab) || 'general';

  const handleTabChange = (newTab: string) => {
    navigate(`/opd/settings/${newTab}`, { replace: true });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Settings2 className="h-6 w-6" />
          <h1 className="text-3xl font-bold">OPD Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Configure and manage your OPD module settings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger
            value="general"
            className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <Settings2 className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger
            value="procedures"
            className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <Microscope className="h-4 w-4" />
            <span className="hidden sm:inline">Procedures</span>
          </TabsTrigger>
          <TabsTrigger
            value="clinical"
            className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Clinical</span>
          </TabsTrigger>
          <TabsTrigger
            value="fields"
            className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            <ListChecks className="h-4 w-4" />
            <span className="hidden sm:inline">Fields</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <GeneralSettingsTab />
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <BillingSettingsTab />
        </TabsContent>

        <TabsContent value="procedures" className="space-y-4">
          <ProcedureSettingsTab />
        </TabsContent>

        <TabsContent value="clinical" className="space-y-4">
          <ClinicalSettingsTab />
        </TabsContent>

        <TabsContent value="fields" className="space-y-4">
          <FieldConfigurationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
