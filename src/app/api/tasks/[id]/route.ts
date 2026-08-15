import { NextRequest } from 'next/server';
import { TaskService } from '@/services';
import { updateTaskSchema, updateTaskStatusSchema } from '@/lib/validations';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await TaskService.getTaskById(id);

    if (!task) {
      return apiError('Task not found', 404);
    }

    return apiSuccess(task, 'Task fetched successfully');
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
    const body = await req.json();

    // Check if it's a fast status update (Kanban)
    if (body.status && Object.keys(body).length === 1) {
      const validatedStatus = updateTaskStatusSchema.parse(body);
      const updated = await TaskService.updateTaskStatus(id, validatedStatus.status);

      if (!updated) {
        return apiError('Task not found', 404);
      }
      return apiSuccess(updated, 'Task status updated successfully');
    }

    // Full or partial field update
    const validatedData = updateTaskSchema.parse(body);
    const updated = await TaskService.updateTask(id, validatedData);

    if (!updated) {
      return apiError('Task not found', 404);
    }

    return apiSuccess(updated, 'Task updated successfully');
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
    const deleted = await TaskService.deleteTask(id);

    if (!deleted) {
      return apiError('Task not found', 404);
    }

    return apiSuccess({ id }, 'Task deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
