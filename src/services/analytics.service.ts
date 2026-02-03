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
    getDashboardStats: async () => {
        const response = await api.get<ApiResponse<DashboardStats>>('/analytics/dashboard');
        return response.data.data;
    },

    getRevenueOverview: async () => {
        const response = await api.get<ApiResponse<RevenueStats>>('/analytics/revenue/overview');
        return response.data.data;
    },

    getOrderVolume: async () => {
        const response = await api.get<ApiResponse<OrderVolumeStats>>('/analytics/orders/volume');
        return response.data.data;
    },

    getCustomerAcquisition: async () => {
        const response = await api.get<ApiResponse<CustomerAcquisitionStats>>(
            '/analytics/customers/acquisition'
        );
        return response.data.data;
    },

    getRiderPerformance: async () => {
        const response = await api.get<ApiResponse<RiderPerformanceStats>>('/analytics/riders/performance');
        return response.data.data;
    },
};
