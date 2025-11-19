// src/pages/opd/Packages.tsx
import React from 'react';

export const ProcedurePackages: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Packages</h1>
        <p className="text-muted-foreground mt-2">
          Manage procedure packages and bundled services
        </p>
      </div>

      <div className="bg-card rounded-lg border p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-semibold mb-2">Packages Module</h2>
          <p className="text-muted-foreground">
            This page will display procedure packages, bundled services, and special offers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcedurePackages;
