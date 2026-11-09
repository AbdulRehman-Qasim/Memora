import api from './api';
import axios from 'axios';
import { ApiResponse, ApiError, ValidationErrorItem } from '@/types/auth.types';
import { Note, CreateNoteData, UpdateNoteData } from '@/types/notes.types';

interface ApiErrorPayload {
  error?: unknown;
  message?: unknown;
  errors?: unknown;
}

function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidationErrorItem(value: unknown): value is ValidationErrorItem {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  return (
    (item['msg'] === undefined || typeof item['msg'] === 'string') &&
    (item['message'] === undefined || typeof item['message'] === 'string')
  );
}

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error) && error.response) {
    const payload: unknown = error.response.data;
    const status = error.response.status;

    if (isApiErrorPayload(payload)) {
      const { errors, error: errField, message } = payload;

      if (Array.isArray(errors) && errors.length > 0) {
        const validItems = errors.filter(isValidationErrorItem);
        if (validItems.length > 0) {
          const firstMsg = validItems[0].msg ?? validItems[0].message ?? 'Validation error';
          throw new ApiError(firstMsg, status, validItems);
        }
      }

      const errMsg =
        (typeof errField === 'string' && errField) ||
        (typeof message === 'string' && message) ||
        'An unexpected error occurred';
      throw new ApiError(errMsg, status);
    }

    throw new ApiError('An unexpected error occurred', status);
  }

  const genericMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  throw new ApiError(genericMessage);
};

const getNotes = async (): Promise<ApiResponse<Note[]>> => {
  try {
    const response = await api.get<ApiResponse<Note[]>>('/notes');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

const getNoteById = async (id: string): Promise<ApiResponse<Note>> => {
  try {
    const response = await api.get<ApiResponse<Note>>(`/notes/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

const createNote = async (noteData: CreateNoteData): Promise<ApiResponse<Note>> => {
  try {
    const response = await api.post<ApiResponse<Note>>('/notes', noteData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

const updateNote = async (id: string, noteData: UpdateNoteData): Promise<ApiResponse<Note>> => {
  try {
    const response = await api.patch<ApiResponse<Note>>(`/notes/${id}`, noteData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

const deleteNote = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await api.delete<ApiResponse>(`/notes/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

const importNotes = async (notes: CreateNoteData[]): Promise<ApiResponse<Note[]>> => {
  try {
    const response = await api.post<ApiResponse<Note[]>>('/notes/import', notes);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

const notesService = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  importNotes,
};

export default notesService;
