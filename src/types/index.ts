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
  email: string;
  phone?: string;
  country?: string;
  currency: CurrencyCode;
  notes?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectType {
  _id: string;
  clientId: string | ClientType;
  title: string;
  description?: string;
  status: 'discovery' | 'in_progress' | 'review' | 'completed' | 'on_hold';
  budgetType: 'fixed' | 'hourly';
  totalBudget?: number;
  currency: string;
  repoUrl?: string;
  liveUrl?: string;
  techStack?: string[];
  progressPercentage: number;
  startDate?: string;
  targetDeadline?: string;
  milestones?: MilestoneType[];
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneType {
  _id: string;
  projectId: string | ProjectType;
  title: string;
  description?: string;
  allocatedAmount?: number;
  order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'invoiced';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskType {
  _id: string;
  projectId: string | ProjectType;
  milestoneId?: string | MilestoneType;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'todo' | 'in_progress' | 'review' | 'done';
  estimatedHours?: number;
  loggedHours: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItemType {
  description: string;
  milestoneId?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceType {
  _id: string;
  invoiceNumber: string;
  clientId: string | ClientType;
  projectId?: string | ProjectType;
  items: InvoiceItemType[];
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  discountAmount?: number;
  discount?: number;
  totalAmount: number;
  paidAmount: number;
  amountPaid?: number;
  balanceDue: number;
  currency: string;
  status: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paymentTerms?: string;
  notes?: string;
  payments?: PaymentType[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentType {
  _id: string;
  invoiceId: string | InvoiceType;
  clientId: string | ClientType;
  amount: number;
  paymentMethod: 'bank_transfer' | 'stripe' | 'upi' | 'paypal' | 'wire' | 'cash';
  transactionReference?: string;
  paymentDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankDetailsType {
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  swiftCode?: string;
}

export interface SettingsType {
  _id?: string;
  agencyName: string;
  agencyEmail?: string;
  agencyPhone?: string;
  agencyAddress?: string;
  gstinOrTaxId?: string;
  defaultCurrency: CurrencyCode;
  currencySymbol: string;
  bankDetails?: BankDetailsType;
  invoicePrefix: string;
  defaultTaxRate: number;
  createdAt?: string;
  updatedAt?: string;
}
