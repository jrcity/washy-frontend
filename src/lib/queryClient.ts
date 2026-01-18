import { QueryClient } from '@tanstack/react-query';

// Default stale time - 5 minutes
const DEFAULT_STALE_TIME = 5 * 60 * 1000;

// Default cache time - 30 minutes
const DEFAULT_GC_TIME = 30 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long data is considered fresh
      staleTime: DEFAULT_STALE_TIME,
      // How long inactive data stays in cache
      gcTime: DEFAULT_GC_TIME,
      // Retry failed requests 2 times
      retry: 2,
      // Don't refetch on window focus for better UX
      refetchOnWindowFocus: false,
      // Enable refetch on reconnect for offline support
      refetchOnReconnect: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});

// Query key factory for consistent key management
export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
  },
  
  // Orders
  orders: {
    all: ['orders'] as const,
    list: (filters?: object) => [...queryKeys.orders.all, 'list', filters] as const,
    myOrders: (filters?: object) => [...queryKeys.orders.all, 'my-orders', filters] as const,
    detail: (id: string) => [...queryKeys.orders.all, 'detail', id] as const,
    stats: (filters?: object) => [...queryKeys.orders.all, 'stats', filters] as const,
  },
  
  // Branches
  branches: {
    all: ['branches'] as const,
    list: (filters?: object) => [...queryKeys.branches.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.branches.all, 'detail', id] as const,
    byZone: (zone: string, state?: string) => [...queryKeys.branches.all, 'zone', zone, state] as const,
    stats: (id: string) => [...queryKeys.branches.all, 'stats', id] as const,
  },
  
  // Services
  services: {
    all: ['services'] as const,
    list: (filters?: object) => [...queryKeys.services.all, 'list', filters] as const,
    active: () => [...queryKeys.services.all, 'active'] as const,
    catalog: () => [...queryKeys.services.all, 'catalog'] as const,
    detail: (id: string) => [...queryKeys.services.all, 'detail', id] as const,
    bySlug: (slug: string) => [...queryKeys.services.all, 'slug', slug] as const,
  },
  
  // Categories
  categories: {
    all: ['categories'] as const,
    list: (filters?: object) => [...queryKeys.categories.all, 'list', filters] as const,
    active: () => [...queryKeys.categories.all, 'active'] as const,
    detail: (id: string) => [...queryKeys.categories.all, 'detail', id] as const,
  },
  
  // Payments
  payments: {
    all: ['payments'] as const,
    list: (filters?: object) => [...queryKeys.payments.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.payments.all, 'detail', id] as const,
  },
  
  // Notifications
  notifications: {
    all: ['notifications'] as const,
    list: (filters?: object) => [...queryKeys.notifications.all, 'list', filters] as const,
    unreadCount: () => [...queryKeys.notifications.all, 'unread-count'] as const,
  },
  
  // Uploads
  uploads: {
    all: ['uploads'] as const,
    list: (filters?: object) => [...queryKeys.uploads.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.uploads.all, 'detail', id] as const,
  },
  
  // Health
  health: ['health'] as const,
} as const;

export default queryClient;
