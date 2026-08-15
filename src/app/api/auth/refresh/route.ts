import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { verifyAuthToken, signAccessToken, signRefreshToken } from '@/lib/auth/jwt';
import { REFRESH_COOKIE_NAME, setAuthCookies, clearAuthCookies } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get(REFRESH_COOKIE_NAME)?.value;

    if (!refreshToken) {
      const res = NextResponse.json(
        { success: false, error: 'No refresh token provided' },
        { status: 401 }
      );
      return clearAuthCookies(res);
    }

    const payload = await verifyAuthToken(refreshToken);
    if (!payload || payload.tokenType !== 'refresh') {
      const res = NextResponse.json(
        { success: false, error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
      return clearAuthCookies(res);
    }

    await dbConnect();
    const user = await User.findById(payload.userId);

    if (!user || user.status !== 'active') {
      const res = NextResponse.json(
        { success: false, error: 'User is inactive or not found' },
        { status: 403 }
      );
      return clearAuthCookies(res);
    }

    const userPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const newAccessToken = await signAccessToken(userPayload);
    const newRefreshToken = await signRefreshToken(userPayload);

    const response = NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
    });

    return setAuthCookies(response, newAccessToken, newRefreshToken);
  } catch (error: any) {
    console.error('[API /api/auth/refresh Error]:', error);
    const response = NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
    return clearAuthCookies(response);
  }
}
