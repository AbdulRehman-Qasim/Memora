import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/utils/api-error';
import { getClearCookieOptions, validateOrigin } from '@/lib/auth/auth';
import { withHttpLogging } from '@/lib/logger/http-logger';
import logger from '@/lib/logger/logger';

export const POST = withHttpLogging(async (request: NextRequest): Promise<NextResponse> => {
  try {
    validateOrigin(request);

    logger.info('User logged out successfully');

    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    );

    response.cookies.set('jwt', '', getClearCookieOptions());

    return response;
  } catch (error) {
    return handleApiError(error);
  }
});
