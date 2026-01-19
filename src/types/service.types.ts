export type ServiceCategory = 'laundry' | 'graphics_design' | 'dry_cleaning' | 'alteration' | 'shoe_care' | 'household';
export type ServiceType = 'wash_and_fold' | 'wash_and_iron' | 'dry_clean' | 'express' | 'starch' | 'iron_only';

export interface ServicePricing {
  garmentType: string;
  standardPrice: number;
  expressPrice: number;
}

export interface Service {
  _id: string; 
  name: string;
  slug: string;
  description: string;
  serviceType: ServiceType;
  pricing: ServicePricing[];
  estimatedDuration: {
    standard: number;
    express: number;
  };
  isExpressAvailable: boolean;
  isActive: boolean;
  imageUrl?: string;
  imagePublicId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceInput {
  name: string;
  description: string;
  category: ServiceCategory;
  serviceType: ServiceType;
  pricing: ServicePricing[];
  isExpressAvailable?: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface CreateCategoryInput {
  name: string;
  description: string;
  slug: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

export interface CategoryFilters {
  isActive?: boolean;
  search?: string;
}
