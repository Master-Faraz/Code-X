// src/lib/responseHandler.ts

interface SuccessResponse<T = any> {
  success: true;
  message: string;
  data?: T;
  statusCode?: number;
  context?: string;
  //   timestamp: string;
}

interface ErrorResponse {
  success: false;
  message: string;
  error?: any;
  statusCode?: number;
  context?: string;
  //   timestamp: string;
}

export function createSuccessResponse<T = any>(message: string, data?: T, context?: string, statusCode: number = 200): SuccessResponse<T> {
  return {
    success: true,
    message,
    data,
    statusCode,
    context
  };
}

export function createErrorResponse(message: string, error?: any, context?: string, statusCode: number = 500): ErrorResponse {
  return {
    success: false,
    message,
    error: error instanceof Error ? error.message : error,
    statusCode,
    context
  };
}
