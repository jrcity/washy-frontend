import { api } from '@/lib/axios';
import type { ApiResponse, User, Pagination } from '@/types';

export const usersService = {
  getAll: async (params?: { 
    page?: number; 
    limit?: number; 
    role?: string; 
    branchId?: string;
    search?: string;
  }): Promise<{ users: User[]; pagination: Pagination }> => {
    const response = await api.get<ApiResponse<{ users: User[]; pagination: Pagination }>>('/users', { params });
    return response.data.data!;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data!;
  },

  // Typically creation is done via Auth (Register), but Admin might create users too
  create: async (data: Partial<User>): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/users', data);
    return response.data.data!;
  },
  
  update: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data!;
  }
};
