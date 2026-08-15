import { NextRequest } from 'next/server';
import { DashboardService } from '@/services';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function GET(_req: NextRequest) {
  try {
    const metrics = await DashboardService.getExecutiveMetrics();
    return apiSuccess(metrics, 'Executive metrics retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
