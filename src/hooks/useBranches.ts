import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import * as branchesService from '@/services/branches.service';
import type { 
  BranchFilters, 
  CreateBranchInput, 
  UpdateBranchInput,
  AddCoverageZonesInput,
  AssignManagerInput,
  AssignStaffInput,
  FindBranchByZoneParams
} from '@/types';
import toast from 'react-hot-toast';

/**
 * Hook for fetching all branches
 */
export const useBranches = (filters?: BranchFilters) => {
  return useQuery({
    queryKey: queryKeys.branches.list(filters),
    queryFn: async () => {
      const response = await branchesService.getBranches(filters);
      return response.data;
    },
  });
};

/**
 * Hook for fetching a single branch
 */
export const useBranch = (id: string) => {
  return useQuery({
    queryKey: queryKeys.branches.detail(id),
    queryFn: async () => {
      const response = await branchesService.getBranchById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook for finding branches by zone
 */
export const useBranchesByZone = (params: FindBranchByZoneParams) => {
  return useQuery({
    queryKey: queryKeys.branches.byZone(params.zone, params.state),
    queryFn: async () => {
      const response = await branchesService.findBranchesByZone(params);
      return response.data;
    },
    enabled: !!params.zone,
  });
};

/**
 * Hook for fetching branch statistics
 */
export const useBranchStats = (id: string) => {
  return useQuery({
    queryKey: queryKeys.branches.stats(id),
    queryFn: async () => {
      const response = await branchesService.getBranchStats(id);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook for creating a branch
 */
export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBranchInput) => branchesService.createBranch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.all });
      toast.success('Branch created successfully!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to create branch');
    },
  });
};

/**
 * Hook for updating a branch
 */
export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBranchInput }) => 
      branchesService.updateBranch(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.all });
      toast.success('Branch updated successfully!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to update branch');
    },
  });
};

/**
 * Hook for deleting a branch
 */
export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => branchesService.deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.all });
      toast.success('Branch deleted successfully!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to delete branch');
    },
  });
};

/**
 * Hook for assigning manager to branch
 */
export const useAssignBranchManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignManagerInput }) => 
      branchesService.assignManager(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.detail(id) });
      toast.success('Manager assigned successfully!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to assign manager');
    },
  });
};

/**
 * Hook for adding coverage zones
 */
export const useAddCoverageZones = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddCoverageZonesInput }) => 
      branchesService.addCoverageZones(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.detail(id) });
      toast.success('Coverage zones added!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to add zones');
    },
  });
};

/**
 * Hook for assigning staff to branch
 */
export const useAssignBranchStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignStaffInput }) => 
      branchesService.assignStaff(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.detail(id) });
      toast.success('Staff assigned successfully!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to assign staff');
    },
  });
};
