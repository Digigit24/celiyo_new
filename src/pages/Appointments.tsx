// src/pages/Appointments.tsx
// Simple HMS Appointment API Test - Plain Output (No UI)
import React from 'react';
import { useAppointment } from '@/hooks/useAppointment';

export const AppointmentsTest: React.FC = () => {
  const { useAppointments, useUpcomingAppointments, useAppointmentStatistics } = useAppointment();

  // Fetch appointments, upcoming, and statistics
  const { data: appointments, error: appointmentsError, isLoading: appointmentsLoading } = useAppointments();
  const { data: upcoming, error: upcomingError, isLoading: upcomingLoading } = useUpcomingAppointments();
  const { data: statistics, error: statisticsError, isLoading: statisticsLoading } = useAppointmentStatistics();

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '12px' }}>
      <h1>HMS Appointment API Test - Plain Output</h1>
      <hr />

      {/* APPOINTMENT STATISTICS */}
      <div style={{ marginTop: '20px' }}>
        <h2>APPOINTMENT STATISTICS API</h2>
        <p>Endpoint: GET /appointments/statistics/</p>
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

      {/* UPCOMING APPOINTMENTS */}
      <div style={{ marginTop: '20px' }}>
        <h2>UPCOMING APPOINTMENTS API</h2>
        <p>Endpoint: GET /appointments/upcoming/</p>
        {upcomingLoading && <p>Loading upcoming appointments...</p>}
        {upcomingError && (
          <div>
            <p style={{ color: 'red' }}>Error: {upcomingError.message || 'Failed to fetch upcoming appointments'}</p>
            <pre style={{ background: '#ffe6e6', padding: '10px', overflow: 'auto', color: 'red' }}>
              {JSON.stringify(upcomingError, null, 2)}
            </pre>
          </div>
        )}
        {upcoming && (
          <div>
            <p style={{ color: 'green' }}>
              Success! Found {upcoming.count} upcoming appointment(s), showing {upcoming.results.length} on this page
            </p>
            <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
              {JSON.stringify(upcoming, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <hr />

      {/* ALL APPOINTMENTS */}
      <div style={{ marginTop: '20px' }}>
        <h2>ALL APPOINTMENTS API</h2>
        <p>Endpoint: GET /appointments/</p>
        {appointmentsLoading && <p>Loading appointments...</p>}
        {appointmentsError && (
          <div>
            <p style={{ color: 'red' }}>Error: {appointmentsError.message || 'Failed to fetch appointments'}</p>
            <pre style={{ background: '#ffe6e6', padding: '10px', overflow: 'auto', color: 'red' }}>
              {JSON.stringify(appointmentsError, null, 2)}
            </pre>
          </div>
        )}
        {appointments && (
          <div>
            <p style={{ color: 'green' }}>
              Success! Found {appointments.count} appointment(s), showing {appointments.results.length} on this page
            </p>
            <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
              {JSON.stringify(appointments, null, 2)}
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
        <p>Main Endpoint: /appointments/</p>
      </div>

      <hr />

      {/* APPOINTMENT DETAILS */}
      <div style={{ marginTop: '20px' }}>
        <h2>APPOINTMENT STRUCTURE</h2>
        <p>Each appointment object contains:</p>
        <ul style={{ marginLeft: '20px' }}>
          <li>id: number - Unique identifier</li>
          <li>appointment_number: string - Appointment reference number</li>
          <li>doctor: Doctor - Doctor details (id, full_name, specialties, consultation_fee)</li>
          <li>patient: Patient - Patient details (id, full_name, phone, email, etc.)</li>
          <li>appointment_date: string - Date of appointment</li>
          <li>appointment_time: string - Time of appointment</li>
          <li>duration_minutes: number - Duration in minutes</li>
          <li>appointment_type: 'consultation' | 'follow_up' | 'emergency' | 'routine_checkup'</li>
          <li>status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'</li>
          <li>consultation_mode: 'online' | 'offline'</li>
          <li>reason_for_visit: string - Reason for the visit</li>
          <li>symptoms: string - Patient symptoms</li>
          <li>diagnosis: string - Doctor's diagnosis</li>
          <li>prescription: string - Prescribed medication/treatment</li>
          <li>notes: string - Additional notes</li>
          <li>fee_amount: string - Consultation fee</li>
          <li>payment_status: 'pending' | 'paid' | 'partially_paid' | 'refunded'</li>
          <li>cancellation_reason: string - Reason for cancellation (if cancelled)</li>
          <li>cancelled_by: string - Who cancelled the appointment</li>
          <li>cancelled_at: string - Cancellation timestamp</li>
          <li>is_follow_up: boolean - Is this a follow-up appointment</li>
          <li>parent_appointment_id: number - ID of parent appointment (if follow-up)</li>
          <li>created_at: string - Creation timestamp</li>
          <li>updated_at: string - Last update timestamp</li>
        </ul>
      </div>

      <hr />

      {/* AVAILABLE OPERATIONS */}
      <div style={{ marginTop: '20px' }}>
        <h2>AVAILABLE OPERATIONS</h2>
        <p>The useAppointment hook provides the following operations:</p>
        <ul style={{ marginLeft: '20px' }}>
          <li>useAppointments(params?) - List all appointments with optional filters</li>
          <li>useAppointmentById(id) - Get a single appointment by ID</li>
          <li>useAppointmentsByDoctor(doctorId, params?) - Get appointments by doctor</li>
          <li>useAppointmentsByPatient(patientId, params?) - Get appointments by patient</li>
          <li>useUpcomingAppointments(params?) - Get upcoming appointments</li>
          <li>useAppointmentStatistics() - Get appointment statistics</li>
          <li>createAppointment(data) - Create a new appointment</li>
          <li>updateAppointment(id, data) - Full update of an appointment</li>
          <li>patchAppointment(id, data) - Partial update of an appointment</li>
          <li>cancelAppointment(id, data) - Cancel an appointment</li>
          <li>completeAppointment(id, data?) - Mark appointment as completed</li>
          <li>rescheduleAppointment(id, data) - Reschedule an appointment</li>
          <li>deleteAppointment(id) - Delete an appointment</li>
        </ul>
      </div>

      <hr />

      {/* QUERY PARAMETERS */}
      <div style={{ marginTop: '20px' }}>
        <h2>AVAILABLE QUERY PARAMETERS</h2>
        <p>Filter appointments using these parameters:</p>
        <ul style={{ marginLeft: '20px' }}>
          <li>doctor_id: number - Filter by doctor ID</li>
          <li>patient_id: number - Filter by patient ID</li>
          <li>appointment_date: string - Filter by appointment date</li>
          <li>appointment_type: 'consultation' | 'follow_up' | 'emergency' | 'routine_checkup'</li>
          <li>status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'</li>
          <li>consultation_mode: 'online' | 'offline'</li>
          <li>payment_status: 'pending' | 'paid' | 'partially_paid' | 'refunded'</li>
          <li>search: string - Search in appointment number, patient name, doctor name</li>
          <li>ordering: string - Order results (e.g., "appointment_date", "-created_at")</li>
          <li>page: number - Page number for pagination</li>
          <li>page_size: number - Number of results per page</li>
        </ul>
      </div>

      <hr />

      {/* SPECIAL ENDPOINTS */}
      <div style={{ marginTop: '20px' }}>
        <h2>SPECIAL ENDPOINTS</h2>
        <ul style={{ marginLeft: '20px' }}>
          <li>GET /appointments/by-doctor/:doctor_id/ - Get appointments for a specific doctor</li>
          <li>GET /appointments/by-patient/:patient_id/ - Get appointments for a specific patient</li>
          <li>GET /appointments/upcoming/ - Get all upcoming appointments</li>
          <li>POST /appointments/:id/cancel/ - Cancel an appointment</li>
          <li>POST /appointments/:id/complete/ - Mark appointment as completed</li>
          <li>POST /appointments/:id/reschedule/ - Reschedule an appointment</li>
        </ul>
      </div>
    </div>
  );
};

export default AppointmentsTest;
