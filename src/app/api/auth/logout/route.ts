import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth/session';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });
  return clearAuthCookies(response);
}
