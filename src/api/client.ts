import { getApiBaseUrl } from '@/config/env';
import { ApiError, isApiErrorBody } from './errors';
import type { ApiSuccess, HttpMethod } from './types';

const DEFAULT_TIMEOUT_MS = 15_000;
let accessToken: string | null = null;
let refreshPromise: Promise<void> | null = null;

interface AuthRecoveryHandler {
  refreshAccessToken: () => Promise<void>;
  onSessionInvalid: () => Promise<void> | void;
}

let authRecoveryHandler: AuthRecoveryHandler | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function clearAccessToken(): void {
  accessToken = null;
}

export function configureAuthRecovery(handler: AuthRecoveryHandler): () => void {
  authRecoveryHandler = handler;
  return () => {
    if (authRecoveryHandler === handler) authRecoveryHandler = null;
  };
}

export interface ApiRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeoutMs?: number;
  authenticated?: boolean;
  skipAuthRefresh?: boolean;
}

function endpointUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

export async function apiRequest<TResponse, TBody = unknown>(
  path: string,
  options: ApiRequestOptions<TBody> = {}
): Promise<ApiSuccess<TResponse>> {
  try {
    return await executeRequest<TResponse, TBody>(path, options);
  } catch (error) {
    const recovery = authRecoveryHandler;
    const canRecover = error instanceof ApiError
      && error.status === 401
      && options.authenticated !== false
      && !options.skipAuthRefresh
      && recovery;

    if (!canRecover) throw error;

    try {
      refreshPromise ??= recovery.refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      await refreshPromise;
      return await executeRequest<TResponse, TBody>(path, { ...options, skipAuthRefresh: true });
    } catch (refreshError) {
      await recovery.onSessionInvalid();
      throw refreshError;
    }
  }
}

async function executeRequest<TResponse, TBody = unknown>(
  path: string,
  options: ApiRequestOptions<TBody>
): Promise<ApiSuccess<TResponse>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  const abortFromCaller = () => controller.abort();
  options.signal?.addEventListener('abort', abortFromCaller, { once: true });

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...options.headers,
  };
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  if (options.authenticated !== false && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(endpointUrl(path), {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal,
    });

    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok || isApiErrorBody(payload)) {
      if (isApiErrorBody(payload)) {
        throw new ApiError(payload.error.message, payload.error.code, response.status, payload.error.details);
      }
      throw new ApiError(`Request failed with status ${response.status}`, 'HTTP_ERROR', response.status);
    }

    if (!payload || typeof payload !== 'object' || (payload as { success?: unknown }).success !== true) {
      throw new ApiError('Backend returned an invalid response envelope', 'INVALID_RESPONSE', response.status);
    }
    return payload as ApiSuccess<TResponse>;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (controller.signal.aborted) {
      throw new ApiError('Request timed out or was cancelled', 'REQUEST_ABORTED', 0, error);
    }
    throw new ApiError(error instanceof Error ? error.message : 'Network request failed', 'NETWORK_ERROR', 0, error);
  } finally {
    clearTimeout(timeoutId);
    options.signal?.removeEventListener('abort', abortFromCaller);
  }
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'GET' }),
  post: <T, B = unknown>(path: string, body?: B, options?: Omit<ApiRequestOptions<B>, 'method' | 'body'>) =>
    apiRequest<T, B>(path, { ...options, method: 'POST', body }),
  patch: <T, B = unknown>(path: string, body?: B, options?: Omit<ApiRequestOptions<B>, 'method' | 'body'>) =>
    apiRequest<T, B>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'DELETE' }),
};
