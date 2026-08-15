import { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Settings } from '@/models';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        agencyName: 'M.Div Softsolutions',
        defaultCurrency: 'INR',
        currencySymbol: '₹',
        invoicePrefix: 'MDIV-',
        defaultTaxRate: 18,
      });
    }
    return apiSuccess(settings, 'Settings fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }
    return apiSuccess(settings, 'Settings updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
