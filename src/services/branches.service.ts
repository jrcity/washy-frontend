import { api } from '@/lib/axios';
import type { 
  ApiResponse, 
  Branch, 
  BranchFilters, 
  CreateBranchInput,
  UpdateBranchInput,
  AddCoverageZonesInput,
  AssignManagerInput,
  AssignStaffInput,
  BranchStats,
  FindBranchByZoneParams,
  Pagination
} from '@/types';

interface BranchesResponse {
  branches: Branch[];
  pagination: Pagination;
}

/**
 * Get all branches
 */
export const getBranches = async (filters?: BranchFilters): Promise<ApiResponse<BranchesResponse>> => {
  const response = await api.get<ApiResponse<BranchesResponse>>('/branches', { params: filters });
  return response.data;
};

/**
 * Get branch by ID
 */
export const getBranchById = async (id: string): Promise<ApiResponse<Branch>> => {
  const response = await api.get<ApiResponse<Branch>>(`/branches/${id}`);
  return response.data;
};

/**
 * Find branches by zone
 */
export const findBranchesByZone = async (params: FindBranchByZoneParams): Promise<ApiResponse<Branch[]>> => {
  const response = await api.get<ApiResponse<Branch[]>>('/branches/find-by-zone', { params });
  return response.data;
};

/**
 * Create a new branch
 */
export const createBranch = async (data: CreateBranchInput): Promise<ApiResponse<Branch>> => {
  const response = await api.post<ApiResponse<Branch>>('/branches', data);
  return response.data;
};

/**
 * Update branch
 */
export const updateBranch = async (id: string, data: UpdateBranchInput): Promise<ApiResponse<Branch>> => {
  const response = await api.patch<ApiResponse<Branch>>(`/branches/${id}`, data);
  return response.data;
};

/**
 * Delete branch
 */
export const deleteBranch = async (id: string): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/branches/${id}`);
  return response.data;
};

/**
 * Assign manager to branch
 */
export const assignManager = async (id: string, data: AssignManagerInput): Promise<ApiResponse<Branch>> => {
  const response = await api.post<ApiResponse<Branch>>(`/branches/${id}/assign-manager`, data);
  return response.data;
};

/**
 * Add coverage zones to branch
 */
export const addCoverageZones = async (id: string, data: AddCoverageZonesInput): Promise<ApiResponse<Branch>> => {
  const response = await api.post<ApiResponse<Branch>>(`/branches/${id}/coverage-zones`, data);
  return response.data;
};

/**
 * Assign staff to branch
 */
export const assignStaff = async (id: string, data: AssignStaffInput): Promise<ApiResponse<Branch>> => {
  const response = await api.post<ApiResponse<Branch>>(`/branches/${id}/assign-staff`, data);
  return response.data;
};

/**
 * Get branch statistics
 */
export const getBranchStats = async (id: string): Promise<ApiResponse<BranchStats>> => {
  const response = await api.get<ApiResponse<BranchStats>>(`/branches/${id}/stats`);
  return response.data;
};
