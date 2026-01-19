import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { usersService } from '@/services/users.service';

export const useUsers = (params?: { 
  page?: number; 
  limit?: number; 
  role?: string; 
  branchId?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersService.getAll(params),
    placeholderData: keepPreviousData,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersService.getById(id),
    enabled: !!id,
  });
};
