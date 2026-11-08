import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import logger from '../logger/logger';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const handleApiError = (error: unknown) => {
  logger.error(error);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = error.errors.map((e) => e.message).join(', ');
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    message = 'Database request error';
    if (error.code === 'P2002') {
      message = 'Unique constraint failed on the database';
    } else if (error.code === 'P2024') {
      statusCode = 503;
      message = 'Service Unavailable';
    }
  } else if (
    error instanceof Prisma.PrismaClientInitializationError ||
    (error instanceof Error && error.message.includes('DATABASE_URL'))
  ) {
    statusCode = 503;
    message = 'Database connection error: DATABASE_URL is missing or invalid. Please configure your DATABASE_URL in .env';
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Database validation error';
  } else if (error instanceof Error) {
    if (process.env.NODE_ENV !== 'production') {
      message = error.message;
    }
  }

  return NextResponse.json(
    {
      success: false,
      error: message,
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
    },
    { status: statusCode }
  );
};

