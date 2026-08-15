import { NextRequest } from 'next/server';
import { ClientService } from '@/services';
import { updateClientSchema } from '@/lib/validations';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await ClientService.getClientById(id);

    if (!client) {
      return apiError('Client not found', 404);
    }

    return apiSuccess(client, 'Client fetched successfully');
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
    const validatedData = updateClientSchema.parse(body);

    const updated = await ClientService.updateClient(id, validatedData);
    if (!updated) {
      return apiError('Client not found', 404);
    }

    return apiSuccess(updated, 'Client updated successfully');
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
    const deleted = await ClientService.deleteClient(id);

    if (!deleted) {
      return apiError('Client not found', 404);
    }

    return apiSuccess({ id }, 'Client deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
