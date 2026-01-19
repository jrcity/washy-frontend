export type ServiceCategory = 'laundry' | 'graphics_design' | 'dry_cleaning' | 'alteration' | 'shoe_care' | 'household';
export type ServiceType = 'wash_and_fold' | 'wash_and_iron' | 'dry_clean' | 'express' | 'starch' | 'iron_only';
export type GarmentType = 'shirt' | 'trouser' | 'suit' | 'dress' | 'duvet' | 'curtain' | 'bedsheet' | 'towel' | 'skirt' | 'underwear' | 'blanket' | 'jacket' | 'native_attire' | 'other';

export interface ServicePricing {
  garmentType: GarmentType;
  basePrice: number;
  expressMultiplier: number;
}

export interface Service {
  _id: string; 
  name: string;
  slug: string;
  description: string;
  category: ServiceCategory;
  serviceType: ServiceType;
  pricing: ServicePricing[];
  estimatedDuration: {
    standard: number;
    express: number;
  };
  isExpressAvailable: boolean;
  branch?: string; // ObjectId
  isActive: boolean;
  icon?: string;
  imageUrl?: string;
  imagePublicId?: string;
  sortOrder: number;
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
  icon?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  imagePublicId?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  description: string;
  slug: string;
  isActive?: boolean;
  sortOrder?: number;
  imageUrl?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

export interface CategoryFilters {
  isActive?: boolean;
  search?: string;
}
