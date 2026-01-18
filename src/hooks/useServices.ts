import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import * as servicesService from '@/services/services.service';
import type { 
  ServiceFilters, 
  CreateServiceInput, 
  UpdateServiceInput,
  UpdatePricingInput,
  CalculatePriceInput
} from '@/types';
import toast from 'react-hot-toast';

/**
 * Hook for fetching all services
 */
export const useServices = (filters?: ServiceFilters) => {
  return useQuery({
    queryKey: queryKeys.services.list(filters),
    queryFn: async () => {
      const response = await servicesService.getServices(filters);
      return response.data;
    },
  });
};

/**
 * Hook for fetching active services
 */
export const useActiveServices = () => {
  return useQuery({
    queryKey: queryKeys.services.active(),
    queryFn: async () => {
      const response = await servicesService.getActiveServices();
      return response.data;
    },
  });
};

/**
 * Hook for fetching service catalog
 */
export const useServiceCatalog = () => {
  return useQuery({
    queryKey: queryKeys.services.catalog(),
    queryFn: async () => {
      const response = await servicesService.getServiceCatalog();
      return response.data;
    },
  });
};

/**
 * Hook for fetching a single service
 */
export const useService = (id: string) => {
  return useQuery({
    queryKey: queryKeys.services.detail(id),
    queryFn: async () => {
      const response = await servicesService.getServiceById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook for fetching service by slug
 */
export const useServiceBySlug = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.services.bySlug(slug),
    queryFn: async () => {
      const response = await servicesService.getServiceBySlug(slug);
      return response.data;
    },
    enabled: !!slug,
  });
};

/**
 * Hook for calculating price
 */
export const useCalculatePrice = () => {
  return useMutation({
    mutationFn: (data: CalculatePriceInput) => servicesService.calculatePrice(data),
  });
};

/**
 * Hook for creating a service
 */
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceInput) => servicesService.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success('Service created successfully!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to create service');
    },
  });
};

/**
 * Hook for updating a service
 */
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceInput }) => 
      servicesService.updateService(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success('Service updated successfully!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to update service');
    },
  });
};

/**
 * Hook for updating service pricing
 */
export const useUpdateServicePricing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePricingInput }) => 
      servicesService.updateServicePricing(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success('Pricing updated successfully!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to update pricing');
    },
  });
};

/**
 * Hook for deleting a service
 */
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => servicesService.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success('Service deleted successfully!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to delete service');
    },
  });
};
