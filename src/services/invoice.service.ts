import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { Invoice, Payment, Milestone, Client, Settings, IInvoice, IPayment } from '@/models';
import { CreateInvoiceInput, UpdateInvoiceInput } from '@/lib/validations/invoice.schema';
import { CreatePaymentInput } from '@/lib/validations/payment.schema';

export interface InvoiceCalculations {
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  balanceDue: number;
  items: Array<{
    description: string;
    milestoneId?: mongoose.Types.ObjectId;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
}

export class InvoiceService {
  /**
   * Helper to calculate subtotal, taxes, discounts, and item amounts.
   */
  static calculateTotals(
    items: Array<{
      description: string;
      milestoneId?: string | mongoose.Types.ObjectId;
      quantity: number;
      unitPrice: number;
      amount?: number;
    }>,
    taxRate = 0,
    discountAmount = 0,
    paidAmount = 0
  ): InvoiceCalculations {
    const computedItems = items.map((item) => {
      const quantity = Math.max(1, item.quantity || 1);
      const unitPrice = Math.max(0, item.unitPrice || 0);
      const amount = Number((quantity * unitPrice).toFixed(2));

      return {
        description: item.description,
        milestoneId: item.milestoneId ? new mongoose.Types.ObjectId(item.milestoneId) : undefined,
        quantity,
        unitPrice,
        amount,
      };
    });

    const subtotal = Number(
      computedItems.reduce((sum, item) => sum + item.amount, 0).toFixed(2)
    );
    const taxAmount = Number(((subtotal * Math.max(0, taxRate)) / 100).toFixed(2));
    const totalAmount = Math.max(
      0,
      Number((subtotal + taxAmount - Math.max(0, discountAmount)).toFixed(2))
    );
    const balanceDue = Math.max(0, Number((totalAmount - Math.max(0, paidAmount)).toFixed(2)));

    return {
      subtotal,
      taxAmount,
      totalAmount,
      balanceDue,
      items: computedItems,
    };
  }

  /**
   * Generates the next guaranteed-unique invoice number based on agency settings prefix.
   */
  static async getNextInvoiceNumber(): Promise<string> {
    await dbConnect();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        agencyName: 'M.Div Softsolutions',
        defaultCurrency: 'INR',
        currencySymbol: '₹',
        invoicePrefix: 'MDIV-',
        nextInvoiceNumber: 1,
        defaultTaxRate: 18,
      });
    }

    const prefix = settings.invoicePrefix || 'MDIV-';
    const escapedPrefix = prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

    // Find existing invoices matching prefix
    const existingInvoices = await Invoice.find(
      { invoiceNumber: { $regex: `^${escapedPrefix}` } },
      { invoiceNumber: 1 }
    ).lean();

    let maxNum = 0;
    for (const inv of existingInvoices) {
      const suffix = inv.invoiceNumber.slice(prefix.length);
      const parsed = parseInt(suffix, 10);
      if (!isNaN(parsed) && parsed > maxNum) {
        maxNum = parsed;
      }
    }

    let candidateNum = Math.max(maxNum + 1, settings.nextInvoiceNumber || 1);
    let candidate = `${prefix}${candidateNum.toString().padStart(4, '0')}`;

    // Loop check for collision safety
    while (await Invoice.exists({ invoiceNumber: candidate })) {
      candidateNum++;
      candidate = `${prefix}${candidateNum.toString().padStart(4, '0')}`;
    }

    return candidate;
  }

  /**
   * Creates a new invoice with computed financial totals.
   */
  static async createInvoice(data: CreateInvoiceInput): Promise<IInvoice> {
    await dbConnect();

    let { invoiceNumber } = data;
    if (!invoiceNumber) {
      invoiceNumber = await this.getNextInvoiceNumber();
    }

    const calculations = this.calculateTotals(
      data.items,
      data.taxRate || 0,
      data.discountAmount || 0,
      0
    );

    const invoiceData: any = {
      ...data,
      invoiceNumber,
      clientId: new mongoose.Types.ObjectId(data.clientId),
      projectId: data.projectId ? new mongoose.Types.ObjectId(data.projectId) : undefined,
      items: calculations.items,
      subtotal: calculations.subtotal,
      taxAmount: calculations.taxAmount,
      totalAmount: calculations.totalAmount,
      paidAmount: 0,
      balanceDue: calculations.balanceDue,
      status: data.status || 'draft',
    };

    const invoice = await Invoice.create(invoiceData);

    // Sync settings nextInvoiceNumber forward if applicable
    try {
      const settings = await Settings.findOne();
      if (settings) {
        const prefix = settings.invoicePrefix || 'MDIV-';
        if (invoiceNumber.startsWith(prefix)) {
          const numPart = parseInt(invoiceNumber.slice(prefix.length), 10);
          if (!isNaN(numPart) && numPart >= (settings.nextInvoiceNumber || 1)) {
            await Settings.updateOne({ _id: settings._id }, { $set: { nextInvoiceNumber: numPart + 1 } });
          }
        }
      }
    } catch {
      // Non-blocking for invoice creation
    }

    const milestoneIds = calculations.items
      .map((it: any) => it.milestoneId)
      .filter(Boolean);

    if (milestoneIds.length > 0) {
      await Milestone.updateMany(
        { _id: { $in: milestoneIds } },
        { status: 'invoiced' }
      );
    }

    return invoice;
  }

  /**
   * Retrieves invoices with client and project information and pagination.
   */
  static async getInvoices(filter: {
    clientId?: string;
    projectId?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    items: IInvoice[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    await dbConnect();
    const query: any = {};

    if (filter.clientId && filter.clientId !== 'all') {
      query.clientId = new mongoose.Types.ObjectId(filter.clientId);
    }
    if (filter.projectId && filter.projectId !== 'all') {
      query.projectId = new mongoose.Types.ObjectId(filter.projectId);
    }
    if (filter.status && filter.status !== 'all') {
      query.status = filter.status;
    }
    if (filter.search) {
      query.invoiceNumber = { $regex: filter.search, $options: 'i' };
    }

    const page = Math.max(1, Number(filter.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filter.limit) || 10));
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      Invoice.countDocuments(query),
      Invoice.find(query)
        .populate('clientId', 'name companyName email currency')
        .populate('projectId', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Retrieves an invoice by ID with populated references.
   */
  static async getInvoiceById(id: string): Promise<IInvoice | null> {
    await dbConnect();
    return Invoice.findById(id)
      .populate('clientId', 'name companyName email phone country currency')
      .populate('projectId', 'title description techStack');
  }

  /**
   * Updates an invoice and re-computes financial balances.
   */
  static async updateInvoice(id: string, data: UpdateInvoiceInput): Promise<IInvoice | null> {
    await dbConnect();
    const existing = await Invoice.findById(id);
    if (!existing) return null;

    const items = data.items || existing.items;
    const taxRate = data.taxRate !== undefined ? data.taxRate : existing.taxRate;
    const discountAmount =
      data.discountAmount !== undefined ? data.discountAmount : existing.discountAmount;
    const paidAmount = existing.paidAmount || 0;

    const calculations = this.calculateTotals(items, taxRate, discountAmount, paidAmount);

    let status = data.status || existing.status;
    if (status !== 'cancelled' && status !== 'draft') {
      if (calculations.balanceDue <= 0 && calculations.totalAmount > 0) {
        status = 'paid';
      } else if (paidAmount > 0) {
        status = 'partially_paid';
      }
    }

    const updateData: any = {
      ...data,
      items: calculations.items,
      subtotal: calculations.subtotal,
      taxAmount: calculations.taxAmount,
      totalAmount: calculations.totalAmount,
      balanceDue: calculations.balanceDue,
      status,
    };

    if (data.clientId) updateData.clientId = new mongoose.Types.ObjectId(data.clientId);
    if (data.projectId !== undefined) {
      updateData.projectId = data.projectId ? new mongoose.Types.ObjectId(data.projectId) : undefined;
    }

    return Invoice.findByIdAndUpdate(id, updateData, { new: true });
  }

  /**
   * Logs a payment and reconciles the invoice status and balance.
   */
  static async recordPayment(
    paymentData: CreatePaymentInput
  ): Promise<{ payment: IPayment; invoice: IInvoice }> {
    await dbConnect();

    const invoice = await Invoice.findById(paymentData.invoiceId);
    if (!invoice) {
      throw new Error(`Invoice with ID ${paymentData.invoiceId} not found`);
    }

    const clientId = paymentData.clientId
      ? new mongoose.Types.ObjectId(paymentData.clientId)
      : invoice.clientId;

    // 1. Create the payment record
    const payment = await Payment.create({
      invoiceId: invoice._id,
      clientId,
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      transactionReference: paymentData.transactionReference,
      paymentDate: paymentData.paymentDate || new Date(),
      notes: paymentData.notes,
    });

    // 2. Aggregate all payments for this invoice to guarantee exact balance
    const payments = await Payment.find({ invoiceId: invoice._id });
    const totalPaid = Number(
      payments.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)
    );

    const newBalanceDue = Math.max(0, Number((invoice.totalAmount - totalPaid).toFixed(2)));

    // 3. Auto-transition invoice status
    let newStatus = invoice.status;
    if (invoice.status !== 'cancelled') {
      if (newBalanceDue <= 0) {
        newStatus = 'paid';
      } else if (totalPaid > 0) {
        newStatus = 'partially_paid';
      }
    }

    invoice.paidAmount = totalPaid;
    invoice.balanceDue = newBalanceDue;
    invoice.status = newStatus;
    await invoice.save();

    return { payment, invoice };
  }

  /**
   * Helper to convert milestones into a draft invoice.
   */
  static async generateFromMilestones(
    projectId: string,
    milestoneIds: string[],
    options: {
      invoiceNumber?: string;
      dueDate: Date;
      taxRate?: number;
      notes?: string;
    }
  ): Promise<IInvoice> {
    await dbConnect();

    const milestones = await Milestone.find({
      _id: { $in: milestoneIds.map((id) => new mongoose.Types.ObjectId(id)) },
      projectId: new mongoose.Types.ObjectId(projectId),
    });

    if (milestones.length === 0) {
      throw new Error('No valid milestones found for the provided IDs');
    }

    const project = await Milestone.findById(milestones[0]._id).populate('projectId');
    const clientId = (project as any)?.projectId?.clientId;

    if (!clientId) {
      throw new Error('Project has no associated Client');
    }

    const items = milestones.map((m) => ({
      description: `Milestone: ${m.title}${m.description ? ` - ${m.description}` : ''}`,
      milestoneId: m._id.toString(),
      quantity: 1,
      unitPrice: m.allocatedAmount || 0,
      amount: m.allocatedAmount || 0,
    }));

    const invoice = await this.createInvoice({
      invoiceNumber: options.invoiceNumber,
      clientId: clientId.toString(),
      projectId,
      items,
      taxRate: options.taxRate || 0,
      discount: 0,
      discountAmount: 0,
      currency: (project as any)?.projectId?.currency || 'USD',
      status: 'draft',
      issueDate: new Date(),
      dueDate: options.dueDate,
      notes: options.notes,
    });

    // Mark milestones as invoiced
    await Milestone.updateMany(
      { _id: { $in: milestoneIds.map((id) => new mongoose.Types.ObjectId(id)) } },
      { status: 'invoiced' }
    );

    return invoice;
  }
}

export default InvoiceService;



