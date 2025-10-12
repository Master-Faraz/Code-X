// src/lib/errorHandler.ts

export interface ErrorType {
  success: boolean;
  message: string;
  error?: unknown;
  statusCode?: number;
  context?: string;
}

export class AppError extends Error {
  statusCode: number;
  context?: string;
  originalError?: unknown;

  constructor({ message, error, statusCode = 500, context }: ErrorType) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.context = context;
    this.originalError = error;

    // Keep proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Logs and throws a standardized error.
 */
export function handleServerError(message: string, error?: unknown, context?: string, statusCode?: number): never {
  console.error(`[${context || 'ServerError'}] ${message}`, error instanceof Error ? error.stack : error);
  throw new AppError({ success: false, message, error, context, statusCode });
}
