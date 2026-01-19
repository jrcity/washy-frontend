import { useQuery } from '@tanstack/react-query';
import { servicesService } from '@/services/services.service';

export const useServices = (params?: { category?: string; isActive?: boolean }) => {
  return useQuery({
    queryKey: ['services', params],
    queryFn: () => servicesService.getAll(params),
  });
};

export const useActiveServices = () => {
  return useQuery({
    queryKey: ['active-services'],
    queryFn: () => servicesService.getActive(),
  });
};

export const useServiceCatalog = () => {
  return useQuery({
    queryKey: ['service-catalog'],
    queryFn: () => servicesService.getCatalog(),
  });
};


