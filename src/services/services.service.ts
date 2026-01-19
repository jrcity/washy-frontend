import { api } from '@/lib/axios';
import type { 
  ApiResponse, 
  Service, 
  Category, 
  CreateServiceInput, 
  ServicePricing, 
  CreateCategoryInput,
  UpdateCategoryInput
} from '@/types';

export const servicesService = {
  // Get all services
  getAll: async (params?: { category?: string; isActive?: boolean }): Promise<Service[]> => {
    // Remove category if empty string to avoid backend validation error
    const cleanParams = { ...params };
    if (!cleanParams.category || cleanParams.category === '') {
      delete cleanParams.category;
    }
    const response = await api.get<ApiResponse<Service[]>>('/services', { params: cleanParams });
    return response.data.data!;
  },

  // Get active services
  getActive: async (): Promise<Service[]> => {
    const response = await api.get<ApiResponse<Service[]>>('/services/active');
    return response.data.data!; // This endpoint returns array directly in data if strictly following API doc, or object with data property. Assuming standard ApiResponse structure.
  },

  // Get service by slug
  getBySlug: async (slug: string): Promise<Service> => {
    const response = await api.get<ApiResponse<Service>>(`/services/slug/${slug}`);
    return response.data.data!; // API might return just data object, type adjustment might be needed
  },

  // Get catalog
  getCatalog: async (): Promise<Service[]> => {
    const response = await api.get<ApiResponse<Service[]>>('/services/catalog');
    return response.data.data!;
  },

  // Calculate price
  calculatePrice: async (data: { serviceId: string; items: any[] }): Promise<any> => {
    const response = await api.post<ApiResponse<any>>('/services/calculate-price', data);
    return response.data.data!;
  },

  // Create service (Admin)
  create: async (data: CreateServiceInput): Promise<void> => {
    await api.post('/services', data);
  },

  // Update pricing (Admin)
  updatePricing: async (id: string, pricing: ServicePricing[]): Promise<void> => {
    await api.patch(`/services/${id}/pricing`, { pricing });
  },

  // Categories
  getAllCategories: async (params?: { page?: number; limit?: number; isActive?: boolean }): Promise<Category[]> => {
     // Handling pagination response structure vs array
    const response = await api.get<ApiResponse<any>>('/categories', { params });
    return response.data.data?.categories || response.data.data!; 
  },

  getActiveCategories: async (): Promise<Category[]> => {
    const response = await api.get<ApiResponse<Category[]>>('/categories/active');
    return response.data.data!;
  },

  createCategory: async (data: CreateCategoryInput): Promise<Category> => {
    const response = await api.post<ApiResponse<Category>>('/categories', data);
    return response.data.data!;
  },

  updateCategory: async (id: string, data: UpdateCategoryInput): Promise<Category> => {
    const response = await api.patch<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data.data!;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  uploadCategoryImage: async (id: string, file: File): Promise<Category> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.patch<ApiResponse<Category>>(`/categories/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data!;
  }
};
