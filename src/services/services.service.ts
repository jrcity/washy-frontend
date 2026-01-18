import { api } from '@/lib/axios';
import type { 
  ApiResponse, 
  Service, 
  ServiceFilters, 
  CreateServiceInput,
  UpdateServiceInput,
  UpdatePricingInput,
  CalculatePriceInput,
  CalculatePriceResponse
} from '@/types';

/**
 * Get all services
 */
export const getServices = async (filters?: ServiceFilters): Promise<ApiResponse<Service[]>> => {
  const response = await api.get<ApiResponse<Service[]>>('/services', { params: filters });
  return response.data;
};

/**
 * Get active services
 */
export const getActiveServices = async (): Promise<ApiResponse<Service[]>> => {
  const response = await api.get<ApiResponse<Service[]>>('/services/active');
  return response.data;
};

/**
 * Get service catalog with pricing
 */
export const getServiceCatalog = async (): Promise<ApiResponse<Service[]>> => {
  const response = await api.get<ApiResponse<Service[]>>('/services/catalog');
  return response.data;
};

/**
 * Get service by ID
 */
export const getServiceById = async (id: string): Promise<ApiResponse<Service>> => {
  const response = await api.get<ApiResponse<Service>>(`/services/${id}`);
  return response.data;
};

/**
 * Get service by slug
 */
export const getServiceBySlug = async (slug: string): Promise<ApiResponse<Service>> => {
  const response = await api.get<ApiResponse<Service>>(`/services/slug/${slug}`);
  return response.data;
};

/**
 * Calculate price for order items
 */
export const calculatePrice = async (data: CalculatePriceInput): Promise<ApiResponse<CalculatePriceResponse>> => {
  const response = await api.post<ApiResponse<CalculatePriceResponse>>('/services/calculate-price', data);
  return response.data;
};

/**
 * Create a new service
 */
export const createService = async (data: CreateServiceInput): Promise<ApiResponse<Service>> => {
  const response = await api.post<ApiResponse<Service>>('/services', data);
  return response.data;
};

/**
 * Update service
 */
export const updateService = async (id: string, data: UpdateServiceInput): Promise<ApiResponse<Service>> => {
  const response = await api.patch<ApiResponse<Service>>(`/services/${id}`, data);
  return response.data;
};

/**
 * Update service pricing
 */
export const updateServicePricing = async (id: string, data: UpdatePricingInput): Promise<ApiResponse<Service>> => {
  const response = await api.patch<ApiResponse<Service>>(`/services/${id}/pricing`, data);
  return response.data;
};

/**
 * Delete service
 */
export const deleteService = async (id: string): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/services/${id}`);
  return response.data;
};

/**
 * Seed default services (super admin only)
 */
export const seedServices = async (): Promise<ApiResponse<void>> => {
  const response = await api.post<ApiResponse<void>>('/services/seed');
  return response.data;
};
