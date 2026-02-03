import { Link } from 'react-router-dom';
import {
  Package,
  MapPin,
  Users,
  CreditCard,
  TrendingUp,
  FileText,
  Clock,
  BarChart3,
  ArrowRight,
  Plus,
  Activity
} from 'lucide-react';
import { Card, Badge, SkeletonCard, Button } from '@/components/ui';
import { PageWrapper } from '@/components/layout';
import { useAuthContext } from '@/context/AuthContext';
import { useComponentLogger } from '@/hooks';
import { useOrders, useBranches } from '@/hooks';
import { formatCurrency, formatDate, getStatusColor, getStatusText, cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';

export const AdminDashboard = () => {
  const { user } = useAuthContext();
  useComponentLogger('AdminDashboard', { userId: user?._id });

  const { data: ordersData, isLoading: ordersLoading } = useOrders({ limit: 5 });
  const { data: branchesData } = useBranches({ limit: 100 });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin-analytics-summary'],
    queryFn: () => analyticsService.getDashboardStats()
  });

  const orders = ordersData?.orders || [];
  const branches = branchesData || [];

  return (
    <PageWrapper
      title="Fleet Hub"
      description={`Welcome back, ${user?.name}. Here's your mission overview.`}
    >
      {/* Premium Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Gross Volume',
            value: formatCurrency(analytics?.revenue?.current?.totalRevenue || 0),
            icon: TrendingUp,
            color: 'text-success-600',
            bg: 'bg-success-50',
            growth: `${analytics?.revenue?.growth?.revenueGrowth || 0}%`
          },
          {
            label: 'Active Missions',
            value: analytics?.orders?.total || 0,
            icon: Package,
            color: 'text-primary-600',
            bg: 'bg-primary-50',
            growth: `${analytics?.revenue?.growth?.orderGrowth || 0}%`
          },
          {
            label: 'Rider Squad',
            value: analytics?.customers?.totalCustomers || 0, // Using customers as placeholder or update to riders if available
            icon: Users,
            color: 'text-info-600',
            bg: 'bg-info-50',
            growth: 'Stable'
          },
          {
            label: 'Efficiency',
            value: `${analytics?.orders?.completionRate || '0.0'}%`,
            icon: Activity,
            color: 'text-warning-600',
            bg: 'bg-warning-50',
            growth: 'Target: 95%'
          }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 rounded-[32px] border-neutral-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-neutral-50 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{stat.growth}</span>
                </div>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-neutral-900 tracking-tight">
                  {analyticsLoading ? '...' : stat.value}
                </h3>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-8">
        {/* Recent Activity (Orders) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-neutral-900 tracking-tight">Live Operations</h2>
              <p className="text-sm font-medium text-neutral-400">Recent customer interactions</p>
            </div>
            <Link to="/admin/orders" className="w-10 h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-400 hover:text-primary-600 hover:border-primary-100 transition-all shadow-sm">
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {ordersLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order, i) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/admin/orders/${order._id}`}>
                    <Card className="p-5 rounded-[24px] border-neutral-100 hover:border-primary-100 hover:shadow-lg transition-all group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center font-bold text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                            {order.orderNumber.slice(-2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-black text-neutral-900 leading-none">{order.orderNumber}</span>
                              <Badge className={cn("rounded-lg px-2 py-0.5 text-[10px] font-black uppercase", getStatusColor(order.status))}>
                                {getStatusText(order.status)}
                              </Badge>
                            </div>
                            <p className="text-xs font-medium text-neutral-400">
                              {order.customer?.name} • {formatDate(order.createdAt, 'PP')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-neutral-900 tracking-tight">{formatCurrency(order.total)}</p>
                          <p className="text-[10px] font-bold text-neutral-300 uppercase">Paid via {order.paymentMethod || 'Wallet'}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Fleet Overview (Branches) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-neutral-900 tracking-tight">Fleet Bases</h2>
              <p className="text-sm font-medium text-neutral-400">Operational centers</p>
            </div>
            <Link to="/admin/branches" className="w-10 h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-400 hover:text-primary-600 hover:border-primary-100 transition-all shadow-sm">
              <Plus className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid gap-3">
            {branches.slice(0, 4).map((branch, i) => (
              <motion.div
                key={branch._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/admin/branches/${branch._id}`}>
                  <Card className="p-4 rounded-[24px] border-neutral-100 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", branch.isActive ? "bg-success-50 text-success-600" : "bg-neutral-50 text-neutral-400")}>
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 leading-none mb-0.5">{branch.name}</p>
                          <p className="text-[10px] font-medium text-neutral-400">
                            {branch.address?.city}
                          </p>
                        </div>
                      </div>
                      <div className={cn("w-2 h-2 rounded-full", branch.isActive ? "bg-success-500" : "bg-neutral-300")} />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Premium CTA Card */}
          <Card className="mt-6 p-6 rounded-[32px] bg-neutral-900 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 blur-[40px] rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
            <div className="relative z-10 space-y-4">
              <h3 className="text-lg font-black tracking-tight leading-tight">Scale Your Operation</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-medium">Add new service categories or expand to a new territory today.</p>
              <Link to="/admin/services">
                <Button className="w-full h-12 rounded-2xl font-black shadow-xl shadow-primary-500/20">
                  Expand Now
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Admin Command Center (Shortcuts) */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-neutral-900 tracking-tight italic">COMMAND CENTER</h2>
          <div className="h-px flex-1 mx-6 bg-neutral-100" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'Orders', icon: Package, path: '/admin/orders', color: 'text-primary-600' },
            { label: 'Fleet', icon: MapPin, path: '/admin/branches', color: 'text-indigo-600' },
            { label: 'Catalog', icon: FileText, path: '/admin/services', color: 'text-pink-600' },
            { label: 'Vault', icon: CreditCard, path: '/admin/payments', color: 'text-emerald-600' },
            { label: 'Logistics', icon: Clock, path: '/admin/tasks', color: 'text-orange-600' },
            { label: 'Metrics', icon: BarChart3, path: '/admin/reports', color: 'text-blue-600' }
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + (i * 0.05) }}
            >
              <Link to={item.path}>
                <Card className="text-center py-6 rounded-[32px] border-neutral-100 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-100/10 transition-all cursor-pointer group">
                  <div className={cn("w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform", item.color.replace('text-', 'bg-').replace('-600', '-50'))}>
                    <item.icon className={cn("w-6 h-6", item.color)} />
                  </div>
                  <p className="text-xs font-black text-neutral-900 tracking-widest uppercase">{item.label}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default AdminDashboard;
