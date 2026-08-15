import { NextRequest } from 'next/server';
import { TaskService } from '@/services';
import { createTaskSchema } from '@/lib/validations';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId') || undefined;
    const milestoneId = searchParams.get('milestoneId') || undefined;
    const status = searchParams.get('status') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const search = searchParams.get('search') || undefined;

    const tasks = await TaskService.getTasks({
      projectId,
      milestoneId,
      status,
      priority,
      search,
    });

    return apiSuccess(tasks, 'Tasks fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createTaskSchema.parse(body);
    const task = await TaskService.createTask(validatedData);
    return apiSuccess(task, 'Task created successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
