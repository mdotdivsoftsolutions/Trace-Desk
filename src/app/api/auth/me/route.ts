import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { getRequestSession } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const session = await getRequestSession(req);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. No active session.' },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findById(session.userId).select('-passwordHash');

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Account is not active' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          avatar: user.avatar,
          phoneNumber: user.phoneNumber,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: any) {
    console.error('[API /api/auth/me Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
