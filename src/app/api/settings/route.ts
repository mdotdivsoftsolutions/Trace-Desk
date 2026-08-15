import { NextRequest } from 'next/server';
import { SettingsService } from '@/services';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await SettingsService.getSettings();
    return apiSuccess(settings, 'Settings fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updatedSettings = await SettingsService.updateSettings(body);
    return apiSuccess(updatedSettings, 'Settings updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
