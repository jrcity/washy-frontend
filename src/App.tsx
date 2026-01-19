import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider, useAuthContext } from '@/context/AuthContext';
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
  OrderDetailsPage
} from '@/pages/customer';

// Rider Pages
import { 
  RiderDashboard,
  RiderTasksPage,
  ActiveDeliveryPage,
  VerifyDeliveryPage
} from '@/pages/rider';

// Branch Pages
import { 
  BranchDashboard,
  BranchOrderManagerPage,
  BranchProcessOrderPage,
  BranchStaffPage,
  BranchStatsPage
} from '@/pages/branch';
import { ProfilePage } from '@/pages/profile/ProfilePage';

import { 
  AdminDashboard,
  AdminOrdersPage,
  AdminServicesPage,
  AdminBranchesPage,
  AdminUsersPage
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

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      <Alert variant="warning">
        You're currently offline. Some features may be unavailable.
      </Alert>
    </div>
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
            <Route path="orders" element={<OrderHistoryPage />} />
            <Route path="orders/:id" element={<OrderDetailsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Rider Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['rider']} />}>
          <Route path="/rider" element={<DashboardLayout variant="rider" />}>
            <Route index element={<RiderDashboard />} />
            <Route path="tasks" element={<RiderTasksPage />} />
            <Route path="delivery/:id" element={<ActiveDeliveryPage />} />
            <Route path="verify/:id" element={<VerifyDeliveryPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Branch Staff Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['staff', 'branch_manager']} />}>
          <Route path="/branch" element={<DashboardLayout variant="branch" />}>
            <Route index element={<BranchDashboard />} />
            <Route path="orders" element={<BranchOrderManagerPage />} />
            <Route path="orders/:id/process" element={<BranchProcessOrderPage />} />
            <Route path="staff" element={<BranchStaffPage />} />
            <Route path="stats" element={<BranchStatsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Admin Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'super_admin']} />}>
          <Route path="/admin" element={<DashboardLayout variant="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="branches" element={<AdminBranchesPage />} />
            <Route path="users" element={<AdminUsersPage />} />
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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
