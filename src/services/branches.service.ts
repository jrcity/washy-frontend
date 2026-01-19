import { api } from '@/lib/axios';
import type { 
  ApiResponse, 
  Branch, 
  CreateBranchInput, 
  PaginationType
} from '@/types';

export const branchesService = {
  // Get all branches
  getAll: async (params?: { 
    page?: number; 
    limit?: number; 
    isActive?: boolean; 
    city?: string 
  }): Promise<{ branches: Branch[]; pagination: PaginationType }> => {
    const response = await api.get<ApiResponse<{ branches: Branch[]; pagination: PaginationType }>>('/branches', { params });
    return response.data.data!;
  },

  // Get by ID
  getById: async (id: string): Promise<Branch> => {
    const response = await api.get<ApiResponse<Branch>>(`/branches/${id}`);
    return response.data.data!; // Check if standard response or direct object
  },

  // Find by Zone
  findByZone: async (zone: string, state?: string): Promise<Branch[]> => {
    const response = await api.get<ApiResponse<Branch[]>>('/branches/find-by-zone', { 
      params: { zone, state } 
    });
    return response.data.data!;
  },

  // Create branch
  create: async (data: CreateBranchInput): Promise<void> => {
    await api.post('/branches', data);
  },

  // Update branch
  update: async (id: string, data: Partial<CreateBranchInput>): Promise<void> => {
    await api.patch(`/branches/${id}`, data);
  },

  // Delete branch
  delete: async (id: string): Promise<void> => {
    await api.delete(`/branches/${id}`);
  },

  // Assign Manager
  assignManager: async (id: string, managerId: string): Promise<void> => {
    await api.post(`/branches/${id}/assign-manager`, { managerId });
  },

  // Add Coverage Zones
  addCoverageZones: async (id: string, zones: { name: string; state: string }[]): Promise<void> => {
    await api.post(`/branches/${id}/coverage-zones`, { zones });
  },
  
  // Assign Staff
  assignStaff: async (id: string, staffId: string): Promise<void> => {
    await api.post(`/branches/${id}/assign-staff`, { staffId });
  }
};
