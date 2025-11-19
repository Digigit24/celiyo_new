// src/pages/opd/Bills.tsx
import React from 'react';

export const OPDBills: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">OPD Bills</h1>
        <p className="text-muted-foreground mt-2">
          Manage outpatient billing and payment records
        </p>
      </div>

      <div className="bg-card rounded-lg border p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">💰</div>
          <h2 className="text-xl font-semibold mb-2">OPD Bills Module</h2>
          <p className="text-muted-foreground">
            This page will display billing records, payment status, and invoice generation for OPD services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OPDBills;
