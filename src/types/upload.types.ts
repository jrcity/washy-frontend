// Upload Categories
export type UploadCategory = 
  | 'service_image'
  | 'category_image'
  | 'pickup_screenshot'
  | 'delivery_screenshot'
  | 'proof_photo'
  | 'other';

// Related Models
export type RelatedModel = 
  | 'Service'
  | 'Category'
  | 'Order';

// Upload
export interface Upload {
  _id: string;
  url: string;
  publicId: string;
  category: UploadCategory;
  originalName: string;
  format: string;
  size: number;
  width?: number;
  height?: number;
  uploadedBy: string;
  relatedModel?: RelatedModel;
  relatedId?: string;
  createdAt: string;
}

// Upload Input (for file uploads via FormData)
export interface UploadInput {
  file: File;
  category: UploadCategory;
  relatedModel?: RelatedModel;
  relatedId?: string;
}

// Upload Filters
export interface UploadFilters {
  page?: number;
  limit?: number;
  category?: UploadCategory;
  relatedModel?: RelatedModel;
  relatedId?: string;
}
