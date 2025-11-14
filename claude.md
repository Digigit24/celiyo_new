# Celiyo Multi-Tenant Platform

## Project Overview

**Celiyo** is a comprehensive multi-tenant SaaS platform that combines CRM, WhatsApp Business API integration, and healthcare (OPD) management capabilities. The platform enables businesses to manage customer relationships, conduct WhatsApp marketing campaigns, and handle healthcare operations from a unified interface.

**Project Type:** Enterprise Web Application
**Architecture:** Multi-tenant SaaS with module-based access control
**Current Status:** Production-ready, deployed on Vercel

---

## Technology Stack

### Frontend
- **Framework:** React 18.3.1 with TypeScript 5.5.3
- **Build Tool:** Vite 6.3.4 with SWC for fast compilation
- **Routing:** React Router DOM 6.26.2
- **UI Library:** shadcn/ui (50+ pre-built components)
- **Headless UI:** Full Radix UI component suite
- **Styling:** Tailwind CSS 3.4.11 with custom theme
- **Icons:** Lucide React 0.462.0
- **Theming:** next-themes 0.3.0 (Dark/Light mode)

### State Management
- **Server State:** SWR 2.3.6 (Stale-While-Revalidate pattern)
- **Async Queries:** TanStack React Query 5.56.2
- **Form State:** React Hook Form 7.53.0
- **Validation:** Zod 3.23.8

### Real-time Communication
- **WebSocket:** Native WebSocket API with custom singleton manager
- **Auto-reconnect:** Exponential backoff retry strategy
- **Heartbeat:** Ping/pong every 25 seconds

### HTTP & API
- **Client:** Axios 1.12.2 with multiple instances
- **APIs:** Auth API, CRM API, WhatsApp Business API
- **Authentication:** JWT with automatic token refresh

---

## Project Structure

```
celiyo_new/
├── src/
│   ├── auth/                    # Authentication documentation
│   ├── components/              # React components
│   │   ├── ui/                 # shadcn/ui components (50+ components)
│   │   ├── contact-drawer/     # Contact management components
│   │   ├── group-drawer/       # Group management components
│   │   ├── ChatSidebar.tsx     # WhatsApp chat sidebar
│   │   ├── ChatWindow.tsx      # WhatsApp chat interface
│   │   ├── ConversationList.tsx # Chat conversations list
│   │   ├── ContactsTable.tsx   # Contacts data table
│   │   ├── GroupsTable.tsx     # Groups data table
│   │   ├── TemplatesTable.tsx  # Templates data table
│   │   ├── CampaignsTable.tsx  # Campaigns data table
│   │   ├── DataTable.tsx       # Reusable data table component
│   │   ├── UniversalSidebar.tsx # Main app sidebar
│   │   ├── UniversalHeader.tsx # Main app header
│   │   └── ProtectedRoute.tsx  # Route protection HOC
│   ├── config/                  # Configuration files
│   │   └── mastersMenu.ts      # Navigation menu configuration
│   ├── hooks/                   # Custom React hooks
│   │   ├── whatsapp/           # WhatsApp-specific hooks
│   │   │   ├── useWhatsappSocket.ts # WebSocket management
│   │   │   ├── useContacts.ts  # Contacts CRUD operations
│   │   │   ├── useGroups.ts    # Groups CRUD operations
│   │   │   ├── useTemplates.ts # Templates management
│   │   │   ├── useCampaigns.ts # Campaign operations
│   │   │   └── useMessages.ts  # Message operations
│   │   ├── useAuth.ts          # Authentication hook
│   │   └── useCRM.ts           # CRM operations hook
│   ├── lib/                     # Utility libraries
│   │   ├── apiConfig.ts        # API endpoints & configuration
│   │   ├── client.ts           # Axios clients (Auth & CRM)
│   │   ├── whatsappClient.ts   # WhatsApp API client
│   │   ├── swrConfig.ts        # SWR configuration
│   │   └── utils.ts            # Common utilities (cn, etc.)
│   ├── pages/                   # Route pages
│   │   ├── Dashboard.tsx       # Dashboard page
│   │   ├── Login.tsx           # Login page
│   │   ├── Inbox.tsx           # Inbox page
│   │   ├── OPD.tsx             # OPD management
│   │   ├── Chats.tsx           # WhatsApp chats
│   │   ├── Contacts.tsx        # WhatsApp contacts
│   │   ├── Groups.tsx          # WhatsApp groups
│   │   ├── Templates.tsx       # WhatsApp templates
│   │   ├── Campaigns.tsx       # WhatsApp campaigns
│   │   └── CRMLeads.tsx        # CRM leads management
│   ├── services/                # API service layer
│   │   ├── whatsapp/           # WhatsApp services
│   │   │   ├── messagesService.ts
│   │   │   ├── contactsService.ts
│   │   │   ├── groupsService.ts
│   │   │   ├── templatesService.ts
│   │   │   └── campaignsService.ts
│   │   ├── authService.ts      # Authentication service
│   │   └── crmService.ts       # CRM service
│   ├── types/                   # TypeScript type definitions
│   │   ├── authTypes.ts        # Authentication types
│   │   ├── crmTypes.ts         # CRM types
│   │   ├── whatsappTypes.ts    # WhatsApp types
│   │   └── doctor.types.ts     # Healthcare types
│   ├── utils/                   # Utility functions
│   │   └── toast.ts            # Toast notification utilities
│   ├── App.tsx                  # Main app component with routes
│   ├── main.tsx                 # App entry point
│   └── globals.css             # Global styles with CSS variables
├── public/                      # Static assets
├── .env                         # Environment variables
├── AI_RULES.md                  # AI coding guidelines
├── README.md                    # Project readme
├── components.json              # shadcn/ui configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── vercel.json                 # Vercel deployment config
```

---

## Key Architecture Patterns

### Multi-Tenant Architecture
- **Tenant Isolation:** Each user belongs to a tenant with isolated data
- **Module-based Access:** Tenants have specific modules enabled (CRM, WhatsApp, OPD)
- **Header Propagation:** `X-Tenant-Id` and `tenanttoken` headers on all API requests
- **Tenant ID:** Stored in environment and localStorage, sent with every request

### Authentication Flow
- **JWT-based Authentication:** Access tokens (short-lived) + refresh tokens (long-lived)
- **Multi-API Architecture:** Separate APIs for Auth, CRM, and WhatsApp
- **Automatic Token Refresh:** Interceptors refresh tokens on 401 responses
- **Storage:** Tokens and user data persisted in localStorage with prefixed keys
- **Protected Routes:** `ProtectedRoute` component wraps authenticated pages

### Component Patterns
- **Atomic Design:** UI components from shadcn/ui, composed into feature components
- **Drawer Pattern:** Reusable drawer components for CRUD operations (Contacts, Groups, Templates)
- **Data Table Pattern:** Reusable `DataTable` component with sorting, filtering, pagination
- **Smart/Dumb Components:** Pages (smart) fetch data and pass to presentational components (dumb)

### State Management Strategy
- **Server State:** SWR for data fetching with automatic revalidation
- **Local State:** React useState/useReducer for UI state
- **Form State:** React Hook Form with Zod schema validation
- **Global State:** Context API via custom hooks (useAuth)

### API Client Pattern
Multiple Axios instances with specific configurations:

1. **authClient** (`src/lib/client.ts`)
   - Auth API: `http://127.0.0.1:8000/api`
   - No automatic token refresh (used for login/logout)

2. **crmClient** (`src/lib/client.ts`)
   - CRM API: `http://127.0.0.1:8001/api`
   - Automatic token refresh on 401
   - Bearer token + tenant headers

3. **whatsappClient** (`src/lib/whatsappClient.ts`)
   - WhatsApp API: `https://whatsapp.dglinkup.com/api`
   - Automatic token refresh on 401
   - Bearer token + tenant headers

### WebSocket Pattern
- **Singleton Instance:** Single persistent connection (`src/hooks/whatsapp/useWhatsappSocket.ts`)
- **Event-based:** Subscribe/unsubscribe pattern for components
- **Auto-reconnect:** Exponential backoff on connection loss
- **Events:** `message_incoming`, `message_outgoing`

---

## Key Features

### 1. WhatsApp Business Integration

#### Messages & Chats (`/chats`)
- Real-time message sending and receiving
- Conversation list with unread counts
- Message history per contact
- Support for text, image, video, audio, document messages
- WebSocket-based live updates

#### Contacts Management (`/contacts`)
- Full CRUD operations
- Contact search and filtering
- Labels and groups organization
- Business account detection
- Custom notes and metadata
- Bulk operations support

#### Groups Management (`/groups`)
- WhatsApp group listing
- Group participants and admins tracking
- Group invite links
- Active/inactive status management

#### Templates Management (`/templates`)
- WhatsApp Business template creation
- Template status tracking (Pending, Approved, Rejected)
- Multi-language support (English, Hindi, Spanish, etc.)
- Template categories (Marketing, Utility, Authentication)
- Dynamic components (Header, Body, Footer, Buttons)

#### Campaigns (`/campaigns`)
- Broadcast messaging to multiple recipients
- Template-based campaigns
- Campaign analytics (sent/failed counts)
- Results per recipient

### 2. CRM Module (`/crm-leads`)
- Lead management with full CRUD
- Lead status pipeline (custom statuses)
- Lead activities tracking (Calls, Emails, Meetings, Notes)
- Priority levels (Low, Medium, High)
- Lead value tracking with currency
- Address and location management
- Kanban board positioning
- Advanced filtering and search

### 3. Healthcare (OPD) Module (`/opd`)
- Doctor management
- Specialty management
- Patient tracking (placeholder)

### 4. Common Features
- Dark/Light theme support
- Responsive mobile/desktop layouts
- Toast notifications (Sonner)
- Loading states with skeletons
- Error handling with toast messages
- Data tables with sorting, filtering, pagination
- Search with debouncing

---

## API Endpoints

### Auth API (`http://127.0.0.1:8000/api`)
```
POST   /auth/login/           # User login
POST   /auth/token/refresh/   # Refresh access token
POST   /auth/token/verify/    # Verify token
POST   /auth/logout/          # User logout
```

### CRM API (`http://127.0.0.1:8001/api`)
```
GET    /crm/leads/            # List leads
POST   /crm/leads/            # Create lead
GET    /crm/leads/:id/        # Get lead detail
PUT    /crm/leads/:id/        # Update lead
DELETE /crm/leads/:id/        # Delete lead
GET    /crm/statuses/         # List statuses
POST   /crm/statuses/         # Create status
GET    /crm/activities/       # List activities
POST   /crm/activities/       # Create activity
```

### WhatsApp API (`https://whatsapp.dglinkup.com/api`)
```
# Messages
POST   /messages/send                       # Send message
GET    /messages/conversations/             # List conversations
GET    /messages/conversations/:phone       # Get conversation
DELETE /messages/conversations/:phone       # Delete conversation
GET    /messages/messages                   # Recent messages
GET    /messages/stats                      # Message stats

# Contacts
GET    /contacts/                           # List contacts
POST   /contacts/                           # Create contact
GET    /contacts/:phone/                    # Get contact
PUT    /contacts/:phone/                    # Update contact
DELETE /contacts/:phone/                    # Delete contact

# Groups
GET    /groups/                             # List groups
POST   /groups/                             # Create group
GET    /groups/:group_id                    # Get group
PUT    /groups/:group_id                    # Update group
DELETE /groups/:group_id                    # Delete group

# Templates
GET    /templates/                          # List templates
POST   /templates/                          # Create template
GET    /templates/:id                       # Get template
PUT    /templates/:id                       # Update template
DELETE /templates/:id                       # Delete template
GET    /templates/name/:template_name       # Get by name

# Campaigns
POST   /campaigns/broadcast                 # Create campaign
GET    /campaigns/                          # List campaigns
GET    /campaigns/:id                       # Get campaign
```

### WebSocket
```
WS     wss://whatsapp.dglinkup.com/ws/{tenantId}
```

---

## Important Files & Locations

### Configuration
- **API Configuration:** `src/lib/apiConfig.ts` - All API endpoints and base URLs
- **Environment:** `.env` - Tenant ID and optional API URL overrides
- **Navigation Menu:** `src/config/mastersMenu.ts` - Sidebar menu structure
- **SWR Config:** `src/lib/swrConfig.ts` - SWR default configuration

### Core Utilities
- **Class Name Utility:** `src/lib/utils.ts` - `cn()` function for className merging
- **Toast Utility:** `src/utils/toast.ts` - Toast notification helpers
- **API Clients:**
  - `src/lib/client.ts` - Auth and CRM clients
  - `src/lib/whatsappClient.ts` - WhatsApp client

### Type Definitions
- **Auth Types:** `src/types/authTypes.ts` - User, LoginRequest, AuthResponse
- **CRM Types:** `src/types/crmTypes.ts` - Lead, Activity, Status
- **WhatsApp Types:** `src/types/whatsappTypes.ts` - Message, Contact, Group, Template, Campaign

### Authentication
- **Auth Hook:** `src/hooks/useAuth.ts` - useAuth() hook with login, logout, user state
- **Auth Service:** `src/services/authService.ts` - API calls for auth operations
- **Protected Route:** `src/components/ProtectedRoute.tsx` - Route guard component
- **Auth Documentation:** `src/auth/README.md` - Comprehensive auth guide

### Routes
- **App Routes:** `src/App.tsx` - All application routes defined here
- **Pages:** `src/pages/` - One file per route

---

## Common Development Tasks

### Adding a New Page
1. Create page component in `src/pages/YourPage.tsx`
2. Add route in `src/App.tsx`:
   ```tsx
   <Route path="/your-page" element={<ProtectedRoute><YourPage /></ProtectedRoute>} />
   ```
3. Add menu item in `src/config/mastersMenu.ts` (if needed)

### Adding a New API Endpoint
1. Add endpoint to `src/lib/apiConfig.ts`:
   ```typescript
   export const API_ENDPOINTS = {
     YOUR_RESOURCE: '/your-resource',
   };
   ```
2. Create service in `src/services/yourService.ts`:
   ```typescript
   export const yourService = {
     getAll: () => whatsappClient.get(API_ENDPOINTS.YOUR_RESOURCE),
     create: (data) => whatsappClient.post(API_ENDPOINTS.YOUR_RESOURCE, data),
   };
   ```
3. Create hook in `src/hooks/useYourResource.ts`:
   ```typescript
   export const useYourResource = () => {
     const { data, error, isLoading, mutate } = useSWR(
       API_ENDPOINTS.YOUR_RESOURCE,
       () => yourService.getAll()
     );
     return { data, error, isLoading, mutate };
   };
   ```

### Adding a New shadcn/ui Component
All 50+ shadcn/ui components are already installed in `src/components/ui/`. If you need a component that's missing:

```bash
npx shadcn@latest add [component-name]
```

### Working with Forms
1. Define Zod schema:
   ```typescript
   const schema = z.object({
     name: z.string().min(1, "Required"),
     email: z.string().email(),
   });
   ```
2. Use React Hook Form:
   ```typescript
   const form = useForm({
     resolver: zodResolver(schema),
     defaultValues: { name: "", email: "" },
   });
   ```
3. Use shadcn/ui Form components for UI

### Adding Toast Notifications
```typescript
import { toast } from "sonner";

toast.success("Success message");
toast.error("Error message");
toast.info("Info message");
```

---

## Coding Conventions

### File Naming
- **Components:** PascalCase (e.g., `ContactsTable.tsx`)
- **Hooks:** camelCase with 'use' prefix (e.g., `useContacts.ts`)
- **Services:** camelCase with 'Service' suffix (e.g., `contactsService.ts`)
- **Types:** camelCase with 'Types' suffix (e.g., `whatsappTypes.ts`)
- **Utils:** camelCase (e.g., `toast.ts`)

### Component Structure
```typescript
// 1. Imports
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Types/Interfaces
interface Props {
  name: string;
}

// 3. Component
export const MyComponent = ({ name }: Props) => {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. Event handlers
  const handleClick = () => {};

  // 6. Effects
  useEffect(() => {}, []);

  // 7. Render
  return <div>{name}</div>;
};
```

### Import Aliases
Use `@/` for imports:
```typescript
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
```

### Styling
- Use Tailwind CSS utility classes
- Use `cn()` utility for conditional classes:
  ```typescript
  <div className={cn("base-class", isActive && "active-class")} />
  ```
- Define custom CSS variables in `src/globals.css`

### TypeScript
- Define types in `src/types/`
- Use interfaces for props, types for data models
- Avoid `any`, use `unknown` if type is truly unknown
- Export types for reuse

---

## Environment Variables

### Required
```bash
TENANT_ID=your-tenant-uuid
```

### Optional (override defaults)
```bash
VITE_AUTH_BASE_URL=http://127.0.0.1:8000/api
VITE_CRM_BASE_URL=http://127.0.0.1:8001/api
VITE_WHATSAPP_BASE_URL=https://whatsapp.dglinkup.com/api
VITE_WHATSAPP_WS_URL=wss://whatsapp.dglinkup.com
```

Create `.env.local` for local overrides (gitignored).

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Build for development (with dev mode)
npm run build:dev

# Preview production build
npm run preview

# Run linting
npm run lint
```

---

## Authentication Flow

1. **User logs in** at `/login`
2. **authService.login()** calls Auth API
3. **Tokens stored** in localStorage:
   - `celiyo_access_token`
   - `celiyo_refresh_token`
   - `celiyo_user`
4. **User redirected** to `/dashboard`
5. **All API requests** include:
   - `Authorization: Bearer {access_token}`
   - `X-Tenant-Id: {tenant_id}`
   - `tenanttoken: {tenant_token}`
6. **On 401 response**, interceptor:
   - Calls refresh token endpoint
   - Updates access token
   - Retries original request
7. **On refresh failure**, user logged out and redirected to `/login`

See `src/auth/README.md` for detailed documentation.

---

## Real-time Updates (WebSocket)

### Usage
```typescript
import { useWhatsappSocket } from "@/hooks/whatsapp/useWhatsappSocket";

const MyComponent = () => {
  const { subscribe, unsubscribe, isConnected } = useWhatsappSocket();

  useEffect(() => {
    const handler = (data) => {
      console.log("New message:", data);
    };

    subscribe("message_incoming", handler);

    return () => {
      unsubscribe("message_incoming", handler);
    };
  }, [subscribe, unsubscribe]);

  return <div>Connected: {isConnected ? "Yes" : "No"}</div>;
};
```

### Events
- `message_incoming` - New message received
- `message_outgoing` - Message sent confirmation

---

## Troubleshooting

### Token Refresh Issues
- Check `src/lib/client.ts` and `src/lib/whatsappClient.ts` interceptors
- Verify refresh token is valid in localStorage
- Check Auth API `/auth/token/refresh/` endpoint

### API Errors
- Check Network tab in DevTools
- Verify tenant headers are sent
- Check API base URLs in `src/lib/apiConfig.ts`
- Verify environment variables

### WebSocket Connection Issues
- Check WebSocket URL in console logs
- Verify tenant ID is correct
- Check browser WebSocket support
- Look for connection errors in console

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`
- Check TypeScript errors: `npm run build`

---

## Deployment

### Vercel Deployment
1. **Connect Git repo** to Vercel
2. **Set environment variables** in Vercel dashboard:
   - `TENANT_ID`
   - Optional: `VITE_*` overrides
3. **Deploy** - Automatic on git push
4. **SPA routing** configured in `vercel.json` (all routes → index.html)

### Production Checklist
- [ ] Environment variables set in Vercel
- [ ] API endpoints accessible from production
- [ ] CORS configured on backend APIs
- [ ] WebSocket URL supports wss://
- [ ] All API URLs use HTTPS
- [ ] Test login flow
- [ ] Test token refresh
- [ ] Test real-time updates

---

## Important Notes

### Multi-Tenant Isolation
- **Critical:** Every API request MUST include tenant headers
- Tenant ID comes from environment or user's tenant
- Never hardcode tenant IDs in code
- Tenant token stored in user object after login

### Security Considerations
- Tokens stored in localStorage (consider httpOnly cookies for enhanced security)
- Token refresh happens automatically on 401
- Logout invalidates tokens on server
- Protected routes check authentication before render

### shadcn/ui Components
- All 50+ components pre-installed in `src/components/ui/`
- Import from `@/components/ui/[component]`
- Customizable via Tailwind classes
- Full documentation: https://ui.shadcn.com

### API Client Selection
- Use `authClient` for auth endpoints (login, logout)
- Use `crmClient` for CRM operations
- Use `whatsappClient` for WhatsApp operations
- Each client has proper error handling and token refresh

---

## Additional Resources

- **Auth Documentation:** `src/auth/README.md`
- **AI Coding Rules:** `AI_RULES.md`
- **shadcn/ui Docs:** https://ui.shadcn.com
- **Radix UI Docs:** https://www.radix-ui.com
- **Tailwind CSS Docs:** https://tailwindcss.com
- **React Hook Form:** https://react-hook-form.com
- **Zod Validation:** https://zod.dev
- **SWR Documentation:** https://swr.vercel.app

---

## Quick Reference

### Most Used Components
- `Button` - `@/components/ui/button`
- `Input` - `@/components/ui/input`
- `Dialog` - `@/components/ui/dialog`
- `Drawer` - `@/components/ui/drawer`
- `Table` - `@/components/ui/table`
- `Form` - `@/components/ui/form`
- `Select` - `@/components/ui/select`
- `Tabs` - `@/components/ui/tabs`

### Most Used Hooks
- `useAuth()` - Authentication state and methods
- `useContacts()` - WhatsApp contacts operations
- `useGroups()` - WhatsApp groups operations
- `useTemplates()` - WhatsApp templates operations
- `useCampaigns()` - WhatsApp campaigns operations
- `useMessages()` - WhatsApp messages operations
- `useCRM()` - CRM leads operations

### Most Used Utilities
- `cn()` - Merge Tailwind classes
- `toast.success()` - Success notification
- `toast.error()` - Error notification
- `format()` (date-fns) - Date formatting

---

**Last Updated:** November 2024
**Maintainer:** Development Team
**Version:** 1.0.0
