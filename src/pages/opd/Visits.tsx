// src/pages/opd/Visits.tsx
import React from 'react';

export const OPDVisits: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">OPD Visits</h1>
        <p className="text-muted-foreground mt-2">
          Manage outpatient department visits and consultations
        </p>
      </div>

      <div className="bg-card rounded-lg border p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🏥</div>
          <h2 className="text-xl font-semibold mb-2">OPD Visits Module</h2>
          <p className="text-muted-foreground">
            This page will display patient visits, consultation records, and visit management features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OPDVisits;
