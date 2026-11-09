import { NextRequest, NextResponse } from 'next/server';
import * as authService from '@/lib/services/auth.service';
import { authenticateRequest } from '@/lib/auth/auth';
import { handleApiError } from '@/lib/utils/api-error';
import { withHttpLogging } from '@/lib/logger/http-logger';

export const GET = withHttpLogging(async (request: NextRequest): Promise<NextResponse> => {
  try {
    const userPayload = authenticateRequest(request);
    const user = await authService.getCurrentUser(userPayload.id);

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
});
