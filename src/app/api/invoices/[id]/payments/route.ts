import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { Payment } from '@/models';
import { InvoiceService } from '@/services';
import { createPaymentSchema } from '@/lib/validations';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invoiceId } = await params;
    await dbConnect();

    const payments = await Payment.find({
      invoiceId: new mongoose.Types.ObjectId(invoiceId),
    }).sort({ paymentDate: -1 });

    return apiSuccess(payments, 'Invoice payments fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invoiceId } = await params;
    const body = await req.json();

    const validatedData = createPaymentSchema.parse({
      ...body,
      invoiceId,
    });

    const result = await InvoiceService.recordPayment(validatedData);
    return apiSuccess(result, 'Payment recorded and invoice reconciled successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
