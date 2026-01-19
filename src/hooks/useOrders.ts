import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  keepPreviousData 
} from '@tanstack/react-query';
import { ordersService } from '@/services/orders.service';
import type { 
  CreateOrderInput, 
  UpdateOrderStatusInput, 
  AssignRiderInput,
  RateOrderInput 
} from '@/types';
import toast from 'react-hot-toast';

export const useOrders = (params?: { 
  page?: number; 
  limit?: number; 
  status?: string;
  branchId?: string;
}) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersService.getAll(params),
    placeholderData: keepPreviousData,
  });
};

export const useMyOrders = (params?: { 
  page?: number; 
  limit?: number; 
  status?: string; 
}) => {
  return useQuery({
    queryKey: ['my-orders', params],
    queryFn: () => ordersService.getMyOrders(params),
    placeholderData: keepPreviousData,
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersService.getById(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderInput) => ordersService.create(data),
    onSuccess: () => {
      toast.success('Order placed successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusInput }) => 
      ordersService.updateStatus(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  });
};

export const useAssignRider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignRiderInput }) => 
      ordersService.assignRider(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Rider assigned successfully');
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to assign rider');
    }
  });
};

export const useRateOrder = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RateOrderInput }) => 
      ordersService.rateOrder(id, data),
    onSuccess: () => {
      toast.success('Thank you for your feedback!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    }
  });
};

export const useOrderStats = (params?: { branchId?: string; startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['order-stats', params],
    queryFn: () => ordersService.getStats(params),
    placeholderData: keepPreviousData,
  });
};
