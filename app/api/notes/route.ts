import { NextRequest, NextResponse } from 'next/server';
import { createNoteSchema } from '@/lib/validations/schemas';
import * as notesService from '@/lib/services/notes.service';
import { authenticateRequest, validateOrigin } from '@/lib/auth/auth';
import { handleApiError } from '@/lib/utils/api-error';
import { withHttpLogging } from '@/lib/logger/http-logger';
import logger from '@/lib/logger/logger';

export const GET = withHttpLogging(async (request: NextRequest): Promise<NextResponse> => {
  try {
    const userPayload = authenticateRequest(request);
    const notes = await notesService.getNotes(userPayload.id);

    return NextResponse.json(
      {
        success: true,
        data: notes,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
});

export const POST = withHttpLogging(async (request: NextRequest): Promise<NextResponse> => {
  try {
    validateOrigin(request);
    const userPayload = authenticateRequest(request);

    const body = await request.json();
    const validatedData = createNoteSchema.parse(body);

    const note = await notesService.createNote(userPayload.id, validatedData);
    logger.info({ userId: userPayload.id, noteId: note.id }, 'Note created');

    return NextResponse.json(
      {
        success: true,
        data: note,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
});
