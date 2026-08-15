import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { Client, Project, Invoice, IClient, IProject, IInvoice } from '@/models';
import { CreateClientInput, UpdateClientInput } from '@/lib/validations/client.schema';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedClientsResult {
  items: IClient[];
  pagination: PaginationMeta;
}

export interface ClientFinancialSummary {
  totalBilled: number;
  totalPaid: number;
  outstanding: number;
}

export interface ClientWithDetails extends Record<string, unknown> {
  projects: IProject[];
  invoices: IInvoice[];
  financialSummary: ClientFinancialSummary;
}

export class ClientService {
  static async createClient(data: CreateClientInput): Promise<IClient> {
    await dbConnect();
    return Client.create(data);
  }

  static async getClients(
    filter: {
      status?: string;
      search?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<PaginatedClientsResult> {
    await dbConnect();
    const query: Record<string, unknown> = {};

    if (filter.status && filter.status !== 'all') {
      query.status = filter.status;
    }

    if (filter.startDate || filter.endDate) {
      const dateCond: Record<string, unknown> = {};
      if (filter.startDate) {
        dateCond.$gte = new Date(filter.startDate);
      }
      if (filter.endDate) {
        const end = new Date(filter.endDate);
        end.setHours(23, 59, 59, 999);
        dateCond.$lte = end;
      }
      query.createdAt = dateCond;
    }

    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { companyName: { $regex: filter.search, $options: 'i' } },
        { email: { $regex: filter.search, $options: 'i' } },
      ];
    }

    const page = Math.max(1, Number(filter.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filter.limit) || 10));
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      Client.countDocuments(query),
      Client.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
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

  static async getClientById(id: string): Promise<ClientWithDetails | null> {
    await dbConnect();
    const client = await Client.findById(id);
    if (!client) return null;

    const projects = await Project.find({ clientId: client._id }).sort({ createdAt: -1 });
    const invoices = await Invoice.find({ clientId: client._id }).sort({ createdAt: -1 });

    const totalBilled = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
    const outstanding = invoices.reduce((sum, inv) => sum + (inv.balanceDue || 0), 0);

    return {
      ...client.toObject(),
      projects,
      invoices,
      financialSummary: {
        totalBilled: Number(totalBilled.toFixed(2)),
        totalPaid: Number(totalPaid.toFixed(2)),
        outstanding: Number(outstanding.toFixed(2)),
      },
    };
  }

  static async updateClient(id: string, data: UpdateClientInput): Promise<IClient | null> {
    await dbConnect();
    return Client.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteClient(id: string): Promise<boolean> {
    await dbConnect();
    const res = await Client.findByIdAndDelete(id);
    return !!res;
  }
}

export default ClientService;
