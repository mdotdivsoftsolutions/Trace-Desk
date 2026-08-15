import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { signAuthToken } from '@/lib/auth/jwt';
import { setAuthCookie } from '@/lib/auth/session';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Ensure Super Admin exists
    await User.seedSuperAdmin();

    const body = await req.json();
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.issues[0]?.message || 'Invalid credentials format',
        },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (user.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: `Your account is currently ${user.status}. Please contact the Super Admin.`,
        },
        { status: 403 }
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login timestamp
    user.lastLoginAt = new Date();
    await user.save();

    // Sign JWT
    const token = await signAuthToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          avatar: user.avatar,
        },
      },
    });

    // Attach secure cookie
    return setAuthCookie(response, token);
  } catch (error: any) {
    console.error('[API /api/auth/login Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
