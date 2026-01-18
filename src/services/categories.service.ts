import { api, createFormData } from '@/lib/axios';
import type { 
  ApiResponse, 
  Category, 
  CategoryFilters, 
  CreateCategoryInput,
  UpdateCategoryInput,
  Pagination
} from '@/types';

interface CategoriesResponse {
  categories: Category[];
  pagination: Pagination;
}

/**
 * Get all categories
 */
export const getCategories = async (filters?: CategoryFilters): Promise<ApiResponse<CategoriesResponse>> => {
  const response = await api.get<ApiResponse<CategoriesResponse>>('/categories', { params: filters });
  return response.data;
};

/**
 * Get active categories
 */
export const getActiveCategories = async (): Promise<ApiResponse<Category[]>> => {
  const response = await api.get<ApiResponse<Category[]>>('/categories/active');
  return response.data;
};

/**
 * Get category by ID
 */
export const getCategoryById = async (id: string): Promise<ApiResponse<Category>> => {
  const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
  return response.data;
};

/**
 * Create a new category
 */
export const createCategory = async (data: CreateCategoryInput): Promise<ApiResponse<Category>> => {
  const response = await api.post<ApiResponse<Category>>('/categories', data);
  return response.data;
};

/**
 * Update category
 */
export const updateCategory = async (id: string, data: UpdateCategoryInput): Promise<ApiResponse<Category>> => {
  const response = await api.patch<ApiResponse<Category>>(`/categories/${id}`, data);
  return response.data;
};

/**
 * Delete category
 */
export const deleteCategory = async (id: string): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/categories/${id}`);
  return response.data;
};

/**
 * Upload category image
 */
export const uploadCategoryImage = async (id: string, image: File): Promise<ApiResponse<Category>> => {
  const formData = createFormData({ image });
  const response = await api.patch<ApiResponse<Category>>(`/categories/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
