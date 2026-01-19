import type { Address } from './api.types';
export type { Address };

// User Roles
export type UserRole = 
  | 'customer' 
  | 'rider' 
  | 'staff' 
  | 'branch_manager' 
  | 'admin' 
  | 'super_admin';

// User Type
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive?: boolean;
  address?: Address;
  profileImage?: string;
  branch?: string;
  preferences?: {
    notificationEnabled: boolean;
  };
  orders?: any[]; // Keep as any[] for now to avoid circular deps or complex linking
  payments?: any[];
  notifications?: any[];
  tokens?: any[];
  __t?: string;
  __v?: number;
  createdAt: string;
  updatedAt?: string;
}

// Login Input
export interface LoginInput {
  phone: string;
  password: string;
}

// Register Input
export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: Address;
}

// Auth Response
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

// Profile Update Input
export interface ProfileUpdateInput {
  name?: string;
  phone?: string;
  address?: Address;
}

// Password Change Input
export interface PasswordChangeInput {
  currentPassword: string;
  newPassword: string;
}
