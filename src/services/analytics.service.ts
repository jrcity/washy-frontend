import api from '@/lib/axios';
import type {
    DashboardStats,
    RevenueStats,
    OrderVolumeStats,
    CustomerAcquisitionStats,
    RiderPerformanceStats,
} from '@/types/analytics.types';

import type { ApiResponse } from '@/types';

export const analyticsService = {
    getDashboardStats: async (params?: any) => {
        const response = await api.get<ApiResponse<DashboardStats>>('/analytics/dashboard', { params });
        return response.data.data;
    },

    getRevenueOverview: async (params?: any) => {
        const response = await api.get<ApiResponse<RevenueStats>>('/analytics/revenue/overview', { params });
        return response.data.data;
    },

    getOrderVolume: async (params?: any) => {
        const response = await api.get<ApiResponse<OrderVolumeStats>>('/analytics/orders/volume', { params });
        return response.data.data;
    },

    getCustomerAcquisition: async (params?: any) => {
        const response = await api.get<ApiResponse<CustomerAcquisitionStats>>(
            '/analytics/customers/acquisition',
            { params }
        );
        return response.data.data;
    },

    getRiderPerformance: async (params?: any) => {
        const response = await api.get<ApiResponse<RiderPerformanceStats>>('/analytics/riders/performance', { params });
        return response.data.data;
    },
};
