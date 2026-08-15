# SYSTEM ARCHITECTURE & DESIGN PATTERNS SPECIFICATION
## Full-Stack Architecture Guide for SoloOps Management Hub

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture
The platform is designed around a **Modular Layered Architecture** (Controller-Service-Repository Pattern) for the backend and a **Feature-Driven Component Architecture** for the frontend.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js / React)                       │
│  ┌────────────────────┬────────────────────┬──────────────────────────┐  │
│  │   UI Components    │  Custom Hooks &    │    TanStack Query        │  │
│  │ (Tailwind + Shadcn)│   State Stores     │   (Server State Cache)   │  │
│  └─────────┬──────────┴─────────┬──────────┴──────────────┬───────────┘  │
└────────────┼────────────────────┼─────────────────────────┼──────────────┘
             │                    │                         │
             ▼                    ▼                         ▼
      HTTP / JSON (REST API Endpoints with Zod Payload Validation)
             │                    │                         │
┌────────────┼────────────────────┼─────────────────────────┼──────────────┐
│            ▼                    ▼                         ▼              │
│  ┌────────────────────┬────────────────────┬──────────────────────────┐  │
│  │  API Controllers   │   Service Layer    │    Data Access Layer     │  │
│  │ (Route Handlers)   │  (Business Logic)  │    (Mongoose Models)     │  │
│  └────────────────────┴─────────┬──────────┴──────────────┬───────────┘  │
│                                 ▼                         ▼              │
│                       ┌───────────────────────────────────────┐          │
│                       │        MongoDB Database Layer         │          │
│                       └───────────────────────────────────────┘          │
│                         BACKEND (Node.js / Express or API)               │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Backend Design Patterns & Architecture

### 2.1 Architectural Patterns
1. **Controller-Service-Repository (CSR) Pattern:**
   - **Controller:** Handles HTTP requests, parses query/body, calls validation schemas, and sends HTTP responses.
   - **Service:** Houses all business rules (e.g., auto-recalculating project progress, updating invoice status when payment clears).
   - **Model / Repository:** Direct interaction with MongoDB using Mongoose with strict schema typings and indexes.
2. **Middleware Pipeline Pattern:**
   - Auth Guard (`requireAdmin`)
   - Input Validator (`validateBody(zodSchema)`)
   - Centralized Error Handler (`errorHandler`)

### 2.2 Backend Folder Structure
```
backend/ (or src/server/)
├── config/
│   ├── db.ts                  # MongoDB connection with retry logic
│   └── env.ts                 # Validated environment variables
├── middleware/
│   ├── auth.middleware.ts     # Admin token verification
│   ├── validate.middleware.ts # Zod schema request validation
│   └── error.middleware.ts    # Global error interceptor & formatter
├── modules/
│   ├── client/
│   │   ├── client.model.ts
│   │   ├── client.schema.ts   # Zod validation schemas
│   │   ├── client.service.ts  # Business operations
│   │   └── client.controller.ts
│   ├── project/
│   │   ├── project.model.ts
│   │   ├── project.schema.ts
│   │   ├── project.service.ts
│   │   └── project.controller.ts
│   ├── task/
│   │   ├── task.model.ts
│   │   ├── task.service.ts
│   │   └── task.controller.ts
│   └── invoice/
│       ├── invoice.model.ts
│       ├── invoice.service.ts
│       ├── invoice.pdf.ts     # PDF generation engine
│       └── invoice.controller.ts
└── utils/
    ├── apiResponse.ts         # Standardized JSON response envelope
    └── logger.ts
```

### 2.3 Standardized API Response Contract
All endpoints must return data conforming to this envelope:
```typescript
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T | null;
  errors?: string[] | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
```

---

## 3. Database Schema & Data Models (MongoDB / Mongoose)

### 3.1 Entity Relationship Diagram
```
  ┌──────────────┐          1:N          ┌──────────────┐
  │   Clients    ├──────────────────────►│   Projects   │
  └──────┬───────┘                       └──────┬───────┘
         │                                      │
         │ 1:N                                  │ 1:N
         │                                      ▼
         │                              ┌──────────────┐
         │                              │  Milestones  │
         │                              └──────┬───────┘
         │                                     │
         │                                     │ 1:N
         ▼                                     ▼
  ┌──────────────┐          1:N          ┌──────────────┐
  │   Invoices   ├──────────────────────►│    Tasks     │
  └──────┬───────┘                       └──────────────┘
         │
         │ 1:N
         ▼
  ┌──────────────┐
  │   Payments   │
  └──────────────┘
```

### 3.2 Key Data Schemas

#### A. Client Model
```typescript
interface IClient {
  _id: string;
  name: string;
  companyName: string;
  email: string;
  phone?: string;
  country?: string;
  currency: 'USD' | 'EUR' | 'INR' | 'AED' | 'GBP';
  notes?: string;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}
```

#### B. Project Model
```typescript
interface IProject {
  _id: string;
  clientId: Types.ObjectId; // Ref: Client
  title: string;
  description?: string;
  status: 'discovery' | 'in_progress' | 'review' | 'completed' | 'on_hold';
  budgetType: 'fixed' | 'hourly';
  totalBudget: number;
  currency: string;
  startDate?: Date;
  targetDeadline?: Date;
  repoUrl?: string;
  liveUrl?: string;
  techStack: string[];
  progressPercentage: number; // 0 - 100 (auto-calculated)
  createdAt: Date;
  updatedAt: Date;
}
```

#### C. Milestone Model
```typescript
interface IMilestone {
  _id: string;
  projectId: Types.ObjectId; // Ref: Project
  title: string;
  description?: string;
  allocatedAmount: number;
  order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'invoiced';
  dueDate?: Date;
}
```

#### D. Task Model
```typescript
interface ITask {
  _id: string;
  projectId: Types.ObjectId; // Ref: Project
  milestoneId?: Types.ObjectId; // Ref: Milestone (optional)
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'todo' | 'in_progress' | 'review' | 'done';
  estimatedHours?: number;
  loggedHours?: number;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### E. Invoice & Payment Model
```typescript
interface IInvoiceItem {
  description: string;
  milestoneId?: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface IInvoice {
  _id: string;
  invoiceNumber: string; // e.g. "INV-2026-001"
  clientId: Types.ObjectId; // Ref: Client
  projectId?: Types.ObjectId; // Ref: Project
  items: IInvoiceItem[];
  subtotal: number;
  taxRate: number; // e.g. 5%
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  currency: string;
  status: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
  issueDate: Date;
  dueDate: Date;
  notes?: string;
  createdAt: Date;
}

interface IPayment {
  _id: string;
  invoiceId: Types.ObjectId; // Ref: Invoice
  clientId: Types.ObjectId; // Ref: Client
  amount: number;
  paymentMethod: 'bank_transfer' | 'stripe' | 'upi' | 'paypal' | 'wire' | 'cash';
  transactionReference?: string;
  paymentDate: Date;
  notes?: string;
}
```

---

## 4. Frontend Architecture & Design Patterns

### 4.1 Frontend Directory Structure (Next.js App Router)
```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx             # Main shell (Sidebar + Header)
│   │   ├── page.tsx               # Executive Dashboard
│   │   ├── clients/
│   │   │   ├── page.tsx           # Client Directory
│   │   │   └── [id]/page.tsx      # Client Details & Projects
│   │   ├── projects/
│   │   │   ├── page.tsx           # Projects Grid/List
│   │   │   └── [id]/
│   │   │       ├── page.tsx       # Project Overview
│   │   │       ├── kanban/page.tsx# Project Task Kanban
│   │   │       └── milestones/    # Milestone management
│   │   └── invoices/
│   │       ├── page.tsx           # Invoice list & ledger
│   │       ├── new/page.tsx       # Invoice generator
│   │       └── [id]/page.tsx      # Invoice preview & PDF trigger
│   └── api/                       # API route handlers
├── components/
│   ├── ui/                        # Shadcn base primitives (Button, Dialog, etc.)
│   ├── common/                    # App-wide UI (StatusBadge, EmptyState, DataTable)
│   └── modules/                   # Feature-grouped components
│       ├── clients/
│       ├── projects/
│       ├── tasks/
│       └── invoices/
├── hooks/                         # Custom React hooks & React Query wrappers
├── lib/
│   ├── api-client.ts              # Axios / Fetch wrapper with auth interceptor
│   └── utils.ts                   # Formatting helpers (Currency, Dates)
└── types/                         # Shared TypeScript definitions
```

### 4.2 Frontend Design Patterns
1. **Compound Component Pattern:**
   Used for complex UI components like Modal Forms, Milestone Accordions, and Kanban Cards to allow flexible internal composition.
2. **Custom Hook / Query Separation Pattern:**
   Every API endpoint is abstracted into a dedicated TanStack Query custom hook:
   - `useClients()`, `useCreateClient()`, `useUpdateClient()`
   - `useProjectTasks(projectId)`, `useUpdateTaskStatus()`
   - `useInvoices()`, `useRecordPayment()`
3. **Optimistic Updates Pattern:**
   When moving a task card on the Kanban board or toggling task status, the UI updates instantly while the mutation executes in the background. If the request fails, it rolls back smoothly.
4. **Controlled Modal / Drawer Pattern:**
   Forms for creating clients, tasks, and logging payments operate in slide-over sheets or modals triggered via declarative state.

---

## 5. Antigravity AI Implementation Playbook

When developing this application in **Antigravity**, follow this exact prompt-by-prompt sequence for smooth, hallucination-free code generation:

### Prompt 1: Database Setup & Core Models
> *"Generate the complete Mongoose schemas and TypeScript interfaces for the SoloOps Hub following the architecture doc: Client, Project, Milestone, Task, Invoice, and Payment models with proper indexes and timestamps."*

### Prompt 2: Service Layer & Business Logic
> *"Implement the project and task services with automated progress calculation (percentage based on completed tasks) and the invoice calculation service with tax, discount, and balance reconciliation."*

### Prompt 3: API Route Controllers & Validation
> *"Create the Next.js API routes with Zod request validation and standard ApiResponse envelope for CRUD operations on Clients, Projects, Tasks, and Invoices."*

### Prompt 4: React Query Hooks & API Client
> *"Write the TanStack Query hooks for all entities including optimistic updates for Kanban drag-and-drop task status transitions."*

### Prompt 5: Dashboard & UI Components
> *"Build the Executive Dashboard with metric cards (Revenue, Projects, Pending Invoices) and the Project Kanban board using Tailwind CSS and Shadcn UI components."*

### Prompt 6: PDF Generation Module
> *"Implement the client-side/server-side PDF invoice generator with clean tabular styling, company header, tax summary, and bank remittance details."*
