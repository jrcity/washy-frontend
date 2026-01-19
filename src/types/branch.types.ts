import type { Address } from './auth.types';

export interface CoverageZone {
  name: string;
  state: string;
}

export interface Branch {
  _id: string;
  name: string;
  code: string;
  address: Address;
  coverageZones: CoverageZone[];
  contactPhone: string;
  contactEmail: string;
  isActive: boolean;
  manager?: string; 
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchInput {
  name: string;
  code: string;
  address: Address;
  contactPhone: string;
  contactEmail: string;
  coverageZones: CoverageZone[];
}
