import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { Client, Project, Invoice, IClient } from '@/models';
import { CreateClientInput, UpdateClientInput } from '@/lib/validations/client.schema';

export class ClientService {
  static async createClient(data: CreateClientInput): Promise<IClient> {
    await dbConnect();
    return Client.create(data);
  }

  static async getClients(filter: { status?: string; search?: string } = {}): Promise<IClient[]> {
    await dbConnect();
    const query: any = {};

    if (filter.status) {
      query.status = filter.status;
    }

    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { companyName: { $regex: filter.search, $options: 'i' } },
        { email: { $regex: filter.search, $options: 'i' } },
      ];
    }

    return Client.find(query).sort({ createdAt: -1 });
  }

  static async getClientById(id: string): Promise<any> {
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
