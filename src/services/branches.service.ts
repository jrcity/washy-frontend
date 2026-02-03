import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { Branch, CreateBranchInput } from '@/types/branch.types';

export const branchesService = {
  getAll: async (params?: { isActive?: boolean; city?: string }) => {
    const response = await api.get<ApiResponse<Branch[]>>('/branches', { params });
    return response.data.data!;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Branch>>(`/branches/${id}`);
    return response.data.data!;
  },

  getNearest: async (lat: number, lng: number) => {
    const response = await api.get<ApiResponse<Branch>>('/branches/nearest', {
      params: { lat, lng }
    });
    return response.data.data!;
  },

  findByZone: async (zone: string, state?: string) => {
    const params: Record<string, string> = { zone };
    if (state) params.state = state;
    const response = await api.get<ApiResponse<Branch[]>>('/branches', { params });
    return response.data.data!;
  },

  create: async (data: CreateBranchInput) => {
    const response = await api.post<ApiResponse<Branch>>('/branches', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<CreateBranchInput>) => {
    const response = await api.patch<ApiResponse<Branch>>(`/branches/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/branches/${id}`);
    return response.data;
  },
};

