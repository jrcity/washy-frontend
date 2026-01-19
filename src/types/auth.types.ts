import type { Address } from './api.types';
export type { Address };

// User Roles matching backend enum
export type UserRole = 
  | 'customer' 
  | 'rider' 
  | 'staff' 
  | 'branch_manager' 
  | 'admin' 
  | 'super_admin';

// Base User Interface
export interface User {
  _id: string;
  name: string;
  email?: string;
  profileImage?: string;
  phone: string;
  role: UserRole;
  pushToken?: string;
  isActive?: boolean; // Not in schema but common, verify if needed or derived
  address?: Customer['address']; // Add optional address from Customer to allow easy access in frontend usually
  createdAt: string;
  updatedAt: string;
}

// Discriminator Interfaces

export interface Customer extends User {
  role: 'customer';
  orders: string[]; // ObjectIds
  payments: string[]; // ObjectIds
  notifications: {
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }[];
  address: {
    area: string;
    street: string;
    city: string;
    landmark: string;
    state: string;
    zipCode: string;
  };
  preferences: {
    notificationEnabled: boolean;
  };
}

export interface Admin extends User {
  role: 'admin' | 'super_admin';
  permissions: string[];
  isSuperAdmin: boolean;
}

export interface BranchManager extends User {
  role: 'branch_manager';
  managedBranch?: string; // ObjectId
  permissions: string[];
  targets?: {
    monthlyOrderTarget: number;
    monthlyRevenueTarget: number;
  };
  compensation?: {
    baseSalary: number;
    commissionRate: number;
    bonusStructure?: string;
  };
}

export interface Rider extends User {
  role: 'rider';
  assignedBranch: string; // ObjectId
  coverageZones: string[];
  vehicleType: 'motorcycle' | 'bicycle' | 'car' | 'van';
  vehiclePlateNumber?: string;
  isAvailable: boolean;
  isOnDuty: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
    updatedAt: string;
  };
  metrics: {
    totalDeliveries: number;
    completedDeliveries: number;
    cancelledDeliveries: number;
    averageRating: number;
    totalRatings: number;
  };
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  identityVerification?: {
    ninNumber?: string;
    driversLicense?: string;
    isVerified: boolean;
    verifiedAt?: string;
  };
}

export interface Staff extends User {
  role: 'staff';
  assignedBranch?: string; // ObjectId
  permissions: string[];
  workSchedule?: {
    monday: WorkDay;
    tuesday: WorkDay;
    wednesday: WorkDay;
    thursday: WorkDay;
    friday: WorkDay;
    saturday: WorkDay;
    sunday: WorkDay;
  };
  jobTitle?: string;
  employmentDetails?: {
    employeeId: string;
    hiredAt: string;
    salary?: number;
    isContractor: boolean;
  };
  metrics: {
    ordersProcessed: number;
    averageProcessingTime: number;
  };
}

interface WorkDay {
  start: string;
  end: string;
  isWorking: boolean;
}

// API Input Interfaces

export interface LoginInput {
  phone: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: Address; // Frontend usually registers customers first
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User; // The actual response might be a specific subtype, but User is the base
    accessToken: string;
    refreshToken: string;
  };
}

export interface ProfileUpdateInput {
  name?: string;
  phone?: string;
  address?: Address;
  // Rider specific
  vehicleType?: 'motorcycle' | 'bicycle' | 'car' | 'van';
  vehiclePlateNumber?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface PasswordChangeInput {
  currentPassword: string;
  newPassword: string;
}
