// src/routes.tsx
import { RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load components for better code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Inbox = lazy(() => import('./pages/Inbox'));
const OPD = lazy(() => import('./pages/OPD'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Masters
const DoctorsListPage = lazy(() => import('./pages/masters/DoctorsListPage'));
const SpecialtiesListPage = lazy(() => import('./pages/masters/SpecialtyListPage'));
const PatientsListPage = lazy(() => import('./pages/masters/Patientslistpage'));
const AppointmentsListPage = lazy(() => import('./pages/masters/AppointmentsListPage'));

// Services
const ServicesListPage = lazy(() => import('./pages/services/ServicesListPage'));
const ServiceCategoriesListPage = lazy(() => import('./pages/services/ServiceCategoriesListPage'));
const DiagnosticTestsListPage = lazy(() => import('./pages/services/DiagnosticTestsListPage'));
const NursingPackagesListPage = lazy(() => import('./pages/services/NursingPackagesListPage'));
const HomeHealthcareListPage = lazy(() => import('./pages/services/HomeHealthcareListPage'));
const TenantsListPage = lazy(() => import('./pages/tenants/TenantsListPage'));
const TenantDashboardPage = lazy(() => import('./pages/tenants/TenantDashboardPage'));
const PaymentsListPage = lazy(() => import('./pages/payments/PaymentsListPage'));

// Pharmacy
const PharmacyMainPage = lazy(() => import('./pages/pharmacy/PharmacyMainPage'));

// OPD
const OpdVisitsListPage = lazy(() => import('./pages/opd/OpdVisitsListPage'));
const OpdBillsListPage = lazy(() => import('./pages/opd/OpdBillsListPage'));
const ClinicalNotesListPage = lazy(() => import('./pages/opd/ClinicalNotesListPage'));
const VisitFindingsListPage = lazy(() => import('./pages/opd/VisitFindingsListPage'));
const ProcedureMastersListPage = lazy(() => import('./pages/opd/ProcedureMastersListPage'));
const ProcedurePackagesListPage = lazy(() => import('./pages/opd/ProcedurePackagesListPage'));
const ProcedureBillsListPage = lazy(() => import('./pages/opd/ProcedureBillsListPage'));
const Consultation = lazy(() => import('./pages/Consultation'));
const OPDBilling = lazy(() => import('./pages/OPDBilling'));

// NEW: Consultation Page (Frontend-only demo)
const ConsultationPage = lazy(() => import('./pages/ConsultationPage'));

// WhatsApp
const WhatsAppContactsPage = lazy(() => import('./pages/whatsapp/ContactsPage'));
const WhatsAppChatsPage = lazy(() => import('./pages/whatsapp/ChatsPage'));
const WhatsAppGroupsPage = lazy(() => import('./pages/whatsapp/GroupsPage'));
const WhatsAppTemplatesPage = lazy(() => import('./pages/whatsapp/TemplatesPage'));
const WhatsAppCampaignsPage = lazy(() => import('./pages/whatsapp/CampaignsPage'));

// CRM
const CRMLeadsPage = lazy(() => import('./pages/crm/LeadsPage'));
const CRMActivitiesPage = lazy(() => import('./pages/crm/ActivitiesPage'));
const CRMStatusesPage = lazy(() => import('./pages/crm/StatusesPage'));
const CRMPipelinePage = lazy(() => import('./pages/crm/PipelinePage'));
const CRMTasksPage = lazy(() => import('./pages/crm/TasksPage'));

// HMS Pages
const HMSDoctorsPage = lazy(() => import('./pages/hms/DoctorsPage'));
const HMSPatientsPage = lazy(() => import('./pages/hms/PatientsPage'));
const HMSAppointmentsPage = lazy(() => import('./pages/hms/AppointmentsPage'));
const HMSPharmacyPage = lazy(() => import('./pages/hms/PharmacyPage'));
const HMSPaymentsPage = lazy(() => import('./pages/hms/PaymentsPage'));
const HMSServicesPage = lazy(() => import('./pages/hms/ServicesPage'));
const HMSTenantsPage = lazy(() => import('./pages/hms/TenantsPage'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Wrapper for lazy loaded components
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

// Route configuration
export interface AppRoute {
  path: string;
  element?: React.ReactNode;
  children?: AppRoute[];
  requiresAuth?: boolean;
  title?: string;
  icon?: string;
}

// Public routes (no authentication required)
export const publicRoutes: AppRoute[] = [
  {
    path: '/login',
    element: (
      <LazyWrapper>
        <Login />
      </LazyWrapper>
    ),
    title: 'Login',
  },
];

// Protected routes (authentication required)
export const protectedRoutes: AppRoute[] = [
  {
    path: '/',
    element: (
      <LazyWrapper>
        <Dashboard />
      </LazyWrapper>
    ),
    title: 'Dashboard',
    icon: 'LayoutDashboard',
  },
  {
    path: '/inbox',
    element: (
      <LazyWrapper>
        <Inbox />
      </LazyWrapper>
    ),
    title: 'Inbox',
    icon: 'Inbox',
  },

  // ==================== WHATSAPP ROUTES ====================
  {
    path: '/whatsapp',
    title: 'WhatsApp',
    icon: 'MessageCircle',
    children: [
      {
        path: '/whatsapp/contacts',
        element: (
          <LazyWrapper>
            <WhatsAppContactsPage />
          </LazyWrapper>
        ),
        title: 'Contacts',
      },
      {
        path: '/whatsapp/chats',
        element: (
          <LazyWrapper>
            <WhatsAppChatsPage />
          </LazyWrapper>
        ),
        title: 'Chats',
      },
      {
        path: '/whatsapp/groups',
        element: (
          <LazyWrapper>
            <WhatsAppGroupsPage />
          </LazyWrapper>
        ),
        title: 'Groups',
      },
      {
        path: '/whatsapp/templates',
        element: (
          <LazyWrapper>
            <WhatsAppTemplatesPage />
          </LazyWrapper>
        ),
        title: 'Templates',
      },
      {
        path: '/whatsapp/campaigns',
        element: (
          <LazyWrapper>
            <WhatsAppCampaignsPage />
          </LazyWrapper>
        ),
        title: 'Campaigns',
      },
    ],
  },

  // ==================== CRM ROUTES ====================
  {
    path: '/crm',
    title: 'CRM',
    icon: 'Building2',
    children: [
      {
        path: '/crm/leads',
        element: (
          <LazyWrapper>
            <CRMLeadsPage />
          </LazyWrapper>
        ),
        title: 'Leads',
      },
      {
        path: '/crm/activities',
        element: (
          <LazyWrapper>
            <CRMActivitiesPage />
          </LazyWrapper>
        ),
        title: 'Activities',
      },
      {
        path: '/crm/statuses',
        element: (
          <LazyWrapper>
            <CRMStatusesPage />
          </LazyWrapper>
        ),
        title: 'Lead Statuses',
      },
      {
        path: '/crm/pipeline',
        element: (
          <LazyWrapper>
            <CRMPipelinePage />
          </LazyWrapper>
        ),
        title: 'Pipeline',
      },
      {
        path: '/crm/tasks',
        element: (
          <LazyWrapper>
            <CRMTasksPage />
          </LazyWrapper>
        ),
        title: 'Tasks',
      },
    ],
  },

  // ==================== HMS ROUTES ====================
  {
    path: '/hms',
    title: 'HMS',
    icon: 'Stethoscope',
    children: [
      {
        path: '/hms/doctors',
        element: (
          <LazyWrapper>
            <HMSDoctorsPage />
          </LazyWrapper>
        ),
        title: 'Doctors',
      },
      {
        path: '/hms/patients',
        element: (
          <LazyWrapper>
            <HMSPatientsPage />
          </LazyWrapper>
        ),
        title: 'Patients',
      },
      {
        path: '/hms/appointments',
        element: (
          <LazyWrapper>
            <HMSAppointmentsPage />
          </LazyWrapper>
        ),
        title: 'Appointments',
      },
      {
        path: '/hms/opd',
        element: (
          <LazyWrapper>
            <OPD />
          </LazyWrapper>
        ),
        title: 'OPD',
      },
      {
        path: '/hms/pharmacy',
        element: (
          <LazyWrapper>
            <HMSPharmacyPage />
          </LazyWrapper>
        ),
        title: 'Pharmacy',
      },
      {
        path: '/hms/payments',
        element: (
          <LazyWrapper>
            <HMSPaymentsPage />
          </LazyWrapper>
        ),
        title: 'Payments',
      },
      {
        path: '/hms/services',
        element: (
          <LazyWrapper>
            <HMSServicesPage />
          </LazyWrapper>
        ),
        title: 'Services',
      },
      {
        path: '/hms/tenants',
        element: (
          <LazyWrapper>
            <HMSTenantsPage />
          </LazyWrapper>
        ),
        title: 'Tenants',
      },
    ],
  },

  // ==================== OPD ROUTES ====================
  {
    path: '/opd',
    element: (
      <LazyWrapper>
        <OPD />
      </LazyWrapper>
    ),
    title: 'OPD',
    icon: 'Stethoscope',
    children: [
      {
        path: '/opd/visits',
        element: (
          <LazyWrapper>
            <OpdVisitsListPage />
          </LazyWrapper>
        ),
        title: 'OPD Visits',
      },
      {
        path: '/opd/bills',
        element: (
          <LazyWrapper>
            <OpdBillsListPage />
          </LazyWrapper>
        ),
        title: 'OPD Bills',
      },
      {
        path: '/opd/clinical-notes',
        element: (
          <LazyWrapper>
            <ClinicalNotesListPage initialFilters={{}} onApply={() => {}} />
          </LazyWrapper>
        ),
        title: 'Clinical Notes',
      },
      {
        path: '/opd/findings',
        element: (
          <LazyWrapper>
            <VisitFindingsListPage />
          </LazyWrapper>
        ),
        title: 'Visit Findings',
      },
      {
        path: '/opd/procedures',
        element: (
          <LazyWrapper>
            <ProcedureMastersListPage />
          </LazyWrapper>
        ),
        title: 'Procedures',
      },
      {
        path: '/opd/packages',
        element: (
          <LazyWrapper>
            <ProcedurePackagesListPage />
          </LazyWrapper>
        ),
        title: 'Procedure Packages',
      },
      {
        path: '/opd/procedure-bills',
        element: (
          <LazyWrapper>
            <ProcedureBillsListPage />
          </LazyWrapper>
        ),
        title: 'Procedure Bills',
      },
    ],
  },
  {
    path: '/consultation/:visitId',
    element: (
      <LazyWrapper>
        <Consultation />
      </LazyWrapper>
    ),
    title: 'Consultation',
  },
  // NEW: Frontend-only consultation demo route
  {
    path: '/consultation-demo',
    element: (
      <LazyWrapper>
        <ConsultationPage />
      </LazyWrapper>
    ),
    title: 'Consultation Demo',
  },
  {
    path: '/opdbilling/:visitId',
    element: (
      <LazyWrapper>
        <OPDBilling />
      </LazyWrapper>
    ),
    title: 'OPD Billing',
  },

  // ==================== MASTERS ROUTES ====================
  {
    path: '/masters',
    title: 'Masters',
    icon: 'Database',
    children: [
      {
        path: '/masters/doctors',
        element: (
          <LazyWrapper>
            <DoctorsListPage />
          </LazyWrapper>
        ),
        title: 'Doctors',
      },
      {
        path: '/masters/specialties',
        element: (
          <LazyWrapper>
            <SpecialtiesListPage />
          </LazyWrapper>
        ),
        title: 'Specialties',
      },
      {
        path: '/masters/patients',
        element: (
          <LazyWrapper>
            <PatientsListPage />
          </LazyWrapper>
        ),
        title: 'Patients',
      },
      {
        path: '/masters/appointments',
        element: (
          <LazyWrapper>
            <AppointmentsListPage />
          </LazyWrapper>
        ),
        title: 'Appointments',
      },
    ],
  },

  // ==================== SERVICES ROUTES ====================
  {
    path: '/services',
    title: 'Services',
    icon: 'ClipboardList',
    children: [
      {
        path: '/services',
        element: (
          <LazyWrapper>
            <ServicesListPage />
          </LazyWrapper>
        ),
        title: 'All Services (Test)',
      },
      {
        path: '/services/categories',
        element: (
          <LazyWrapper>
            <ServiceCategoriesListPage />
          </LazyWrapper>
        ),
        title: 'Service Categories',
      },
      {
        path: '/services/diagnostic-tests',
        element: (
          <LazyWrapper>
            <DiagnosticTestsListPage />
          </LazyWrapper>
        ),
        title: 'Diagnostic Tests',
      },
      {
        path: '/services/nursing-packages',
        element: (
          <LazyWrapper>
            <NursingPackagesListPage />
          </LazyWrapper>
        ),
        title: 'Nursing Packages',
      },
      {
        path: '/services/home-healthcare',
        element: (
          <LazyWrapper>
            <HomeHealthcareListPage />
          </LazyWrapper>
        ),
        title: 'Home Healthcare',
      },
    ],
  },

  // ==================== TENANTS ROUTES ====================
  {
    path: '/tenants',
    title: 'Tenants',
    icon: 'BuildingStorefront',
    children: [
      {
        path: '/tenants',
        element: (
          <LazyWrapper>
            <TenantsListPage />
          </LazyWrapper>
        ),
        title: 'Tenant List',
      },
      {
        path: '/tenants/dashboard',
        element: (
          <LazyWrapper>
            <TenantDashboardPage />
          </LazyWrapper>
        ),
        title: 'Tenant Dashboard',
      },
    ],
  },

  // ==================== PHARMACY ROUTES ====================
  {
    path: '/pharmacy',
    element: (
      <LazyWrapper>
        <PharmacyMainPage />
      </LazyWrapper>
    ),
    title: 'Pharmacy',
    icon: 'Pill',
  },

  // ==================== PAYMENTS ROUTES ====================
  {
    path: '/payments',
    element: (
      <LazyWrapper>
        <PaymentsListPage />
      </LazyWrapper>
    ),
    title: 'Payments',
    icon: 'CreditCard',
  },
];

// 404 route
export const notFoundRoute: AppRoute = {
  path: '*',
  element: (
    <LazyWrapper>
      <NotFound />
    </LazyWrapper>
  ),
  title: 'Not Found',
};

// Helper function to flatten routes for React Router
export const flattenRoutes = (routes: AppRoute[]): RouteObject[] => {
  const flattened: RouteObject[] = [];

  routes.forEach((route) => {
    flattened.push({
      path: route.path,
      element: route.element,
    });

    if (route.children) {
      flattened.push(...flattenRoutes(route.children));
    }
  });

  return flattened;
};

// Get all protected route paths for navigation
export const getProtectedRoutePaths = (): string[] => {
  const paths: string[] = [];

  const extractPaths = (routes: AppRoute[]) => {
    routes.forEach((route) => {
      if (route.path && !route.path.includes(':')) {
        paths.push(route.path);
      }
      if (route.children) {
        extractPaths(route.children);
      }
    });
  };

  extractPaths(protectedRoutes);
  return paths;
};
