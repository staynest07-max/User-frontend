export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  count?: number;
  [key: string]: unknown;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
  meta?: ApiMeta;
}

export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorBody;
export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';
