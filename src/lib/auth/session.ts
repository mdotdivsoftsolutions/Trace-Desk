import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, AuthTokenPayload } from './jwt';

export const AUTH_COOKIE_NAME = 'trace_desk_auth_token';

/**
 * Attaches the auth cookie to a NextResponse.
 */
export function setAuthCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return response;
}

/**
 * Clears the auth cookie from a NextResponse.
 */
export function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}

/**
 * Retrieves the current session from an incoming NextRequest.
 */
export async function getRequestSession(request: NextRequest): Promise<AuthTokenPayload | null> {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}
