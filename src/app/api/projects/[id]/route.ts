import { NextRequest } from 'next/server';
import { ProjectService } from '@/services';
import { updateProjectSchema } from '@/lib/validations';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await ProjectService.getProjectById(id);

    if (!project) {
      return apiError('Project not found', 404);
    }

    return apiSuccess(project, 'Project fetched successfully');
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
    const validatedData = updateProjectSchema.parse(body);

    const updated = await ProjectService.updateProject(id, validatedData);
    if (!updated) {
      return apiError('Project not found', 404);
    }

    return apiSuccess(updated, 'Project updated successfully');
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
    const deleted = await ProjectService.deleteProject(id);

    if (!deleted) {
      return apiError('Project not found', 404);
    }

    return apiSuccess({ id }, 'Project and linked tasks/milestones deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
