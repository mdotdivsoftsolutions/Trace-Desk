import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export interface ApiResponseEnvelope<T = any> {
  success: boolean;
  message?: string;
  data?: T | null;
  errors?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
}

/**
 * Returns a standardized success JSON response.
 */
export function apiSuccess<T>(
  data: T,
  message = 'Success',
  status = 200,
  meta?: ApiResponseEnvelope<T>['meta']
): NextResponse<ApiResponseEnvelope<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      errors: null,
      ...(meta ? { meta } : {}),
    },
    { status }
  );
}

/**
 * Returns a standardized error JSON response.
 */
export function apiError(
  message = 'Internal Server Error',
  status = 500,
  errors?: any
): NextResponse<ApiResponseEnvelope<null>> {
  return NextResponse.json(
    {
      success: false,
      message,
      data: null,
      errors: errors || null,
    },
    { status }
  );
}

/**
 * Catches errors and formats them into a standard API error response.
 */
export function handleApiError(error: unknown): NextResponse<ApiResponseEnvelope<null>> {
  if (error instanceof ZodError) {
    const formattedErrors = error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return apiError('Validation failed', 422, formattedErrors);
  }

  if (error instanceof Error) {
    // Handle Mongoose duplicate key error (code 11000)
    if ((error as any).code === 11000) {
      const field = Object.keys((error as any).keyValue || {})[0] || 'field';
      return apiError(`A record with this ${field} already exists.`, 409, {
        duplicateField: field,
      });
    }

    // Handle Mongoose CastError (invalid ObjectId)
    if ((error as any).name === 'CastError') {
      return apiError(`Invalid format for parameter: ${(error as any).path}`, 400);
    }

    return apiError(error.message, 500);
  }

  return apiError('An unexpected error occurred', 500);
}
