import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, AuthTokenPayload } from './jwt';

export const ACCESS_COOKIE_NAME = 'trace_desk_access_token';
export const REFRESH_COOKIE_NAME = 'trace_desk_refresh_token';

/**
 * Attaches both access and refresh cookies to a NextResponse.
 */
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken?: string
): NextResponse {
  // 15-minute access token cookie
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15, // 15 minutes
  });

  // 7-day refresh token cookie
  if (refreshToken) {
    response.cookies.set({
      name: REFRESH_COOKIE_NAME,
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  return response;
}

/**
 * Clears all auth cookies from a NextResponse.
 */
export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  response.cookies.set({
    name: REFRESH_COOKIE_NAME,
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
 * Retrieves and validates the current active session from an incoming NextRequest.
 */
export async function getRequestSession(request: NextRequest): Promise<AuthTokenPayload | null> {
  const accessToken = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  if (accessToken) {
    const payload = await verifyAuthToken(accessToken);
    if (payload) return payload;
  }

  // Fallback to refresh token if access token just expired
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;
  if (refreshToken) {
    const payload = await verifyAuthToken(refreshToken);
    if (payload) return payload;
  }

  return null;
}
