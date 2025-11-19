// src/pages/opd/Procedures.tsx
import React from 'react';

export const ProcedureMasters: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Procedures</h1>
        <p className="text-muted-foreground mt-2">
          Manage medical procedures and treatment catalog
        </p>
      </div>

      <div className="bg-card rounded-lg border p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🔬</div>
          <h2 className="text-xl font-semibold mb-2">Procedures Module</h2>
          <p className="text-muted-foreground">
            This page will display available medical procedures, their descriptions, and pricing information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcedureMasters;
