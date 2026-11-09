import { NextRequest, NextResponse } from 'next/server';
import { importNotesSchema } from '@/lib/validations/schemas';
import * as notesService from '@/lib/services/notes.service';
import { authenticateRequest, validateOrigin } from '@/lib/auth/auth';
import { handleApiError } from '@/lib/utils/api-error';
import { withHttpLogging } from '@/lib/logger/http-logger';
import logger from '@/lib/logger/logger';

export const POST = withHttpLogging(async (request: NextRequest): Promise<NextResponse> => {
  try {
    validateOrigin(request);
    const userPayload = authenticateRequest(request);

    const body = await request.json();
    const validatedNotes = importNotesSchema.parse(body);

    const createdNotes = await notesService.importNotes(userPayload.id, validatedNotes);
    logger.info({ userId: userPayload.id, count: createdNotes.length }, 'Notes imported');

    return NextResponse.json(
      {
        success: true,
        data: createdNotes,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
});
