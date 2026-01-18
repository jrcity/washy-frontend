import type { GarmentType } from '@/types/order.types';

// Service Categories
export type ServiceCategory = 
  | 'laundry'
  | 'graphics_design'
  | 'dry_cleaning'
  | 'alteration'
  | 'shoe_care'
  | 'household';

// Service Types
export type ServiceType = 
  | 'wash_and_fold'
  | 'wash_and_iron'
  | 'dry_clean'
  | 'express'
  | 'starch'
  | 'iron_only';

// Service Pricing
export interface ServicePricing {
  garmentType: string;
  standardPrice: number;
  expressPrice: number | null;
}

// Estimated Duration
export interface EstimatedDuration {
  standard: number; // hours
  express: number; // hours
}

// Service
export interface Service {
  name: string;
  serviceType: ServiceType;
  estimatedDuration: EstimatedDuration;
  isExpressAvailable: boolean;
  pricing: ServicePricing[];
}

// Create Service Input
export interface CreateServiceInput {
  name: string;
  description: string;
  category?: ServiceCategory;
  serviceType: ServiceType;
  pricing: ServicePricing[];
  isExpressAvailable?: boolean;
}

// Update Service Input
export interface UpdateServiceInput {
  name?: string;
  description?: string;
  category?: ServiceCategory;
  serviceType?: ServiceType;
  isExpressAvailable?: boolean;
  isActive?: boolean;
}

// Update Pricing Input
export interface UpdatePricingInput {
  pricing: ServicePricing[];
}

// Service Filters
export interface ServiceFilters {
  category?: ServiceCategory;
  isActive?: boolean;
}

// Calculate Price Item
export interface CalculatePriceItem {
  garmentType: GarmentType;
  quantity: number;
  isExpress?: boolean;
}

// Calculate Price Input
export interface CalculatePriceInput {
  serviceId: string;
  items: CalculatePriceItem[];
}

// Calculate Price Response
export interface CalculatePriceResponse {
  items: {
    garmentType: GarmentType;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    isExpress: boolean;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

// Category
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
  updatedAt?: string;
}

// Create Category Input
export interface CreateCategoryInput {
  name: string;
  description: string;
  sortOrder?: number;
}

// Update Category Input
export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

// Category Filters
export interface CategoryFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
}
