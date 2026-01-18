import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { setToken, setStoredUser, clearAuthData, getToken } from '@/lib/storage';
import * as authService from '@/services/auth.service';
import type { LoginInput, RegisterInput, ProfileUpdateInput } from '@/types';
import toast from 'react-hot-toast';

/**
 * Hook for user login
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (response) => {
      if (response.data) {
        setToken(response.data.accessToken);
        setStoredUser(response.data.user);
        queryClient.setQueryData(queryKeys.auth.profile(), response.data.user);
        toast.success('Login successful!');
      }
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Login failed');
    },
  });
};

/**
 * Hook for user registration
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (response) => {
      if (response.data) {
        setToken(response.data.accessToken);
        setStoredUser(response.data.user);
        queryClient.setQueryData(queryKeys.auth.profile(), response.data.user);
        toast.success('Registration successful!');
      }
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Registration failed');
    },
  });
};

/**
 * Hook for getting user profile
 */
export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: async () => {
      const response = await authService.getProfile();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!getToken(),
    retry: false,
  });
};

/**
 * Hook for updating user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileUpdateInput) => authService.updateProfile(data),
    onSuccess: (response) => {
      if (response.data) {
        setStoredUser(response.data);
        queryClient.setQueryData(queryKeys.auth.profile(), response.data);
        toast.success('Profile updated successfully!');
      }
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

/**
 * Hook for logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    clearAuthData();
    queryClient.clear();
    toast.success('Logged out successfully');
  };
};
