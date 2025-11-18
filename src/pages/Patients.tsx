// src/pages/Patients.tsx
// Simple HMS Patient API Test - Plain Output (No UI)
import React from 'react';
import { usePatient } from '@/hooks/usePatient';

export const PatientsTest: React.FC = () => {
  const { usePatients, usePatientStatistics } = usePatient();

  // Fetch all patients and statistics
  const { data: patients, error: patientsError, isLoading: patientsLoading } = usePatients();
  const { data: statistics, error: statisticsError, isLoading: statisticsLoading } = usePatientStatistics();

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '12px' }}>
      <h1>HMS Patient API Test - Plain Output</h1>
      <hr />

      {/* PATIENT STATISTICS */}
      <div style={{ marginTop: '20px' }}>
        <h2>PATIENT STATISTICS API</h2>
        <p>Endpoint: GET /patients/profiles/statistics/</p>
        {statisticsLoading && <p>Loading statistics...</p>}
        {statisticsError && (
          <div>
            <p style={{ color: 'red' }}>Error: {statisticsError.message || 'Failed to fetch statistics'}</p>
            <pre style={{ background: '#ffe6e6', padding: '10px', overflow: 'auto', color: 'red' }}>
              {JSON.stringify(statisticsError, null, 2)}
            </pre>
          </div>
        )}
        {statistics && (
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(statistics, null, 2)}
          </pre>
        )}
      </div>

      <hr />

      {/* PATIENTS */}
      <div style={{ marginTop: '20px' }}>
        <h2>PATIENTS API</h2>
        <p>Endpoint: GET /patients/profiles/</p>
        {patientsLoading && <p>Loading patients...</p>}
        {patientsError && (
          <div>
            <p style={{ color: 'red' }}>Error: {patientsError.message || 'Failed to fetch patients'}</p>
            <pre style={{ background: '#ffe6e6', padding: '10px', overflow: 'auto', color: 'red' }}>
              {JSON.stringify(patientsError, null, 2)}
            </pre>
          </div>
        )}
        {patients && (
          <div>
            <p style={{ color: 'green' }}>
              Success! Found {patients.count} patient(s), showing {patients.results.length} on this page
            </p>
            <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
              {JSON.stringify(patients, null, 2)}
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
        <p>Endpoint: /patients/profiles/</p>
      </div>

      <hr />

      {/* PATIENT DETAILS */}
      <div style={{ marginTop: '20px' }}>
        <h2>PATIENT STRUCTURE</h2>
        <p>Each patient object contains:</p>
        <ul style={{ marginLeft: '20px' }}>
          <li>id: number - Unique identifier</li>
          <li>user: User - User account details (id, username, email, first_name, last_name)</li>
          <li>full_name: string - Patient's full name</li>
          <li>date_of_birth: string - Date of birth</li>
          <li>gender: 'male' | 'female' | 'other' - Gender</li>
          <li>phone: string - Contact phone</li>
          <li>email: string - Email address</li>
          <li>address: string - Physical address</li>
          <li>city: string - City</li>
          <li>state: string - State</li>
          <li>pincode: string - Postal code</li>
          <li>emergency_contact_name: string - Emergency contact name</li>
          <li>emergency_contact_phone: string - Emergency contact phone</li>
          <li>blood_group: string - Blood group (e.g., "A+", "O-")</li>
          <li>allergies: string - Known allergies</li>
          <li>medical_history: string - Medical history notes</li>
          <li>is_active: boolean - Active status</li>
          <li>registration_date: string - Registration date</li>
          <li>last_visit_date: string - Last visit date</li>
          <li>total_visits: number - Total number of visits</li>
          <li>created_at: string - Creation timestamp</li>
          <li>updated_at: string - Last update timestamp</li>
        </ul>
      </div>

      <hr />

      {/* AVAILABLE OPERATIONS */}
      <div style={{ marginTop: '20px' }}>
        <h2>AVAILABLE OPERATIONS</h2>
        <p>The usePatient hook provides the following operations:</p>
        <ul style={{ marginLeft: '20px' }}>
          <li>usePatients(params?) - List all patients with optional filters</li>
          <li>usePatientById(id) - Get a single patient by ID</li>
          <li>usePatientStatistics() - Get patient statistics</li>
          <li>createPatient(data) - Create a new patient</li>
          <li>registerPatient(data) - Register a new patient (alternative endpoint)</li>
          <li>updatePatient(id, data) - Full update of a patient</li>
          <li>patchPatient(id, data) - Partial update of a patient</li>
          <li>deletePatient(id) - Delete a patient</li>
        </ul>
      </div>

      <hr />

      {/* QUERY PARAMETERS */}
      <div style={{ marginTop: '20px' }}>
        <h2>AVAILABLE QUERY PARAMETERS</h2>
        <p>Filter patients using these parameters:</p>
        <ul style={{ marginLeft: '20px' }}>
          <li>gender: 'male' | 'female' | 'other' - Filter by gender</li>
          <li>blood_group: string - Filter by blood group</li>
          <li>is_active: boolean - Filter by active status</li>
          <li>city: string - Filter by city</li>
          <li>search: string - Search in name, email, phone</li>
          <li>ordering: string - Order results (e.g., "full_name", "-registration_date")</li>
          <li>page: number - Page number for pagination</li>
          <li>page_size: number - Number of results per page</li>
        </ul>
      </div>
    </div>
  );
};

export default PatientsTest;
