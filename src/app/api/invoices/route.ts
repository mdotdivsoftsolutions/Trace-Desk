import { NextRequest } from 'next/server';
import { InvoiceService } from '@/services';
import { createInvoiceSchema } from '@/lib/validations';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId') || undefined;
    const projectId = searchParams.get('projectId') || undefined;
    const status = searchParams.get('status') || undefined;

    const invoices = await InvoiceService.getInvoices({ clientId, projectId, status });
    return apiSuccess(invoices, 'Invoices fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createInvoiceSchema.parse(body);

    const invoice = await InvoiceService.createInvoice(validatedData);
    return apiSuccess(invoice, 'Invoice created successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
