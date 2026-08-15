import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { Milestone, recalculateProjectBudget } from '@/models';
import { createMilestoneSchema } from '@/lib/validations';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    await dbConnect();

    const milestones = await Milestone.find({
      projectId: new mongoose.Types.ObjectId(projectId),
    }).sort({ order: 1, createdAt: 1 });

    return apiSuccess(milestones, 'Milestones fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await req.json();
    await dbConnect();

    const rawAmount = body.allocatedAmount !== undefined ? Number(body.allocatedAmount) : (body.amount !== undefined ? Number(body.amount) : 0);

    const validatedData = createMilestoneSchema.parse({
      ...body,
      allocatedAmount: rawAmount,
      amount: rawAmount,
      projectId,
    });

    const milestone = await Milestone.create({
      ...validatedData,
      allocatedAmount: rawAmount,
      amount: rawAmount,
      projectId: new mongoose.Types.ObjectId(projectId),
    });

    await recalculateProjectBudget(projectId);

    return apiSuccess(milestone, 'Milestone created successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
