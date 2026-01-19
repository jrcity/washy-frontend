import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/context/AuthContext';
import { useUnreadNotificationCount } from '@/hooks/useNotifications';
import { Button, Avatar, Badge } from '@/components/ui';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthContext();
  const { data: unreadCount } = useUnreadNotificationCount();

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
      case 'super_admin':
        return '/admin';
      case 'rider':
        return '/rider';
      case 'staff':
      case 'branch_manager':
        return '/branch';
      default:
        return '/dashboard';
    }
  };

  const getProfileLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
      case 'super_admin':
        return '/admin/profile';
      case 'rider':
        return '/rider/profile';
      case 'staff':
      case 'branch_manager':
        return '/branch/profile';
      default:
        return '/dashboard/profile';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200/60 shadow-sm transition-all duration-300">
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-20 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">W</span>
            </div>
            <span className="font-bold text-2xl text-neutral-900">Washy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'text-base font-medium transition-colors px-1 py-2 relative',
                  location.pathname === link.href
                    ? 'text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600'
                    : 'text-neutral-600 hover:text-primary-600'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="relative p-2 text-neutral-500 hover:text-neutral-700"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-100"
                  >
                    <Avatar name={user?.name || 'User'} size="sm" src={user?.profileImage} />
                    <span className="hidden lg:block text-sm font-medium text-neutral-700">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 text-neutral-500" />
                  </button>

                  {isProfileMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-neutral-100">
                          <p className="font-medium text-neutral-900">{user?.name}</p>
                          <p className="text-sm text-neutral-500">{user?.email}</p>
                          <Badge variant="primary" size="sm" className="mt-1">
                            {user?.role?.replace('_', ' ')}
                          </Badge>
                        </div>
                        <Link
                          to={getDashboardLink()}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          to={getProfileLink()}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Profile & Settings</span>
                        </Link>
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            logout();
                          }}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-error-600 hover:bg-error-50 w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-neutral-500"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-100">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    location.pathname === link.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 rounded-lg"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
