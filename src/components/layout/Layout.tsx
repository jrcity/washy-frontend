import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
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
}

export const PageWrapper = ({ title, description, action, children, className }: PageWrapperProps) => {
  return (
    <div className={cn('space-y-6', className)}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
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
