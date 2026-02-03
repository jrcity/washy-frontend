export interface PeakHour {
    hour: number;
    hourLabel: string;
    orderCount: number;
    revenue: number;
}

export interface RevenueTrend {
    date: string;
    amount: number;
    orders: number;
}

export interface RevenueStats {
    period: string;
    dateRange: {
        startDate: string;
        endDate: string;
    };
    current: {
        totalRevenue: number;
        totalOrders: number;
        avgOrderValue: number;
    };
    previous: {
        totalRevenue: number;
        totalOrders: number;
    };
    growth: {
        revenueGrowth: number;
        orderGrowth: number;
    };
    trends: RevenueTrend[];
}

export interface DashboardStats {
    revenue: RevenueStats;
    orders: {
        total: number;
        completed: number;
        cancelled: number;
        completionRate: string;
        cancellationRate: string;
        byStatus: { _id: string; count: number }[];
    };
    peakHours: PeakHour[];
    customers: {
        totalCustomers: number;
        previousPeriodCustomers: number;
        retainedCustomers: number;
        retentionRate: number;
        repeatCustomerCount: number;
        repeatCustomerRate: string;
    };
    riders: {
        topDeliveries: any[];
    };
    services?: {
        topServices: {
            serviceId: string;
            serviceName: string;
            count: number;
            revenue: number;
        }[];
    };
}

export interface OrderVolumeStats {
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
}

export interface CustomerAcquisitionStats {
    newCustomers: number;
    returningCustomers: number;
    total: number;
    growthRate: number;
}

export interface RiderPerformanceStats {
    riderId: string;
    riderName: string;
    completedDeliveries: number;
    averageRating: number;
    totalDistance?: number;
}
