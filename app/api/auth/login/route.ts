import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations/schemas';
import * as authService from '@/lib/services/auth.service';
import { handleApiError } from '@/lib/utils/api-error';
import { getCookieOptions, validateOrigin } from '@/lib/auth/auth';
import { withHttpLogging } from '@/lib/logger/http-logger';
import logger from '@/lib/logger/logger';

export const POST = withHttpLogging(async (request: NextRequest): Promise<NextResponse> => {
  try {
    validateOrigin(request);
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const { token, user } = await authService.loginUser(
      validatedData.email,
      validatedData.password
    );

    logger.info({ userId: user.id }, 'User logged in successfully');

    const response = NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );

    response.cookies.set('jwt', token, getCookieOptions());

    return response;
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    logger.warn({ error: errMessage }, 'User login failed');
    return handleApiError(error);
  }
});
