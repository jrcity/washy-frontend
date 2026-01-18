import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import * as ordersService from '@/services/orders.service';
import type { 
  OrderFilters, 
  CreateOrderInput, 
  UpdateOrderStatusInput,
  AssignRiderInput,
  RateOrderInput,
  CancelOrderInput,
  VerifyDeliveryInput
} from '@/types';
import toast from 'react-hot-toast';

/**
 * Hook for fetching customer's own orders
 */
export const useMyOrders = (filters?: OrderFilters) => {
  return useQuery({
    queryKey: queryKeys.orders.myOrders(filters),
    queryFn: async () => {
      const response = await ordersService.getMyOrders(filters);
      return response.data;
    },
  });
};

/**
 * Hook for fetching all orders (admin/staff)
 */
export const useOrders = (filters?: OrderFilters) => {
  return useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: async () => {
      const response = await ordersService.getOrders(filters);
      return response.data;
    },
  });
};

/**
 * Hook for fetching a single order
 */
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: async () => {
      const response = await ordersService.getOrderById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook for fetching order statistics
 */
export const useOrderStats = (filters?: { branchId?: string; startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: queryKeys.orders.stats(filters),
    queryFn: async () => {
      const response = await ordersService.getOrderStats(filters);
      return response.data;
    },
  });
};

/**
 * Hook for creating a new order
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderInput) => ordersService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.success('Order created successfully!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to create order');
    },
  });
};

/**
 * Hook for updating order status
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusInput }) => 
      ordersService.updateOrderStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.success('Order status updated!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to update status');
    },
  });
};

/**
 * Hook for assigning rider
 */
export const useAssignRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignRiderInput }) => 
      ordersService.assignRider(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
      toast.success('Rider assigned successfully!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to assign rider');
    },
  });
};

/**
 * Hook for generating delivery OTP
 */
export const useGenerateOTP = () => {
  return useMutation({
    mutationFn: (id: string) => ordersService.generateDeliveryOTP(id),
    onSuccess: () => {
      toast.success('OTP sent to customer!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to generate OTP');
    },
  });
};

/**
 * Hook for verifying delivery
 */
export const useVerifyDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VerifyDeliveryInput }) => 
      ordersService.verifyDelivery(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.success('Delivery verified successfully!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to verify delivery');
    },
  });
};

/**
 * Hook for rating an order
 */
export const useRateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RateOrderInput }) => 
      ordersService.rateOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
      toast.success('Thank you for your feedback!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to submit rating');
    },
  });
};

/**
 * Hook for canceling an order
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CancelOrderInput }) => 
      ordersService.cancelOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.success('Order cancelled successfully');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to cancel order');
    },
  });
};
