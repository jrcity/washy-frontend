import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Package } from 'lucide-react';
import { useOrders } from '@/hooks';
import { PageWrapper } from '@/components/layout';
import { Card, Input, Button, Badge, LoadingScreen, EmptyState } from '@/components/ui';
import { getStatusColor, getStatusText, formatCurrency, formatDate } from '@/lib/utils';
import type { OrderStatus } from '@/types';

export const AdminOrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  
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
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Picked Up', value: 'picked_up' },
    { label: 'In Process', value: 'in_process' },
    { label: 'Ready', value: 'ready' },
    { label: 'Out for Delivery', value: 'out_for_delivery' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  if (isLoading) return <LoadingScreen />;

  return (
    <PageWrapper 
      title="All Orders" 
      description="View and manage all system orders"
    >
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search order # or customer..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:max-w-sm"
          />
        </div>
        <div className="flex gap-2 items-center">
            <Filter className="w-4 h-4 text-neutral-500" />
            <select
                className="h-10 px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                {tabs.map(tab => (
                    <option key={tab.value} value={tab.value}>{tab.label}</option>
                ))}
            </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card variant="bordered" className="py-12">
            <EmptyState
                title="No orders found"
                description="Try adjusting your filters or search terms"
            />
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <Link key={order._id} to={`/admin/orders/${order._id}`}>
                <Card variant="bordered" hover className="transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-neutral-50 text-neutral-600 rounded-lg">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-neutral-900">{order.orderNumber}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">
                          {order.customer.name} • {order.branch.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                          <span>{formatDate(order.createdAt)}</span>
                          <span>•</span>
                          <span>{order.items.length} Items</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 min-w-[200px]">
                      <div className="text-right">
                        <p className="text-sm text-neutral-500">Total</p>
                        <p className="font-bold text-neutral-900">{formatCurrency(order.total)}</p>
                      </div>
                      
                      <div className="text-right hidden md:block">
                        <p className="text-sm text-neutral-500">Payment</p>
                        <p className={`font-medium ${order.isPaid ? 'text-success-600' : 'text-warning-600'}`}>
                          {order.isPaid ? 'PAID' : 'UNPAID'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
