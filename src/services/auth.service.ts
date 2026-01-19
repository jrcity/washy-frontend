import { api } from '@/lib/axios';
import type { 
  ApiResponse, 
  LoginInput, 
  RegisterInput, 
  AuthResponse, 
  User,
  ProfileUpdateInput 
} from '@/types';

/**
 * Register a new customer account
 */
export const register = async (data: RegisterInput): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

/**
 * Login with email and password
 */
export const login = async (data: LoginInput): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

/**
 * Get current user profile
 */



/**
 * Get current user profile
 */
export const getProfile = async (): Promise<ApiResponse<User>> => {
  const response = await api.get<ApiResponse<User>>('/auth/profile');
  return response.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (data: ProfileUpdateInput): Promise<ApiResponse<User>> => {
  const response = await api.patch<ApiResponse<User>>('/auth/profile', data);
  return response.data;
};
