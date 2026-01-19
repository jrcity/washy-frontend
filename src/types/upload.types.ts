export type UploadCategory = 'service_image' | 'category_image' | 'pickup_screenshot' | 'delivery_screenshot' | 'proof_photo' | 'other';
export type RelatedModel = 'Service' | 'Category' | 'Order';

export interface Upload {
  _id: string;
  url: string;
  publicId: string;
  category: UploadCategory;
  originalName: string;
  format: string;
  size: number;
  width: number;
  height: number;
  uploadedBy: string;
  relatedModel?: RelatedModel;
  relatedId?: string;
  createdAt: string;
}

export interface UploadInput {
  file: File;
  category: UploadCategory;
  relatedModel?: RelatedModel;
  relatedId?: string;
}
