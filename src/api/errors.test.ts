import { describe, expect, it } from 'vitest';
import { ApiError, isApiErrorBody } from './errors';

describe('API errors', () => {
  it('recognizes the backend error envelope', () => {
    expect(isApiErrorBody({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid' } })).toBe(true);
    expect(isApiErrorBody({ success: true, data: null })).toBe(false);
  });

  it('preserves normalized error context', () => {
    const error = new ApiError('Invalid', 'VALIDATION_ERROR', 400, [{ path: 'phone' }]);
    expect(error).toMatchObject({ name: 'ApiError', code: 'VALIDATION_ERROR', status: 400 });
  });
});
