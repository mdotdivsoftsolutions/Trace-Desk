import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  token: z.string().min(10, 'Reset token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const parseResult = resetPasswordSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.issues[0]?.message || 'Invalid payload format' },
        { status: 400 }
      );
    }

    const { email, token, password } = parseResult.data;

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired password reset token. Please request a new one.' },
        { status: 400 }
      );
    }

    // Hash new password
    const newPasswordHash = await User.hashPassword(password);
    user.passwordHash = newPasswordHash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error: any) {
    console.error('[API /api/auth/reset-password Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
