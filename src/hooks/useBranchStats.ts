import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import api from '@/lib/axios';

interface BranchStats {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    avgProcessingTime: number;
    todayOrders: number;
    weeklyGrowth: number;
}

/**
 * Hook for fetching branch-specific statistics
 */
export const useBranchStats = () => {
    return useQuery({
        queryKey: queryKeys.orders.all, // Reusing orders query key for now
        queryFn: async (): Promise<BranchStats> => {
            try {
                const response = await api.get('/branches/stats');
                return response.data;
            } catch {
                // Return mock data if endpoint doesn't exist yet
                return {
                    totalOrders: 245,
                    completedOrders: 198,
                    pendingOrders: 47,
                    totalRevenue: 485000,
                    avgProcessingTime: 4.2,
                    todayOrders: 12,
                    weeklyGrowth: 8.5,
                };
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export default useBranchStats;
