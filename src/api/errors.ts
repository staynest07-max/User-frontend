import type { ApiErrorBody } from './types';

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, code: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ApiErrorBody>;
  return candidate.success === false
    && typeof candidate.error?.code === 'string'
    && typeof candidate.error.message === 'string';
}
