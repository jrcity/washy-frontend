import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import * as paymentsService from '@/services/payments.service';
import type { PaymentFilters, InitializePaymentInput, RecordCashPaymentInput } from '@/types';
import toast from 'react-hot-toast';

/**
 * Hook for fetching all payments (admin)
 */
export const usePayments = (filters?: PaymentFilters) => {
  return useQuery({
    queryKey: queryKeys.payments.list(filters),
    queryFn: async () => {
      const response = await paymentsService.getPayments(filters);
      return response.data;
    },
  });
};

/**
 * Hook for fetching a single payment
 */
export const usePayment = (id: string) => {
  return useQuery({
    queryKey: queryKeys.payments.detail(id),
    queryFn: async () => {
      const response = await paymentsService.getPaymentById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook for initializing payment
 */
export const useInitializePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InitializePaymentInput) => paymentsService.initializePayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to initialize payment');
    },
  });
};

/**
 * Hook for verifying payment
 */
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reference: string) => paymentsService.verifyPayment(reference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.success('Payment verified successfully!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to verify payment');
    },
  });
};

/**
 * Hook for recording cash payment
 */
export const useRecordCashPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RecordCashPaymentInput) => paymentsService.recordCashPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.success('Cash payment recorded!');
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to record payment');
    },
  });
};
