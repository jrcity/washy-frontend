import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Filter } from 'lucide-react';
import { useOrders } from '@/hooks';
import { PageWrapper } from '@/components/layout';
import { Card, Input, Button, Badge, LoadingScreen } from '@/components/ui';
import { getStatusColor, getStatusText, formatCurrency } from '@/lib/utils';
import type { OrderStatus } from '@/types';

export const BranchOrderManagerPage = () => {
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
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'In Process', value: 'in_process' },
    { label: 'Ready', value: 'ready' },
    { label: 'Out for Delivery', value: 'out_for_delivery' },
  ];

  if (isLoading) return <LoadingScreen />;

  return (
    <PageWrapper 
      title="Order Management" 
      description="Manage and process incoming laundry orders"
    >
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search order # or customer name..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {tabs.map((tab) => (
            <Button
              key={tab.value}
              variant={statusFilter === tab.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(tab.value)}
              className="whitespace-nowrap"
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card variant="bordered" className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
            <h3 className="text-lg font-medium text-neutral-900">No orders found</h3>
            <p className="text-neutral-500">Try adjusting your filters</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <Link key={order._id} to={`/branch/orders/${order._id}`}>
                <Card variant="bordered" hover className="transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary-50 text-primary-600 rounded-lg">
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
                          {order.customer.name} • {order.items.length} Items
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 min-w-[200px]">
                      <div className="text-right">
                        <p className="text-sm text-neutral-500">Total Amount</p>
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
