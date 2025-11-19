// src/pages/opd/ProcedureBills.tsx
import React from 'react';

export const ProcedureBills: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Procedure Bills</h1>
        <p className="text-muted-foreground mt-2">
          Billing and invoicing for medical procedures
        </p>
      </div>

      <div className="bg-card rounded-lg border p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🧾</div>
          <h2 className="text-xl font-semibold mb-2">Procedure Bills Module</h2>
          <p className="text-muted-foreground">
            This page will display procedure-specific billing, invoices, and payment tracking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcedureBills;
