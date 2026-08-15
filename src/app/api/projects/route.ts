import { NextRequest } from 'next/server';
import { ProjectService } from '@/services';
import { createProjectSchema } from '@/lib/validations';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const result = await ProjectService.getProjects({ clientId, status, search, page, limit });
    return apiSuccess(result, 'Projects fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createProjectSchema.parse(body);

    const project = await ProjectService.createProject(validatedData);
    return apiSuccess(project, 'Project created successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
