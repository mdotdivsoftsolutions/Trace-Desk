import { SignJWT, jwtVerify } from 'jose';
import { UserRole } from '@/models/User';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  [key: string]: any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'm_div_softsolutions_trace_desk_secure_jwt_secret_key_2026_super_admin';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

/**
 * Sign an authentication token with 7-day expiration.
 */
export async function signAuthToken(payload: AuthTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedSecret);
}

/**
 * Verify and decode an authentication token.
 */
export async function verifyAuthToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload as unknown as AuthTokenPayload;
  } catch (error) {
    return null;
  }
}
