export type CurrencyCode = 'USD' | 'EUR' | 'INR' | 'AED' | 'GBP';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface ClientType {
  _id: string;
  name: string;
  companyName?: string;
  company?: string;
  email: string;
  phone?: string;
  address?: string;
  taxId?: string;
  country?: string;
  currency?: CurrencyCode;
  notes?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectLink {
  _id?: string;
  title: string;
  url: string;
  category?: 'production' | 'staging' | 'development' | 'repository' | 'design' | 'api' | 'other';
}

export interface ProjectCredential {
  _id?: string;
  serviceName?: string;
  title?: string;
  accountId?: string;
  username?: string;
  accessKeyOrUrl?: string;
  password?: string;
  url?: string;
  environment?: string;
  notes?: string;
}

export interface ProjectType {
  _id: string;
  clientId: string | ClientType;
  title: string;
  description?: string;
  status: 'discovery' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled';
  budgetType?: 'fixed' | 'hourly';
  totalBudget?: number;
  currency?: string;
  repoUrl?: string;
  githubRepo?: string;
  liveUrl?: string;
  links?: ProjectLink[];
  credentials?: ProjectCredential[];
  integrationNotes?: string;
  techStack?: string[];
  progressPercentage: number;
  isPinned?: boolean;
  startDate?: string;
  targetDeadline?: string | Date;
  milestones?: MilestoneType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MilestoneType {
  _id: string;
  projectId: string | ProjectType;
  title: string;
  description?: string;
  allocatedAmount?: number;
  amount: number;
  order?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'invoiced' | 'cancelled';
  dueDate?: string | Date;
  invoiceId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskType {
  _id: string;
  projectId: string | ProjectType;
  milestoneId?: string | MilestoneType;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'done';
  estimatedHours?: number;
  loggedHours?: number;
  dueDate?: string | Date;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItemType {
  description: string;
  milestoneId?: string;
  quantity: number;
  unitPrice?: number;
  rate: number;
  amount: number;
}

export interface InvoiceType {
  _id: string;
  invoiceNumber: string;
  clientId: string | ClientType;
  projectId?: string | ProjectType;
  items: InvoiceItemType[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount?: number;
  discount: number;
  totalAmount: number;
  paidAmount?: number;
  amountPaid?: number;
  balanceDue: number;
  currency?: string;
  status: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string | Date;
  dueDate: string | Date;
  paymentTerms?: string;
  notes?: string;
  payments?: PaymentType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentType {
  _id: string;
  invoiceId: string | InvoiceType;
  clientId?: string | ClientType;
  amount: number;
  paymentMethod: 'bank_transfer' | 'stripe' | 'upi' | 'paypal' | 'wire' | 'cash' | 'credit_card' | 'other';
  transactionReference?: string;
  referenceNumber?: string;
  paymentDate: string | Date;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BankDetailsType {
  id?: string;
  accountLabel?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  swiftCode?: string;
  accountType?: string;
  isPrimary?: boolean;
}

export interface SettingsType {
  _id?: string;
  agencyName: string;
  agencyEmail?: string;
  agencyPhone?: string;
  agencyAddress?: string;
  taxNumber?: string;
  gstinOrTaxId?: string;
  defaultCurrency: CurrencyCode;
  currencySymbol?: string;
  hourlyRate?: number;
  defaultTaxRate: number;
  paymentTermsDays?: number;
  invoicePrefix: string;
  nextInvoiceNumber?: number;
  invoiceNotes?: string;
  bankDetails?: BankDetailsType;
  bankAccounts?: BankDetailsType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardMetrics {
  financials: {
    totalRevenue: number;
    pendingReceivables: number;
    overdueReceivables: number;
    pendingInvoicesCount?: number;
    readyToInvoiceAmount?: number;
    readyToInvoiceMilestones?: MilestoneType[];
    currency: string;
  };
  projects: {
    activeCount: number;
    totalCount: number;
    averageCompletionRate: number;
    statusBreakdown?: Record<string, number>;
  };
  tasks: {
    totalOpenTasks: number;
    overdueTasks: TaskType[];
    upcomingTasks48h: TaskType[];
  };
  milestones?: {
    unbilledMilestones: MilestoneType[];
    unbilledTotalAmount: number;
  };
  recentActivities?: {
    recentPayments: PaymentType[];
    recentProjects: ProjectType[];
  };
}

export type Client = ClientType;
export type Project = ProjectType;
export type ProjectWithClient = ProjectType;
export type Milestone = MilestoneType;
export type Task = TaskType;
export type Invoice = InvoiceType;
export type Payment = PaymentType;
export type Settings = SettingsType;
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical' | 'urgent';
export type MilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'invoiced' | 'cancelled';
export type PaymentMethod = 'bank_transfer' | 'stripe' | 'upi' | 'paypal' | 'wire' | 'cash' | 'credit_card' | 'other';
