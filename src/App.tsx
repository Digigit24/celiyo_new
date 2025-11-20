// src/App.tsx
import { useState } from "react";
import { SWRConfig } from "swr";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UniversalSidebar } from "@/components/UniversalSidebar";
import { UniversalHeader } from "@/components/UniversalHeader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { swrConfig } from "@/lib/swrConfig";
import { authService } from "@/services/authService";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inbox from "./pages/Inbox";
import NotFound from "./pages/NotFound";
import { CRMLeads } from "./pages/CRMLeads";
import { CRMActivities } from "./pages/CRMActivities"; // ⬅️ ADDED
import { CRMLeadStatuses } from "./pages/CRMLeadStatuses";
import { CRMTasks } from "./pages/CRMTasks";
import { Doctors } from "./pages/Doctors";
import DoctorTest from "./pages/doctor";
import { Specialties } from "./pages/Specialties";
import PatientsTest from "./pages/Patients";
import AppointmentsTest from "./pages/Appointments";
import  Contacts from "./pages/Contacts";
import Chats from "./pages/Chats";
import Groups from "./pages/Groups";
import Templates from "./pages/Templates";
import Campaigns from "./pages/Campaigns";
import { useWhatsappSocket } from "@/hooks/whatsapp/useWhatsappSocket";
import OPDVisits from "./pages/OPDVisits";  // ✅ Updated to new production page
import OPDBills from "./pages/opd/Bills";
import ClinicalNotes from "./pages/opd/ClinicalNotes";
import VisitFindings from "./pages/opd/Findings";
import ProcedureMasters from "./pages/opd/Procedures";
import ProcedurePackages from "./pages/opd/Packages";
import ProcedureBills from "./pages/opd/ProcedureBills";

const queryClient = new QueryClient();

const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const isMobile = useIsMobile();
  // Ensure WhatsApp socket stays connected app-wide (persists across route changes)
  useWhatsappSocket();
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Universal Sidebar */}
      {!isMobile && (
        <UniversalSidebar
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed((v) => !v)}
        />
      )}
      {isMobile && (
        <UniversalSidebar
          collapsed={false}
          onCollapse={() => {}}
          mobileOpen={sidebarMobileOpen}
          setMobileOpen={setSidebarMobileOpen}
        />
      )}

      {/* Main Content Area with Header */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Universal Header */}
        <UniversalHeader />
        
        {/* Page Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/opd" element={<OPDVisits />} />  {/* ✅ Updated to show new OPD Visits page */}
            
            {/* CRM Routes */}
            <Route path="/crm" element={<CRMLeads />} />
            <Route path="/crm/leads" element={<CRMLeads />} />
            <Route path="/crm/activities" element={<CRMActivities />} /> {/* ⬅️ ADDED */}
            <Route path="/crm/statuses" element={<CRMLeadStatuses />} />
            <Route path="/crm/tasks" element={<CRMTasks />} />

            {/* HMS Routes */}
            <Route path="/hms/doctors" element={<Doctors />} />
            <Route path="/hms/specialties" element={<Specialties />} />
            <Route path="/doctor" element={<DoctorTest />} />
            <Route path="/specialties" element={<Specialties />} />
            <Route path="/patients" element={<PatientsTest />} />
            <Route path="/appointments" element={<AppointmentsTest />} />

            {/* OPD Routes */}
            <Route path="/opd/visits" element={<OPDVisits />} />
            <Route path="/opd/bills" element={<OPDBills />} />
            <Route path="/opd/clinical-notes" element={<ClinicalNotes />} />
            <Route path="/opd/findings" element={<VisitFindings />} />
            <Route path="/opd/procedures" element={<ProcedureMasters />} />
            <Route path="/opd/packages" element={<ProcedurePackages />} />
            <Route path="/opd/procedure-bills" element={<ProcedureBills />} />

            {/* WhatsApp Routes */}
            <Route path="/whatsapp/contacts" element={<Contacts />} />
            <Route path="/whatsapp/chats" element={<Chats />} />
            <Route path="/whatsapp/groups" element={<Groups />} />
            <Route path="/whatsapp/templates" element={<Templates />} />
            <Route path="/whatsapp/campaigns" element={<Campaigns />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <SWRConfig value={swrConfig}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={
                  isAuthenticated ? <Navigate to="/" replace /> : <Login />
                } 
              />
              

              {/* Protected Routes */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </SWRConfig>
  );
};

export default App;