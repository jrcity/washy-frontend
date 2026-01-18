import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  MapPin, 
  Settings, 
  FileText,
  Tag,
  CreditCard,
  Truck,
  ClipboardList,
  BarChart3,
  Upload,
  Bell,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/context/AuthContext';

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ElementType;
  roles?: string[];
}

// Links by dashboard type
const customerLinks: SidebarLink[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'My Orders', icon: ShoppingBag },
  { href: '/dashboard/new-order', label: 'New Order', icon: ClipboardList },
  { href: '/dashboard/profile', label: 'Profile', icon: Users },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
];

const riderLinks: SidebarLink[] = [
  { href: '/rider', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/rider/assignments', label: 'Assignments', icon: Truck },
  { href: '/rider/profile', label: 'Profile', icon: Users },
];

const branchLinks: SidebarLink[] = [
  { href: '/branch', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/branch/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/branch/stats', label: 'Analytics', icon: BarChart3 },
];

const adminLinks: SidebarLink[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/branches', label: 'Branches', icon: MapPin },
  { href: '/admin/services', label: 'Services', icon: FileText },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/uploads', label: 'Uploads', icon: Upload },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  variant: 'customer' | 'rider' | 'branch' | 'admin';
}

export const Sidebar = ({ variant }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthContext();

  const links = {
    customer: customerLinks,
    rider: riderLinks,
    branch: branchLinks,
    admin: adminLinks,
  }[variant];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white/50 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-100/50">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <span className="text-white font-bold text-xl">W</span>
          </div>
          {!isCollapsed && (
            <span className="font-bold text-xl text-neutral-900 tracking-tight">Washy</span>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
        >
          <ChevronLeft className={cn('w-5 h-5 transition-transform duration-300', isCollapsed && 'rotate-180')} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;

          return (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group',
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0 transition-colors', isActive ? 'text-primary-600' : 'text-neutral-400 group-hover:text-neutral-600')} />
              {!isCollapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      {user && !isCollapsed && (
        <div className="p-4 m-4 bg-neutral-50 rounded-2xl border border-neutral-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
              {user.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-900 truncate text-sm">{user.name}</p>
              <div className="flex items-center mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success-500 mr-2"></span>
                <p className="text-xs text-neutral-500 capitalize">{user.role?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 p-4 bg-primary-600 text-white rounded-full shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-xl">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-white border-r border-neutral-100 transition-all duration-300 z-30',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
