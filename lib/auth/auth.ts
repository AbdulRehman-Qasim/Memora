import { NextRequest } from 'next/server';
import { verifyToken, JwtPayload } from './jwt';
import { AppError } from '../utils/api-error';
import logger from '../logger/logger';

export const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds for Web Cookies / Next.js
});

export const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  path: '/',
  maxAge: 0,
});

export const authenticateRequest = (request: NextRequest): JwtPayload => {
  const token = request.cookies.get('jwt')?.value;

  if (!token) {
    logger.warn({ path: request.nextUrl.pathname }, 'Unauthorized access attempt - No token');
    throw new AppError('Unauthorized', 401);
  }

  try {
    const decoded = verifyToken(token);
    return decoded;
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    logger.warn({ path: request.nextUrl.pathname, error: errMessage }, 'Unauthorized access attempt - Invalid token');
    throw new AppError('Unauthorized', 401);
  }
};

/**
 * Validates the Origin / Referer of state-changing HTTP requests.
 * Explicitly rejects missing origin/referer and enforces allowed origin.
 */
export const validateOrigin = (request: NextRequest): void => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    const originHeader = request.headers.get('origin');
    const refererHeader = request.headers.get('referer');
    const incomingHeader = originHeader || refererHeader;

    if (!incomingHeader) {
      logger.warn({ method: request.method, path: request.nextUrl.pathname }, 'CSRF validation failed: Missing origin and referer');
      throw new AppError('Invalid request origin', 403);
    }

    let requestOrigin = '';
    try {
      const url = new URL(incomingHeader);
      requestOrigin = url.origin;
    } catch {
      logger.warn({ incomingHeader }, 'CSRF validation failed: Malformed origin/referer URL');
      throw new AppError('Invalid request origin', 403);
    }

    // Configured trusted origin (default to http://localhost:3000 in dev)
    const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';

    // In a unified Next.js application, same-host requests are trusted
    const hostHeader = request.headers.get('host');
    let isSameHost = false;
    if (hostHeader) {
      try {
        const hostOriginHttp = `http://${hostHeader}`;
        const hostOriginHttps = `https://${hostHeader}`;
        if (requestOrigin === hostOriginHttp || requestOrigin === hostOriginHttps) {
          isSameHost = true;
        }
      } catch {
        isSameHost = false;
      }
    }

    if (!isSameHost && requestOrigin !== allowedOrigin) {
      logger.warn({ requestOrigin, allowedOrigin, hostHeader }, 'CSRF validation failed: Origin mismatch');
      throw new AppError('Invalid request origin', 403);
    }
  }
};
