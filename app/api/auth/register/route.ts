import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validations/schemas';
import * as authService from '@/lib/services/auth.service';
import { handleApiError } from '@/lib/utils/api-error';
import { validateOrigin } from '@/lib/auth/auth';
import { withHttpLogging } from '@/lib/logger/http-logger';
import logger from '@/lib/logger/logger';

export const POST = withHttpLogging(async (request: NextRequest): Promise<NextResponse> => {
  try {
    validateOrigin(request);
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const user = await authService.registerUser(
      validatedData.name,
      validatedData.email,
      validatedData.password
    );

    logger.info({ userId: user.id }, 'User registered successfully');

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 201 }
    );
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    logger.warn({ error: errMessage }, 'User registration failed');
    return handleApiError(error);
  }
});
