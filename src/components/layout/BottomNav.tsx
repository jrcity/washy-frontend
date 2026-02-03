import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    PlusCircle,
    User,
    Bell,
    Truck,
    MessageCircle,
    BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/context/AuthContext';

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
    roles?: string[];
}

const customerNav: NavItem[] = [
    { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { href: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/dashboard/new-order', label: 'Order Now', icon: PlusCircle },
    { href: '/dashboard/support', label: 'Support', icon: MessageCircle },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
];

const riderNav: NavItem[] = [
    { href: '/rider', label: 'Home', icon: LayoutDashboard },
    { href: '/rider/tasks', label: 'Tasks', icon: Truck },
    { href: '/rider/notifications', label: 'Alerts', icon: Bell },
    { href: '/rider/profile', label: 'Profile', icon: User },
];

const branchNav: NavItem[] = [
    { href: '/branch', label: 'Home', icon: LayoutDashboard },
    { href: '/branch/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/branch/analytics', label: 'Stats', icon: BarChart3, roles: ['branch_manager'] },
    { href: '/branch/profile', label: 'Profile', icon: User },
];

const adminNav: NavItem[] = [
    { href: '/admin', label: 'Home', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { href: '/admin/profile', label: 'Profile', icon: User },
];

interface BottomNavProps {
    variant?: 'customer' | 'rider' | 'branch' | 'admin';
}

export const BottomNav = ({ variant }: BottomNavProps) => {
    const location = useLocation();
    const { user } = useAuthContext();

    if (!user || !variant) return null;

    const navItems = {
        customer: customerNav,
        rider: riderNav,
        branch: branchNav,
        admin: adminNav,
    }[variant];

    // If we have many items, we might need to adjust width or icons
    const filteredItems = navItems.filter(item =>
        !item.roles || (user && item.roles.includes(user.role))
    );

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-neutral-200/60 pb-safe z-50">
            <div className="flex items-center justify-around h-16 px-2">
                {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center flex-1 min-w-0 py-1 transition-all duration-300',
                                isActive
                                    ? 'text-primary-600'
                                    : 'text-neutral-400 hover:text-neutral-600'
                            )}
                        >
                            <div className={cn(
                                'p-1.5 rounded-xl transition-all duration-300',
                                isActive && 'bg-primary-50'
                            )}>
                                <Icon className={cn('w-5 h-5', isActive && 'animate-in zoom-in-75 duration-300')} />
                            </div>
                            <span className={cn(
                                'text-[10px] font-medium mt-0.5 truncate w-full text-center px-1',
                                isActive ? 'text-primary-700' : 'text-neutral-500'
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
