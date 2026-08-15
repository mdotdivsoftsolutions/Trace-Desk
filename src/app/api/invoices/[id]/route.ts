import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import { Invoice } from '@/models';
import { InvoiceService } from '@/services';
import { updateInvoiceSchema } from '@/lib/validations';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await InvoiceService.getInvoiceById(id);

    if (!invoice) {
      return apiError('Invoice not found', 404);
    }

    return apiSuccess(invoice, 'Invoice fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateInvoiceSchema.parse(body);

    const updated = await InvoiceService.updateInvoice(id, validatedData);
    if (!updated) {
      return apiError('Invoice not found', 404);
    }

    return apiSuccess(updated, 'Invoice updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const deleted = await Invoice.findByIdAndDelete(id);
    if (!deleted) {
      return apiError('Invoice not found', 404);
    }

    return apiSuccess({ id }, 'Invoice deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
