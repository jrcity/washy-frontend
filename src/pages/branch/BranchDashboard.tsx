import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, TrendingUp, Users, BarChart3, ClipboardList, CreditCard, ChevronRight, Zap } from 'lucide-react';
import { Card, Badge, SkeletonCard, Button } from '@/components/ui';
import { PageWrapper } from '@/components/layout';
import { useAuthContext } from '@/context/AuthContext';
import { useOrders, useOrderStats, useComponentLogger } from '@/hooks';
import { formatCurrency, getStatusColor, getStatusText, cn, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';

export const BranchDashboard = () => {
  const { user } = useAuthContext();
  useComponentLogger('BranchDashboard', { userId: user?._id });
  const { data: ordersData, isLoading } = useOrders({ limit: 10 });
  const { data: stats } = useOrderStats();

  const orders = ordersData?.orders || [];
  const pendingOrders = orders.filter(o => ['pending', 'confirmed'].includes(o.status));
  const inProcessOrders = orders.filter(o => ['picked_up', 'in_process'].includes(o.status));

  const statConfig = [
    { label: 'Fleet Volume', value: stats?.totalOrders || 0, icon: Package, color: 'text-primary', bg: 'bg-primary/5', trend: 'ACTIVE' },
    { label: 'Dispatch Queue', value: stats?.pendingOrders || 0, icon: Clock, color: 'text-warning', bg: 'bg-warning/5', trend: 'PENDING' },
    { label: 'Operations Success', value: stats?.completedOrders || 0, icon: CheckCircle, color: 'text-success', bg: 'bg-success/5', trend: 'VERIFIED' },
    { label: 'Capital Flow', value: formatCurrency(stats?.totalRevenue || 0), icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/5', trend: 'GROWTH' },
  ];

  return (
    <PageWrapper
      title="Fleet Command"
      description={`Tactical overview for ${user?.name}`}
    >
      <div className="space-y-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statConfig.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-8 rounded-[40px] border-border bg-card shadow-xl relative overflow-hidden group hover:border-primary/30 transition-all">
                <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl -mr-12 -mt-12 transition-colors", stat.bg)} />
                <div className="relative z-10 flex flex-col gap-6">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform", stat.bg)}>
                    <stat.icon className={cn("w-7 h-7", stat.color)} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                    <div className="flex items-end justify-between">
                      <h4 className="text-3xl font-black text-foreground tracking-tighter italic leading-none">{stat.value}</h4>
                      <Badge className="bg-muted text-muted-foreground/60 border-none font-black text-[8px] tracking-tighter uppercase rounded-full px-2 py-0.5">{stat.trend}</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tactical Feeds */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Incoming Manifests */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                <h2 className="text-sm font-black text-foreground uppercase tracking-wider italic">Awaiting Confirmed Status</h2>
              </div>
              <Link to="/branch/orders?status=pending">
                <Button variant="ghost" className="text-[10px] font-black text-primary uppercase tracking-widest gap-2 hover:bg-primary/5 rounded-full px-4">
                  Full Manifest <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} className="rounded-[32px]" />)
              ) : pendingOrders.length === 0 ? (
                <Card className="py-20 rounded-[40px] border-dashed border-2 border-border bg-muted/20 text-center">
                  <Zap className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Sky clear • No pending manifests</p>
                </Card>
              ) : (
                pendingOrders.slice(0, 4).map((order) => (
                  <Link key={order._id} to={`/branch/orders/${order._id}`}>
                    <Card className="p-6 rounded-[32px] border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all group overflow-hidden relative">
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center font-black text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {order.orderNumber.slice(-2)}
                          </div>
                          <div>
                            <p className="font-black text-foreground italic uppercase text-xs tracking-tight">#{order.orderNumber}</p>
                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">{order.customer.name}</p>
                          </div>
                        </div>
                        <Badge className={cn("rounded-full px-3 py-1 font-black italic uppercase text-[8px] tracking-widest border-none shadow-sm", getStatusColor(order.status))}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Operational Units */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h2 className="text-sm font-black text-foreground uppercase tracking-wider italic">Active Deployment Flow</h2>
              </div>
              <Link to="/branch/orders?status=in_process">
                <Button variant="ghost" className="text-[10px] font-black text-primary uppercase tracking-widest gap-2 hover:bg-primary/5 rounded-full px-4">
                  Full Analytics <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} className="rounded-[32px]" />)
              ) : inProcessOrders.length === 0 ? (
                <Card className="py-20 rounded-[40px] border-dashed border-2 border-border bg-muted/20 text-center">
                  <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">All units stationary</p>
                </Card>
              ) : (
                inProcessOrders.slice(0, 4).map((order) => (
                  <Link key={order._id} to={`/branch/orders/${order._id}`}>
                    <Card className="p-6 rounded-[32px] border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all group overflow-hidden relative">
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-black text-foreground italic uppercase text-xs tracking-tight">#{order.orderNumber}</p>
                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">{order.items?.length || 0} Assets In Matrix</p>
                          </div>
                        </div>
                        <Badge className={cn("rounded-full px-3 py-1 font-black italic uppercase text-[8px] tracking-widest border-none shadow-sm", getStatusColor(order.status))}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Strategic Shortcuts */}
        <div className="pt-8">
          <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-8 px-2">Logistics Switchboard</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { to: "/branch/orders", icon: Package, label: "Dispatcher" },
              { to: "/branch/tasks", icon: ClipboardList, label: "Objective Map" },
              ...(user?.role === 'branch_manager' ? [
                { to: "/branch/analytics", icon: BarChart3, label: "Intelligence" },
                { to: "/branch/payments", icon: CreditCard, label: "Fiscal Ledger" }
              ] : []),
              ...(user?.role === 'admin' || user?.role === 'branch_manager' ? [
                { to: "/branch/staff", icon: Users, label: "Personnel" }
              ] : [])
            ].map((action, i) => (
              <motion.div
                key={action.to}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <Link to={action.to}>
                  <Card className="p-8 text-center rounded-[40px] bg-card border-border hover:border-primary/50 hover:bg-muted/30 transition-all group shadow-sm">
                    <div className="w-16 h-16 bg-muted rounded-[24px] flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 group-hover:scale-110 transition-transform shadow-inner">
                      <action.icon className="w-8 h-8 text-primary" />
                    </div>
                    <p className="font-black text-foreground uppercase italic text-[11px] tracking-widest">{action.label}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default BranchDashboard;
