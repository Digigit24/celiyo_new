// src/components/OPDBillFormDrawer.tsx
import React from 'react';
import { SideDrawer } from '@/components/SideDrawer';
import { DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface OPDBillFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  billId?: number | null;
  onSuccess?: () => void;
}

export const OPDBillFormDrawer: React.FC<OPDBillFormDrawerProps> = ({
  isOpen,
  onClose,
  mode,
  billId,
  onSuccess,
}) => {
  const getTitle = () => {
    if (mode === 'create') return 'Create OPD Bill';
    if (mode === 'edit') return 'Edit OPD Bill';
    return 'OPD Bill Details';
  };

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      subtitle="OPD billing and payment tracking"
      icon={DollarSign}
    >
      <div className="space-y-4">
        <div className="bg-muted p-6 rounded-lg text-center">
          <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">OPD Bill Form</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Full form with multi-item billing, visit selection, patient info, and payment processing will be implemented here.
          </p>
          <p className="text-xs text-muted-foreground">
            Features: Visit/patient selection, bill items, discounts, taxes, payment modes, and receipt generation.
          </p>
        </div>
      </div>
    </SideDrawer>
  );
};
