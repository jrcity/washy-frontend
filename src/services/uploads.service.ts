import { api } from '@/lib/axios';
import type { 
  ApiResponse, 
  Upload, 
  UploadInput 
} from '@/types';

export const uploadsService = {
  // Upload single file
  upload: async (data: UploadInput): Promise<Upload> => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('category', data.category);
    if (data.relatedModel) formData.append('relatedModel', data.relatedModel);
    if (data.relatedId) formData.append('relatedId', data.relatedId);

    const response = await api.post<ApiResponse<Upload>>('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data!;
  },

  // Upload multiple files
  uploadMultiple: async (data: { 
    files: File[]; 
    category: UploadInput['category'];
    relatedModel?: UploadInput['relatedModel'];
    relatedId?: string;
  }): Promise<Upload[]> => {
    const formData = new FormData();
    data.files.forEach((file) => formData.append('files', file));
    formData.append('category', data.category);
    if (data.relatedModel) formData.append('relatedModel', data.relatedModel);
    if (data.relatedId) formData.append('relatedId', data.relatedId);

    const response = await api.post<ApiResponse<Upload[]>>('/uploads/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data!;
  },

  // Delete upload
  delete: async (id: string): Promise<void> => {
    await api.delete(`/uploads/${id}`);
  }
};
