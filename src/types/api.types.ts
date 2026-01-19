// Common API Response Types

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: Pagination;
  };
}

export interface PaginatedMetaResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  meta: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type PaginationType = Pagination;

// Address Type
export interface Address {
  street: string;
  area: string;
  city: string;
  state: string;
  landmark?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// API Error Interface
export interface ApiError {
  name: string;
  message: string;
  statusCode: number;
  errors?: ValidationError[];
}

// Create an API error object
export const createApiError = (
  statusCode: number,
  message: string,
  errors?: ValidationError[]
): ApiError => ({
  name: 'ApiError',
  message,
  statusCode,
  errors,
});
