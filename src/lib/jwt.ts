import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'sarthi_super_secure_jwt_secret_key_2026_production_ready';
const encodedKey = new TextEncoder().encode(secretKey);

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'WORKER' | 'ADMIN' | string;
  name: string;
  [key: string]: any;
}

export async function signJWT(payload: TokenPayload, expiresIn = '7d'): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encodedKey);
}

export async function verifyJWT(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as TokenPayload;
  } catch (error) {
    return null;
  }
}
