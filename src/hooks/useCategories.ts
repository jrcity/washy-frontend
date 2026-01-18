import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import * as categoriesService from '@/services/categories.service';
import type { CategoryFilters, CreateCategoryInput, UpdateCategoryInput } from '@/types';
import toast from 'react-hot-toast';

/**
 * Hook for fetching all categories
 */
export const useCategories = (filters?: CategoryFilters) => {
  return useQuery({
    queryKey: queryKeys.categories.list(filters),
    queryFn: async () => {
      const response = await categoriesService.getCategories(filters);
      return response.data;
    },
  });
};

/**
 * Hook for fetching active categories
 */
export const useActiveCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.active(),
    queryFn: async () => {
      const response = await categoriesService.getActiveCategories();
      return response.data;
    },
  });
};

/**
 * Hook for fetching a single category
 */
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: async () => {
      const response = await categoriesService.getCategoryById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook for creating a category
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryInput) => categoriesService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast.success('Category created successfully!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to create category');
    },
  });
};

/**
 * Hook for updating a category
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) => 
      categoriesService.updateCategory(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast.success('Category updated successfully!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to update category');
    },
  });
};

/**
 * Hook for deleting a category
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast.success('Category deleted successfully!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to delete category');
    },
  });
};

/**
 * Hook for uploading category image
 */
export const useUploadCategoryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, image }: { id: string; image: File }) => 
      categoriesService.uploadCategoryImage(id, image),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast.success('Image uploaded successfully!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to upload image');
    },
  });
};
