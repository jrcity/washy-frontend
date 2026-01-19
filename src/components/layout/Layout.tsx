import type { ReactNode } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

// Public layout with header and footer
export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Dashboard layout with sidebar
interface DashboardLayoutProps {
  variant: 'customer' | 'rider' | 'branch' | 'admin';
  children?: ReactNode;
}

export const DashboardLayout = ({ variant, children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar variant={variant} />
      <main className={cn('lg:ml-64 min-h-screen transition-all duration-300')}>
        <div className="p-4 sm:p-6 lg:p-8 xl:p-10 max-w-[1600px] mx-auto">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

// Auth layout (login, register)
export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <Outlet />
    </div>
  );
};

// Container component
interface ContainerProps {
  className?: string;
  children: ReactNode;
}

export const Container = ({ className, children }: ContainerProps) => {
  return (
    <div className={cn('container mx-auto px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
};

// Page wrapper with title
interface PageWrapperProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  showBack?: boolean;
}

export const PageWrapper = ({ title, description, action, children, className, showBack }: PageWrapperProps) => {
  const navigate = useNavigate();

  return (
    <div className={cn('space-y-6', className)}>
      {(title || action || showBack) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            {showBack && (
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-sm text-neutral-500 hover:text-neutral-800 mb-2 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </button>
            )}
            {title && <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>}
            {description && <p className="mt-1 text-neutral-500">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
};

export default PublicLayout;
