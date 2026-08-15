import { NextRequest } from 'next/server';
import { TaskService } from '@/services';
import { apiSuccess, handleApiError } from '@/lib/api-response';
import { TaskStatus } from '@/types';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const items = body.items as Array<{ id: string; order: number; status?: TaskStatus }>;

    if (!Array.isArray(items)) {
      return handleApiError(new Error('Expected items array for reordering'));
    }

    await TaskService.reorderTasks(items);
    return apiSuccess({ count: items.length }, 'Tasks reordered successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
