import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { branchesService } from '@/services/branches.service';
import type { CreateBranchInput } from '@/types/branch.types';
import toast from 'react-hot-toast';

export const useBranches = (params?: {
  page?: number;
  limit?: number;
  isActive?: boolean;
  city?: string
}) => {
  return useQuery({
    queryKey: ['branches', params],
    queryFn: () => branchesService.getAll(params),
  });
};

export const useBranch = (id: string) => {
  return useQuery({
    queryKey: ['branch', id],
    queryFn: () => branchesService.getById(id),
    enabled: !!id,
  });
};

export const useBranchesByZone = (zone: string, state?: string) => {
  return useQuery({
    queryKey: ['branches-zone', zone, state],
    queryFn: () => branchesService.findByZone(zone, state),
    enabled: !!zone,
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBranchInput) => branchesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create branch');
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBranchInput> }) =>
      branchesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update branch');
    },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => branchesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete branch');
    },
  });
};

