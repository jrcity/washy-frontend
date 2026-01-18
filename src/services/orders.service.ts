import { api } from '@/lib/axios';
import type { 
  ApiResponse, 
  Order, 
  OrderFilters, 
  CreateOrderInput,
  UpdateOrderStatusInput,
  AssignRiderInput,
  RateOrderInput,
  CancelOrderInput,
  VerifyDeliveryInput,
  OrderStats,
  Pagination
} from '@/types';

interface OrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

/**
 * Create a new order
 */
export const createOrder = async (data: CreateOrderInput): Promise<ApiResponse<Order>> => {
  const response = await api.post<ApiResponse<Order>>('/orders', data);
  return response.data;
};

/**
 * Get all orders (admin/staff)
 */
export const getOrders = async (filters?: OrderFilters): Promise<ApiResponse<OrdersResponse>> => {
  const response = await api.get<ApiResponse<OrdersResponse>>('/orders', { params: filters });
  return response.data;
};

/**
 * Get customer's own orders
 */
export const getMyOrders = async (filters?: OrderFilters): Promise<ApiResponse<OrdersResponse>> => {
  const response = await api.get<ApiResponse<OrdersResponse>>('/orders/my-orders', { params: filters });
  return response.data;
};

/**
 * Get order by ID
 */
export const getOrderById = async (id: string): Promise<ApiResponse<Order>> => {
  const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
  return response.data;
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  id: string, 
  data: UpdateOrderStatusInput
): Promise<ApiResponse<Order>> => {
  const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/status`, data);
  return response.data;
};

/**
 * Assign rider to order
 */
export const assignRider = async (
  id: string, 
  data: AssignRiderInput
): Promise<ApiResponse<Order>> => {
  const response = await api.post<ApiResponse<Order>>(`/orders/${id}/assign-rider`, data);
  return response.data;
};

/**
 * Generate delivery OTP
 */
export const generateDeliveryOTP = async (id: string): Promise<ApiResponse<{ otp: string; expiresAt: string }>> => {
  const response = await api.post<ApiResponse<{ otp: string; expiresAt: string }>>(`/orders/${id}/generate-otp`);
  return response.data;
};

/**
 * Verify delivery
 */
export const verifyDelivery = async (
  id: string, 
  data: VerifyDeliveryInput
): Promise<ApiResponse<Order>> => {
  const response = await api.post<ApiResponse<Order>>(`/orders/${id}/verify-delivery`, data);
  return response.data;
};

/**
 * Rate an order
 */
export const rateOrder = async (id: string, data: RateOrderInput): Promise<ApiResponse<Order>> => {
  const response = await api.post<ApiResponse<Order>>(`/orders/${id}/rate`, data);
  return response.data;
};

/**
 * Cancel an order
 */
export const cancelOrder = async (id: string, data: CancelOrderInput): Promise<ApiResponse<Order>> => {
  const response = await api.post<ApiResponse<Order>>(`/orders/${id}/cancel`, data);
  return response.data;
};

/**
 * Get order statistics
 */
export const getOrderStats = async (filters?: { 
  branchId?: string; 
  startDate?: string; 
  endDate?: string 
}): Promise<ApiResponse<OrderStats>> => {
  const response = await api.get<ApiResponse<OrderStats>>('/orders/stats/overview', { params: filters });
  return response.data;
};
