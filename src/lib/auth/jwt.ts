import { SignJWT, jwtVerify } from 'jose';
import { UserRole } from '@/models/User';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  tokenType?: 'access' | 'refresh';
  [key: string]: any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'm_div_softsolutions_trace_desk_secure_jwt_secret_key_2026_super_admin';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

/**
 * Sign a short-lived Access Token (15 minutes).
 */
export async function signAccessToken(payload: Omit<AuthTokenPayload, 'tokenType'>): Promise<string> {
  return new SignJWT({ ...payload, tokenType: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(encodedSecret);
}

/**
 * Sign a long-lived Refresh Token (7 days).
 */
export async function signRefreshToken(payload: Omit<AuthTokenPayload, 'tokenType'>): Promise<string> {
  return new SignJWT({ ...payload, tokenType: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedSecret);
}

/**
 * Verify and decode any token.
 */
export async function verifyAuthToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload as unknown as AuthTokenPayload;
  } catch (error) {
    return null;
  }
}
