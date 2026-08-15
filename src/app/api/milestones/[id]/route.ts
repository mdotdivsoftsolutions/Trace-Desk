import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { Milestone, recalculateProjectBudget } from '@/models';
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

    const rawAmount = body.allocatedAmount !== undefined ? Number(body.allocatedAmount) : (body.amount !== undefined ? Number(body.amount) : undefined);

    const validatedData = updateMilestoneSchema.parse({
      ...body,
      ...(rawAmount !== undefined ? { allocatedAmount: rawAmount, amount: rawAmount } : {}),
    });

    const updateData: Record<string, unknown> = { ...validatedData };
    if (rawAmount !== undefined) {
      updateData.allocatedAmount = rawAmount;
      updateData.amount = rawAmount;
    }
    if (validatedData.projectId) {
      updateData.projectId = new mongoose.Types.ObjectId(validatedData.projectId);
    }

    const updated = await Milestone.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    if (!updated) {
      return apiError('Milestone not found', 404);
    }

    await recalculateProjectBudget(updated.projectId);

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

    await recalculateProjectBudget(deleted.projectId);

    return apiSuccess({ id }, 'Milestone deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
