import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Filter, ShoppingBag, ArrowRight, Clock, MapPin, ChevronRight, Zap } from 'lucide-react';
import { useOrders, useComponentLogger } from '@/hooks';
import { PageWrapper } from '@/components/layout';
import { Card, Input, Button, Badge, LoadingScreen, Select } from '@/components/ui';
import { getStatusColor, getStatusText, formatCurrency, formatDate, cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export const BranchOrderManagerPage = () => {
  useComponentLogger('BranchOrderManagerPage');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // In a real app we'd debounce search and pass it to API
  // For now assuming getAll supports status filtering
  const { data, isLoading } = useOrders({
    status: statusFilter === 'all' ? undefined : statusFilter,
    limit: 50
  });

  const orders = data?.orders || [];

  const filteredOrders = orders.filter(order => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(term) ||
      order.customer.name.toLowerCase().includes(term)
    );
  });

  const tabs: { label: string; value: OrderStatus | 'all' }[] = [
    { label: 'ALL MANIFESTS', value: 'all' },
    { label: 'PENDING', value: 'pending' },
    { label: 'CONFIRMED', value: 'confirmed' },
    { label: 'PICKED UP', value: 'picked_up' },
    { label: 'IN PROCESS', value: 'in_process' },
    { label: 'READY', value: 'ready' },
    { label: 'OUT FOR DELIVERY', value: 'out_for_delivery' },
    { label: 'DELIVERED', value: 'delivered' },
    { label: 'COMPLETED', value: 'completed' },
    { label: 'CANCELLED', value: 'cancelled' },
  ];

  if (isLoading) return <LoadingScreen />;

  return (
    <PageWrapper
      title="Fleet Hub"
      description="Strategic command for order logistics and processing"
    >
      <div className="space-y-10">
        {/* Command Controls */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="relative w-full lg:max-w-xl group">
            <Input
              placeholder="Search by manifest ID or client identity..."
              leftIcon={<Search className="w-5 h-5 text-primary" />}
              className="h-14 rounded-2xl bg-muted border-none group-hover:bg-muted/80 focus:bg-card focus:ring-primary/10 transition-all pl-14 font-bold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 bg-muted p-1.5 rounded-[28px] border border-border overflow-x-auto no-scrollbar w-full lg:w-fit">
            <div className="flex items-center gap-1.5 px-2">
              <Filter className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest hidden sm:block">Filter:</span>
            </div>
            <Select
              className="h-10 !bg-card !border-none !rounded-2xl font-black text-[10px] uppercase text-foreground tracking-widest min-w-[160px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={tabs}
            />
          </div>
        </div>

        {/* Manifest Feed */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="py-32 rounded-[48px] border-border border-dashed border-2 text-center shadow-inner bg-muted/20">
                  <div className="w-24 h-24 bg-card rounded-[40px] shadow-sm flex items-center justify-center mx-auto mb-8 border border-border">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground/20" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-2 italic">Zero Fleet Activity</h3>
                  <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">No manifests detected matching your current parameters</p>
                </Card>
              </motion.div>
            ) : (
              <div className="grid gap-6">
                {filteredOrders.map((order, i) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link to={`/branch/orders/${order._id}`}>
                      <Card className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-border bg-card hover:border-primary/50 hover:shadow-[0_20px_60px_-15px_rgba(var(--primary-rgb),0.1)] transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                          <div className="flex items-start md:items-center gap-6 md:gap-8">
                            {/* Tactical Icon */}
                            <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[30px] bg-muted border border-border flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform shrink-0">
                              <Package className="w-6 h-6 md:w-9 md:h-9 text-primary" />
                            </div>

                            <div className="space-y-2 md:space-y-4">
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-lg md:text-2xl font-black italic tracking-tighter leading-none text-foreground uppercase group-hover:text-primary transition-colors">#{order.orderNumber}</h3>
                                <Badge className={cn("rounded-full px-4 py-1.5 font-black italic uppercase text-[9px] md:text-[10px] tracking-widest border-none shadow-sm", getStatusColor(order.status))}>
                                  {getStatusText(order.status)}
                                </Badge>
                                {order.isPaid && (
                                  <Badge className="bg-success/10 text-success border-none font-black text-[10px] italic py-1 px-3 rounded-full">TRANS-VERIFIED</Badge>
                                ) || (
                                    <Badge className="bg-warning/10 text-warning border-none font-black text-[10px] italic py-1 px-3 rounded-full">UNSETTLED</Badge>
                                  )}
                              </div>

                              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8">
                                <div className="flex items-center gap-2">
                                  <div className="p-1 bg-muted rounded-lg"><ShoppingBag className="w-3.5 h-3.5 text-muted-foreground/60" /></div>
                                  <span className="text-xs font-black text-foreground uppercase tracking-tight italic">{order.customer.name}</span>
                                  <span className="mx-1 text-muted-foreground/40">•</span>
                                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{order.items.length} Units</span>
                                </div>
                                <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-8">
                                  <div className="p-1 bg-muted rounded-lg"><Clock className="w-3.5 h-3.5 text-muted-foreground/60" /></div>
                                  <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">LOGGED: {formatDate(order.createdAt, 'MMM d, HH:mm')}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between lg:justify-end gap-10 lg:pl-10 lg:border-l border-border">
                            <div className="text-right">
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Contract Value</p>
                              <p className="text-2xl font-black text-foreground tracking-tighter italic">{formatCurrency(order.total)}</p>
                            </div>

                            <Button
                              className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-3xl p-0 font-black shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform shrink-0"
                            >
                              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
};
