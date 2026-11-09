import { NextRequest, NextResponse } from 'next/server';
import { updateNoteSchema } from '@/lib/validations/schemas';
import * as notesService from '@/lib/services/notes.service';
import { authenticateRequest, validateOrigin } from '@/lib/auth/auth';
import { handleApiError } from '@/lib/utils/api-error';
import { withHttpLogging } from '@/lib/logger/http-logger';
import logger from '@/lib/logger/logger';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const GET = withHttpLogging(async (request: NextRequest, context: RouteContext): Promise<NextResponse> => {
  try {
    const userPayload = authenticateRequest(request);
    const { id } = await context.params;

    const note = await notesService.getNoteById(id, userPayload.id);

    return NextResponse.json(
      {
        success: true,
        data: note,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
});

export const PATCH = withHttpLogging(async (request: NextRequest, context: RouteContext): Promise<NextResponse> => {
  try {
    validateOrigin(request);
    const userPayload = authenticateRequest(request);
    const { id } = await context.params;

    const body = await request.json();
    const validatedData = updateNoteSchema.parse(body);

    const updatedNote = await notesService.updateNote(id, userPayload.id, validatedData);
    logger.info({ userId: userPayload.id, noteId: id }, 'Note updated');

    return NextResponse.json(
      {
        success: true,
        data: updatedNote,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
});

export const DELETE = withHttpLogging(async (request: NextRequest, context: RouteContext): Promise<NextResponse> => {
  try {
    validateOrigin(request);
    const userPayload = authenticateRequest(request);
    const { id } = await context.params;

    const deletedNote = await notesService.deleteNote(id, userPayload.id);
    logger.info({ userId: userPayload.id, noteId: id }, 'Note deleted');

    return NextResponse.json(
      {
        success: true,
        data: deletedNote,
        message: 'Note deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
});
