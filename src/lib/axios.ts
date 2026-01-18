import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types';
import { getToken, clearAuthData } from '@/lib/storage';

// API Base URL - falls back to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      clearAuthData();
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Extract error message
    const message = error.response?.data?.message || error.message || 'An error occurred';
    const errors = error.response?.data?.errors;

    // Create enhanced error object
    const enhancedError = {
      ...error,
      message,
      errors,
      statusCode: error.response?.status,
    };

    return Promise.reject(enhancedError);
  }
);

// Helper to create FormData for file uploads
export const createFormData = (data: Record<string, unknown>): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File) {
          formData.append(key, item);
        } else {
          formData.append(`${key}[${index}]`, String(item));
        }
      });
    } else if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });
  
  return formData;
};

export default api;
