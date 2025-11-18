// src/pages/Specialties.tsx
// Simple HMS Specialty API Test - Plain Output (No UI)
import React from 'react';
import { useSpecialty } from '@/hooks/useSpecialty';

export const SpecialtiesTest: React.FC = () => {
  const { useSpecialties } = useSpecialty();

  // Fetch all specialties
  const { data: specialties, error: specialtiesError, isLoading: specialtiesLoading } = useSpecialties();

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '12px' }}>
      <h1>HMS Specialty API Test - Plain Output</h1>
      <hr />

      {/* SPECIALTIES */}
      <div style={{ marginTop: '20px' }}>
        <h2>SPECIALTIES API</h2>
        <p>Endpoint: GET /doctors/specialties/</p>
        {specialtiesLoading && <p>Loading specialties...</p>}
        {specialtiesError && (
          <div>
            <p style={{ color: 'red' }}>Error: {specialtiesError.message || 'Failed to fetch specialties'}</p>
            <pre style={{ background: '#ffe6e6', padding: '10px', overflow: 'auto', color: 'red' }}>
              {JSON.stringify(specialtiesError, null, 2)}
            </pre>
          </div>
        )}
        {specialties && (
          <div>
            <p style={{ color: 'green' }}>
              Success! Found {specialties.count} specialt{specialties.count === 1 ? 'y' : 'ies'}, showing {specialties.results.length} on this page
            </p>
            <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
              {JSON.stringify(specialties, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <hr />

      {/* API CONFIGURATION INFO */}
      <div style={{ marginTop: '20px' }}>
        <h2>API CONFIGURATION</h2>
        <p>HMS Base URL: {import.meta.env.VITE_HMS_BASE_URL || 'https://hms.celiyo.com/api'}</p>
        <p>All requests use hmsClient with automatic tenant headers and JWT auth</p>
        <p>Endpoint: /doctors/specialties/</p>
      </div>

      <hr />

      {/* SPECIALTY DETAILS */}
      <div style={{ marginTop: '20px' }}>
        <h2>SPECIALTY STRUCTURE</h2>
        <p>Each specialty object contains:</p>
        <ul style={{ marginLeft: '20px' }}>
          <li>id: number - Unique identifier</li>
          <li>name: string - Specialty name (e.g., "Cardiology")</li>
          <li>code: string - Specialty code (e.g., "CARD")</li>
          <li>description: string | null - Detailed description</li>
          <li>department: string | null - Associated department</li>
          <li>is_active: boolean - Active status</li>
          <li>doctors_count: number - Number of doctors in this specialty</li>
          <li>created_at: string - Creation timestamp</li>
          <li>updated_at: string - Last update timestamp</li>
        </ul>
      </div>

      <hr />

      {/* AVAILABLE OPERATIONS */}
      <div style={{ marginTop: '20px' }}>
        <h2>AVAILABLE OPERATIONS</h2>
        <p>The useSpecialty hook provides the following operations:</p>
        <ul style={{ marginLeft: '20px' }}>
          <li>useSpecialties(params?) - List all specialties with optional filters</li>
          <li>useSpecialtyById(id) - Get a single specialty by ID</li>
          <li>createSpecialty(data) - Create a new specialty</li>
          <li>updateSpecialty(id, data) - Full update of a specialty</li>
          <li>patchSpecialty(id, data) - Partial update of a specialty</li>
          <li>deleteSpecialty(id) - Delete a specialty</li>
        </ul>
      </div>

      <hr />

      {/* QUERY PARAMETERS */}
      <div style={{ marginTop: '20px' }}>
        <h2>AVAILABLE QUERY PARAMETERS</h2>
        <p>Filter specialties using these parameters:</p>
        <ul style={{ marginLeft: '20px' }}>
          <li>is_active: boolean - Filter by active status</li>
          <li>department: string - Filter by department</li>
          <li>search: string - Search in name, code, description</li>
          <li>ordering: string - Order results (e.g., "name", "-name", "created_at")</li>
          <li>page: number - Page number for pagination</li>
          <li>page_size: number - Number of results per page</li>
        </ul>
      </div>
    </div>
  );
};

export default SpecialtiesTest;
