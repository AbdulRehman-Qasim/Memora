import prisma from '../database/prisma';
import { AppError } from '../utils/api-error';

export interface CreateNoteInput {
  title: string;
  content: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
}

export const createNote = async (userId: string, data: CreateNoteInput) => {
  return prisma.note.create({
    data: {
      title: data.title,
      content: data.content,
      userId,
    },
  });
};

export const getNotes = async (userId: string) => {
  return prisma.note.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getNoteById = async (id: string, userId: string) => {
  const note = await prisma.note.findUnique({
    where: { id },
  });

  if (!note || note.userId !== userId) {
    throw new AppError('Note not found', 404);
  }

  return note;
};

export const updateNote = async (id: string, userId: string, data: UpdateNoteInput) => {
  await getNoteById(id, userId);

  return prisma.note.update({
    where: { id },
    data,
  });
};

export const deleteNote = async (id: string, userId: string) => {
  await getNoteById(id, userId);

  return prisma.note.delete({
    where: { id },
  });
};

export const importNotes = async (userId: string, notes: CreateNoteInput[]) => {
  return prisma.$transaction(async (tx) => {
    const createdNotes = [];
    for (const note of notes) {
      const created = await tx.note.create({
        data: {
          title: note.title,
          content: note.content,
          userId,
        },
      });
      createdNotes.push(created);
    }
    return createdNotes;
  });
};

