import { NextRequest, NextResponse } from 'next/server';
import logger from './logger';

/**
 * Wraps Route Handlers to provide structured request, response status, and duration logging via Pino
 */
export const withHttpLogging = <T extends unknown[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) => {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const start = Date.now();
    const method = request.method;
    const path = request.nextUrl.pathname;

    try {
      const response = await handler(request, ...args);
      const duration = Date.now() - start;

      logger.info(
        {
          http: {
            method,
            path,
            statusCode: response.status,
            durationMs: duration,
          },
        },
        `${method} ${path} ${response.status} in ${duration}ms`
      );

      return response;
    } catch (error) {
      const duration = Date.now() - start;
      const errMessage = error instanceof Error ? error.message : String(error);

      logger.error(
        {
          http: {
            method,
            path,
            durationMs: duration,
          },
          error: errMessage,
        },
        `${method} ${path} failed in ${duration}ms: ${errMessage}`
      );

      throw error;
    }
  };
};
