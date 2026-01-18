import { api, createFormData } from '@/lib/axios';
import type { 
  ApiResponse, 
  Upload, 
  UploadFilters, 
  UploadCategory,
  RelatedModel,
  Pagination
} from '@/types';

interface UploadsResponse {
  uploads: Upload[];
  pagination: Pagination;
}

/**
 * Upload a single file
 */
export const uploadFile = async (
  file: File, 
  category: UploadCategory,
  relatedModel?: RelatedModel,
  relatedId?: string
): Promise<ApiResponse<Upload>> => {
  const formData = createFormData({ file, category, relatedModel, relatedId });
  const response = await api.post<ApiResponse<Upload>>('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Upload multiple files
 */
export const uploadMultipleFiles = async (
  files: File[], 
  category: UploadCategory,
  relatedModel?: RelatedModel,
  relatedId?: string
): Promise<ApiResponse<Upload[]>> => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  formData.append('category', category);
  if (relatedModel) formData.append('relatedModel', relatedModel);
  if (relatedId) formData.append('relatedId', relatedId);
  
  const response = await api.post<ApiResponse<Upload[]>>('/uploads/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Get upload by ID
 */
export const getUploadById = async (id: string): Promise<ApiResponse<Upload>> => {
  const response = await api.get<ApiResponse<Upload>>(`/uploads/${id}`);
  return response.data;
};

/**
 * Get all uploads (admin)
 */
export const getUploads = async (filters?: UploadFilters): Promise<ApiResponse<UploadsResponse>> => {
  const response = await api.get<ApiResponse<UploadsResponse>>('/uploads', { params: filters });
  return response.data;
};

/**
 * Delete upload
 */
export const deleteUpload = async (id: string): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/uploads/${id}`);
  return response.data;
};
