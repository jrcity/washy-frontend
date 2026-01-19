import type { Address } from './api.types';

export interface CoverageZone {
  name: string;
  state: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface OperatingHours {
  open: string;
  close: string;
  isOpen: boolean;
}

export interface Branch {
  _id: string;
  name: string;
  code: string;
  address: Address;
  coverageZones: CoverageZone[];
  manager: string; // ObjectId
  staff: string[]; // ObjectIds
  riders: string[]; // ObjectIds
  contactPhone: string;
  contactEmail: string;
  operatingHours: {
    monday: OperatingHours;
    tuesday: OperatingHours;
    wednesday: OperatingHours;
    thursday: OperatingHours;
    friday: OperatingHours;
    saturday: OperatingHours;
    sunday: OperatingHours;
  };
  isActive: boolean;
  capacity: {
    dailyOrderLimit: number;
    currentDailyOrders: number;
  };
  metrics: {
    totalOrders: number;
    totalRevenue: number;
    averageRating: number;
    totalReviews: number;
  };
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
  operatingHours?: Branch['operatingHours'];
  manager?: string;
  isActive?: boolean;
}
