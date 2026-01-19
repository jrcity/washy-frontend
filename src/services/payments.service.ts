import { api } from '@/lib/axios';
import type { 
  ApiResponse, 
  Payment, 
  PaymentFilters, 
  InitializePaymentInput,
  InitializePaymentResponse,
  RecordCashPaymentInput,
  Pagination
} from '@/types';

interface PaymentsResponse {
  payments: Payment[];
  pagination: Pagination;
}

/**
 * Initialize payment for an order
 */
export const initializePayment = async (data: InitializePaymentInput): Promise<ApiResponse<Payment>> => {
  const response = await api.post<ApiResponse<Payment>>('/payments/initialize', data);
  return response.data;
};

/**
 * Verify payment by reference
 */
export const verifyPayment = async (reference: string): Promise<ApiResponse<Payment>> => {
  const response = await api.get<ApiResponse<Payment>>(`/payments/verify/${reference}`);
  return response.data;
};

/**
 * Get payment by ID
 */
export const getPaymentById = async (id: string): Promise<ApiResponse<Payment>> => {
  const response = await api.get<ApiResponse<Payment>>(`/payments/${id}`);
  return response.data;
};

/**
 * Get all payments (admin)
 */
export const getPayments = async (filters?: PaymentFilters): Promise<ApiResponse<PaymentsResponse>> => {
  const response = await api.get<ApiResponse<PaymentsResponse>>('/payments', { params: filters });
  return response.data;
};

/**
 * Record cash payment
 */
export const recordCashPayment = async (data: RecordCashPaymentInput): Promise<ApiResponse<Payment>> => {
  const response = await api.post<ApiResponse<Payment>>('/payments/cash', data);
  return response.data;
};
