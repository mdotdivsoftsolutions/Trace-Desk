import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const parseResult = forgotPasswordSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.issues[0]?.message || 'Invalid email format' },
        { status: 400 }
      );
    }

    const { email } = parseResult.data;
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always respond with success to prevent user enumeration attacks
    if (!user || user.status !== 'active') {
      return NextResponse.json({
        success: true,
        message: 'If an active account exists for that email, password reset instructions have been generated.',
      });
    }

    // Generate secure random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour validity
    await user.save();

    const resetUrl = `${req.nextUrl.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

    return NextResponse.json({
      success: true,
      message: 'Password reset link generated successfully.',
      data: {
        resetToken,
        resetUrl,
      },
    });
  } catch (error: any) {
    console.error('[API /api/auth/forgot-password Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
