import { api } from '@/lib/axios';
import type { 
  ApiResponse, 
  Order, 
  CreateOrderInput, 
  UpdateOrderStatusInput, 
  AssignRiderInput,
  RateOrderInput,
  PaginationType,
  PaginatedMetaResponse
} from '@/types';

export const ordersService = {
  // Create a new order
  create: async (data: CreateOrderInput): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>('/orders', data);
    return response.data.data!;
  },

  // Get all orders (Admin/Staff)
  getAll: async (params?: { 
    page?: number; 
    limit?: number; 
    status?: string;
    branchId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ orders: Order[]; pagination: PaginationType }> => {
    // Correctly handle the { data: [], meta: {} } response structure
    const response = await api.get<PaginatedMetaResponse<Order>>('/orders', { params });
    return {
      orders: response.data.data,
      pagination: response.data.meta
    };
  },

  // Get my orders (Customer)
  getMyOrders: async (params?: { 
    page?: number; 
    limit?: number; 
    status?: string; 
  }): Promise<{ orders: Order[]; pagination: PaginationType }> => {
    // Uses the new PaginatedMetaResponse structure
    const response = await api.get<PaginatedMetaResponse<Order>>('/orders/my-orders', { params });
    // Transform to consistent internal format
    return {
      orders: response.data.data,
      pagination: response.data.meta
    };
  },

  // Get order by ID
  getById: async (id: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data!;
  },

  // Update order status
  updateStatus: async (id: string, data: UpdateOrderStatusInput): Promise<Order> => {
    const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/status`, data);
    return response.data.data!;
  },

  // Assign rider
  assignRider: async (id: string, data: AssignRiderInput): Promise<void> => {
    await api.post(`/orders/${id}/assign-rider`, data);
  },

  // Generate delivery OTP
  generateOtp: async (id: string): Promise<{ otp: string; expiresAt: string }> => {
    const response = await api.post<ApiResponse<{ otp: string; expiresAt: string }>>(`/orders/${id}/generate-otp`);
    return response.data.data!;
  },

  // Verify delivery (Rider)
  verifyDelivery: async (id: string, data: { type: string; otpCode?: string; photoUrl?: string }): Promise<void> => {
    await api.post(`/orders/${id}/verify-delivery`, data);
  },

  // Rate order
  rateOrder: async (id: string, data: RateOrderInput): Promise<void> => {
    await api.post(`/orders/${id}/rate`, data);
  },

  // Cancel order
  cancelOrder: async (id: string, reason: string): Promise<void> => {
    await api.post(`/orders/${id}/cancel`, { reason });
  },

  // Get stats
  getStats: async (params?: { branchId?: string; startDate?: string; endDate?: string }): Promise<any> => {
    const response = await api.get<ApiResponse<any>>('/orders/stats/overview', { params });
    return response.data.data!;
  }
};
