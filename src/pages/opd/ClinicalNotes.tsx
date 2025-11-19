// src/pages/opd/ClinicalNotes.tsx
import React from 'react';

export const ClinicalNotes: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Clinical Notes</h1>
        <p className="text-muted-foreground mt-2">
          Medical records and clinical documentation for patient visits
        </p>
      </div>

      <div className="bg-card rounded-lg border p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold mb-2">Clinical Notes Module</h2>
          <p className="text-muted-foreground">
            This page will display patient clinical notes, medical history, and doctor's observations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClinicalNotes;
