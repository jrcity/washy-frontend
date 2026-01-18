import { Navigate, type RouteObject } from 'react-router-dom';
import { PublicLayout, DashboardLayout, AuthLayout } from '@/components/layout';
import { LoadingScreen } from '@/components/ui';
import { useAuthContext } from '@/context/AuthContext';

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
import { CustomerDashboard } from '@/pages/customer';
import { RiderDashboard } from '@/pages/rider';
import { BranchDashboard } from '@/pages/branch';
import { AdminDashboard } from '@/pages/admin';

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
      { path: '/contact', element: <AboutPage /> }, // Reuse about for now
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
      // Add more customer routes as needed
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
    ],
  },

  // Utility routes
  { path: '/maintenance', element: <MaintenancePage /> },
  { path: '*', element: <NotFoundPage /> },
];

export default routes;
