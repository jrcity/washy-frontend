import { useQuery } from '@tanstack/react-query';
import { branchesService } from '@/services/branches.service';

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
