import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { Milestone } from '@/models';
import { updateMilestoneSchema } from '@/lib/validations';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const milestone = await Milestone.findById(id).populate('projectId', 'title');
    if (!milestone) {
      return apiError('Milestone not found', 404);
    }

    return apiSuccess(milestone, 'Milestone fetched successfully');
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
    await dbConnect();

    const validatedData = updateMilestoneSchema.parse(body);
    const updateData: any = { ...validatedData };
    if (validatedData.projectId) {
      updateData.projectId = new mongoose.Types.ObjectId(validatedData.projectId);
    }

    const updated = await Milestone.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return apiError('Milestone not found', 404);
    }

    return apiSuccess(updated, 'Milestone updated successfully');
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
    await dbConnect();

    const deleted = await Milestone.findByIdAndDelete(id);
    if (!deleted) {
      return apiError('Milestone not found', 404);
    }

    return apiSuccess({ id }, 'Milestone deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
