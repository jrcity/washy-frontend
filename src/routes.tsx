import { Navigate, type RouteObject } from 'react-router-dom';
import { PublicLayout, DashboardLayout, AuthLayout } from '@/components/layout';
import { LoadingScreen } from '@/components/ui';
import { useAuthContext } from '@/context/AuthContext';

// Public Pages
import {
  LandingPage,
  AboutPage,
  ServicesPage,
  ContactPage,
  MaintenancePage,
  NotFoundPage
} from '@/pages/public';

// Auth Pages
import { LoginPage, RegisterPage } from '@/pages/auth';

import {
  AdminDashboard,
  AdminReportsPage,
  AdminChatPage,
  AdminRBACPage,
  AdminTasksPage,
  AdminBranchesPage,
  AdminBranchDetailsPage,
  AdminEditBranchPage,
  AdminUsersPage,
  AdminServicesPage,
  AdminCategoriesPage,
  AdminPaymentsPage,
  AdminPaymentDetailsPage,
} from '@/pages/admin';
import { ProfilePage } from '@/pages/profile/ProfilePage';

import {
  RiderDashboard,
  RiderTasksPage,
  ActiveDeliveryPage,
  VerifyDeliveryPage,
  RiderChatPage
} from '@/pages/rider';

import {
  BranchDashboard,
  BranchOrderManagerPage,
  BranchProcessOrderPage,
  BranchTasksPage,
  BranchAnalyticsPage,
  BranchChatPage
} from '@/pages/branch';
import {
  CustomerDashboard,
  NewOrderPage,
  OrderHistoryPage,
  OrderDetailsPage,
  CustomerSupportChatPage
} from '@/pages/customer';

// Protected Route Wrapper
const ProtectedRoute = ({
  children,
  allowedRoles
}: {
  children: React.ReactNode;
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
    // Redirect to appropriate dashboard based on role
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

  return <>{children}</>;
};

// Guest Route (redirect if already logged in)
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
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

  return <>{children}</>;
};

// Route configuration
export const routes: RouteObject[] = [
  // Public routes with header/footer
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/services', element: <ServicesPage /> },
      { path: '/contact', element: <ContactPage /> },
    ],
  },

  // Auth routes
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <GuestRoute><LoginPage /></GuestRoute>
      },
      {
        path: '/register',
        element: <GuestRoute><RegisterPage /></GuestRoute>
      },
    ],
  },

  // Customer Dashboard
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['customer']}>
        <DashboardLayout variant="customer" />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <CustomerDashboard /> },
      { path: 'new-order', element: <NewOrderPage /> },
      { path: 'orders', element: <OrderHistoryPage /> },
      { path: 'orders/:id', element: <OrderDetailsPage /> },
      { path: 'support', element: <CustomerSupportChatPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },

  // Rider Dashboard
  {
    path: '/rider',
    element: (
      <ProtectedRoute allowedRoles={['rider']}>
        <DashboardLayout variant="rider" />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <RiderDashboard /> },
      { path: 'tasks', element: <RiderTasksPage /> },
      { path: 'active/:id', element: <ActiveDeliveryPage /> },
      { path: 'chat', element: <RiderChatPage /> },
      { path: 'verify/:id', element: <VerifyDeliveryPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },

  // Branch Staff Dashboard
  {
    path: '/branch',
    element: (
      <ProtectedRoute allowedRoles={['staff', 'branch_manager']}>
        <DashboardLayout variant="branch" />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <BranchDashboard /> },
      { path: 'orders', element: <BranchOrderManagerPage /> },
      { path: 'orders/:id', element: <BranchProcessOrderPage /> },
      { path: 'chat', element: <BranchChatPage /> },
      { path: 'tasks', element: <BranchTasksPage /> },
      { path: 'analytics', element: <BranchAnalyticsPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },

  // Admin Dashboard
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
        <DashboardLayout variant="admin" />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'reports', element: <AdminReportsPage /> },
      { path: 'chat', element: <AdminChatPage /> },
      { path: 'rbac', element: <AdminRBACPage /> },
      { path: 'tasks', element: <AdminTasksPage /> },
      { path: 'branches', element: <AdminBranchesPage /> },
      { path: 'branches/create', element: <AdminEditBranchPage /> },
      { path: 'branches/edit/:id', element: <AdminEditBranchPage /> },
      { path: 'branches/:id', element: <AdminBranchDetailsPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'services', element: <AdminServicesPage /> },
      { path: 'categories', element: <AdminCategoriesPage /> },
      { path: 'payments', element: <AdminPaymentsPage /> },
      { path: 'payments/:id', element: <AdminPaymentDetailsPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },

  // Utility routes
  { path: '/maintenance', element: <MaintenancePage /> },
  { path: '*', element: <NotFoundPage /> },
];

export default routes;
