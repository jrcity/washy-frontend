import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { Branch } from '@/types/branch.types';

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
    // Assuming backend has this endpoint, else filter on frontend
    const response = await api.get<ApiResponse<Branch>>('/branches/nearest', { 
        params: { lat, lng } 
    });
    return response.data.data!;
  }
};
