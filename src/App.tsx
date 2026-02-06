import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { queryClient, persister } from '@/lib/queryClient';
import { AuthProvider, useAuthContext } from '@/context/AuthContext';
import { ChatProvider } from '@/context/ChatContext';
import { PublicLayout, DashboardLayout, AuthLayout } from '@/components/layout';
import { LoadingScreen, Alert } from '@/components/ui';
import { useOffline } from '@/hooks';

// Public Pages
import {
  LandingPage,
  AboutPage,
  ServicesPage,
  MaintenancePage,
  NotFoundPage
} from '@/pages/public';

// Auth Pages
import { LoginPage, RegisterPage } from '@/pages/auth';

// Dashboard Pages
// Customer Pages
import {
  CustomerDashboard,
  NewOrderPage,
  OrderHistoryPage,
  OrderDetailsPage,
  CustomerSupportChatPage,
  CustomerNotificationsPage
} from '@/pages/customer';

// Rider Pages
import {
  RiderDashboard,
  RiderTasksPage,
  ActiveDeliveryPage,
  VerifyDeliveryPage,
  RiderNotificationsPage,
  ActivePickupPage,
  RiderChatPage
} from '@/pages/rider';

// Branch Pages
import {
  BranchDashboard,
  BranchOrderManagerPage,
  BranchProcessOrderPage,
  BranchStaffPage,
  BranchStatsPage,
  BranchNotificationsPage,
  BranchAnalyticsPage,
  BranchPaymentsPage,
  BranchOrderDetailsPage,
  BranchChatPage,
  BranchTasksPage
} from '@/pages/branch';
import { ProfilePage } from '@/pages/profile/ProfilePage';

import {
  AdminCategoriesPage,
  AdminDashboard,
  AdminOrdersPage,
  AdminOrderDetailsPage,
  AdminServicesPage,
  AdminBranchesPage,
  AdminBranchDetailsPage,
  AdminEditBranchPage,
  AdminUsersPage,
  AdminPaymentsPage,
  AdminPaymentDetailsPage,
  AdminUploadsPage,
  AdminReportsPage,
  AdminNotificationsPage,
  AdminChatPage,
  AdminTasksPage,
  AdminRBACPage
} from '@/pages/admin';



// Protected Route Wrapper
const ProtectedRoute = ({
  allowedRoles
}: {
  allowedRoles?: string[]
}) => {
  const { isAuthenticated, isLoading, user } = useAuthContext();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const redirectPath = {
      customer: '/dashboard',
      rider: '/rider',
      staff: '/branch',
      branch_manager: '/branch',
      admin: '/admin',
      super_admin: '/admin',
    }[user.role] || '/dashboard';

    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

// Guest Route (redirect if already logged in)
const GuestRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuthContext();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated && user) {
    const redirectPath = {
      customer: '/dashboard',
      rider: '/rider',
      staff: '/branch',
      branch_manager: '/branch',
      admin: '/admin',
      super_admin: '/admin',
    }[user.role] || '/dashboard';

    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

// Offline Banner Component
const OfflineBanner = () => {
  const { isOffline } = useOffline();

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed top-0 left-0 right-0 z-[100] p-4"
        >
          <Alert variant="warning" className="max-w-md mx-auto shadow-2xl border-warning-200/50">
            You're currently offline. Some features may be unavailable.
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// App Routes Component (inside AuthProvider)
const AppRoutes = () => {
  return (
    <>
      <OfflineBanner />
      <Routes>
        {/* Public routes with header/footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<AboutPage />} />
        </Route>

        {/* Auth routes */}
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        {/* Customer Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="/dashboard" element={<DashboardLayout variant="customer" />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="new-order" element={<NewOrderPage />} />
            <Route path="support" element={<CustomerSupportChatPage />} />
            <Route path="orders" element={<OrderHistoryPage />} />
            <Route path="orders/:id" element={<OrderDetailsPage />} />
            <Route path="notifications" element={<CustomerNotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Rider Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['rider']} />}>
          <Route path="/rider" element={<DashboardLayout variant="rider" />}>
            <Route path="/rider/active/:id" element={<ActivePickupPage />} />
            <Route index element={<RiderDashboard />} />
            <Route path="tasks" element={<RiderTasksPage />} />
            <Route path="delivery/:id" element={<ActiveDeliveryPage />} />
            <Route path="verify/:id" element={<VerifyDeliveryPage />} />
            <Route path="chat" element={<RiderChatPage />} />
            <Route path="notifications" element={<RiderNotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Branch Staff Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['staff', 'branch_manager']} />}>
          <Route path="/branch" element={<DashboardLayout variant="branch" />}>
            <Route index element={<BranchDashboard />} />
            <Route path="orders" element={<BranchOrderManagerPage />} />
            <Route path="orders/:id" element={<BranchOrderDetailsPage />} />
            <Route path="orders/:id/process" element={<BranchProcessOrderPage />} />
            <Route path="staff" element={<BranchStaffPage />} />
            <Route path="analytics" element={<BranchAnalyticsPage />} />
            <Route path="payments" element={<BranchPaymentsPage />} />
            <Route path="chat" element={<BranchChatPage />} />
            <Route path="tasks" element={<BranchTasksPage />} />
            <Route path="notifications" element={<BranchNotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Admin Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'super_admin']} />}>
          <Route path="/admin" element={<DashboardLayout variant="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="branches" element={<AdminBranchesPage />} />
            <Route path="branches/create" element={<AdminEditBranchPage />} />
            <Route path="branches/:id" element={<AdminBranchDetailsPage />} />
            <Route path="branches/edit/:id" element={<AdminEditBranchPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="chat" element={<AdminChatPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="rbac" element={<AdminRBACPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="payments/:id" element={<AdminPaymentDetailsPage />} />
            <Route path="uploads" element={<AdminUploadsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="tasks" element={<AdminTasksPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Utility routes */}
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

// Main App Component
function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <BrowserRouter>
        <AuthProvider>
          <ChatProvider>
            <AppRoutes />
          </ChatProvider>
        </AuthProvider>
      </BrowserRouter>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            borderRadius: '12px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#f8fafc',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f8fafc',
            },
          },
        }}
      />

      {/* React Query Devtools (only in development) */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </PersistQueryClientProvider>
  );
}

export default App;
