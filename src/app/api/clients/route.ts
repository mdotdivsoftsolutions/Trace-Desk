import { NextRequest } from 'next/server';
import { ClientService } from '@/services';
import { createClientSchema } from '@/lib/validations';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const clients = await ClientService.getClients({ status, search });
    return apiSuccess(clients, 'Clients fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createClientSchema.parse(body);

    const client = await ClientService.createClient(validatedData);
    return apiSuccess(client, 'Client created successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
