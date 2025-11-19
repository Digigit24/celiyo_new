// src/pages/opd/Findings.tsx
import React from 'react';

export const VisitFindings: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Visit Findings</h1>
        <p className="text-muted-foreground mt-2">
          Record and manage clinical findings from patient visits
        </p>
      </div>

      <div className="bg-card rounded-lg border p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold mb-2">Visit Findings Module</h2>
          <p className="text-muted-foreground">
            This page will display examination findings, diagnostic results, and clinical observations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisitFindings;
