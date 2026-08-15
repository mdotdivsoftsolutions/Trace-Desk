import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const AUTH_COOKIE_NAME = 'trace_desk_auth_token';
const JWT_SECRET = process.env.JWT_SECRET || 'm_div_softsolutions_trace_desk_secure_jwt_secret_key_2026_super_admin';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

// Public paths that do not require authentication
const PUBLIC_PAGE_PATHS = ['/login', '/forgot-password', '/reset-password'];
const PUBLIC_API_PREFIXES = ['/api/auth', '/api/health'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore static assets, next internal files, and favicon
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // matches favicon.ico, images, fonts, etc.
  ) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, encodedSecret);
      isAuthenticated = true;
    } catch (e) {
      isAuthenticated = false;
    }
  }

  const isPublicPage = PUBLIC_PAGE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isPublicApi = PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // 1. If user is authenticated and trying to access login/forgot-password/reset-password pages
  if (isAuthenticated && isPublicPage) {
    const callbackUrl = req.nextUrl.searchParams.get('callbackUrl');
    const redirectUrl = callbackUrl && callbackUrl.startsWith('/') ? callbackUrl : '/';
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // 2. If user is NOT authenticated
  if (!isAuthenticated) {
    // If accessing a protected API route
    if (pathname.startsWith('/api') && !isPublicApi) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please login to continue.' },
        { status: 401 }
      );
    }

    // If accessing a protected Page route
    if (!isPublicPage && !pathname.startsWith('/api')) {
      const loginUrl = new URL('/login', req.url);
      if (pathname !== '/') {
        loginUrl.searchParams.set('callbackUrl', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
