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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    if (body.action === 'toggleStatus') {
      const updated = await ClientService.toggleClientStatus(id);
      if (!updated) {
        return apiError('Client not found', 404);
      }
      return apiSuccess(updated, `Client marked ${updated.status} successfully`);
    }

    if (body.action === 'deactivate') {
      const updated = await ClientService.deactivateClient(id);
      if (!updated) {
        return apiError('Client not found', 404);
      }
      return apiSuccess(updated, 'Client deactivated successfully');
    }

    if (body.action === 'reactivate') {
      const updated = await ClientService.reactivateClient(id);
      if (!updated) {
        return apiError('Client not found', 404);
      }
      return apiSuccess(updated, 'Client reactivated successfully');
    }

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
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const soft = searchParams.get('soft') === 'true';

    if (soft) {
      const deactivated = await ClientService.deactivateClient(id);
      if (!deactivated) {
        return apiError('Client not found', 404);
      }
      return apiSuccess({ id, status: 'inactive' }, 'Client account deactivated successfully');
    }

    const deleted = await ClientService.deleteClient(id);
    if (!deleted) {
      return apiError('Client not found', 404);
    }

    return apiSuccess({ id }, 'Client deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
