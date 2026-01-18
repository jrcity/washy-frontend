import type { Address } from './api.types';
import type { User } from './auth.types';

// Coverage Zone
export interface CoverageZone {
  name: string;
  state: string;
}

// Branch
export interface Branch {
  _id: string;
  name: string;
  code: string;
  address: Address;
  coverageZones: CoverageZone[];
  contactPhone: string;
  contactEmail: string;
  isActive: boolean;
  manager?: User;
  staff?: User[];
  createdAt: string;
  updatedAt?: string;
}

// Create Branch Input
export interface CreateBranchInput {
  name: string;
  code: string;
  address: Address;
  contactPhone: string;
  contactEmail: string;
  coverageZones?: CoverageZone[];
}

// Update Branch Input
export interface UpdateBranchInput {
  name?: string;
  address?: Address;
  contactPhone?: string;
  contactEmail?: string;
  isActive?: boolean;
}

// Add Coverage Zones Input
export interface AddCoverageZonesInput {
  zones: CoverageZone[];
}

// Assign Manager Input
export interface AssignManagerInput {
  managerId: string;
}

// Assign Staff Input
export interface AssignStaffInput {
  staffId: string;
}

// Branch Filters
export interface BranchFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
  city?: string;
}

// Branch Stats
export interface BranchStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalStaff: number;
  coverageZonesCount: number;
}

// Find Branch by Zone Params
export interface FindBranchByZoneParams {
  zone: string;
  state?: string;
}
