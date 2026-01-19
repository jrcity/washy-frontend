import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyOrders } from '@/hooks';
import { PageWrapper } from '@/components/layout';
import { Card, Badge, EmptyState, SkeletonCard, Button } from '@/components/ui';
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '@/lib/utils';
import { Package, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export const OrderHistoryPage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const { data, isLoading } = useMyOrders({ 
    page, 
    limit: 10,
    status: statusFilter 
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  const statuses = [
    { value: '', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'active', label: 'Active' }, // active isn't exact status, but maybe 'in_process'? Using exact match for now
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <PageWrapper
      title="Order History"
      description="View and track your past orders"
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <Filter className="w-4 h-4 text-neutral-500 hidden sm:block" />
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => {
                setStatusFilter(status.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                statusFilter === status.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : orders.length === 0 ? (
        <Card variant="bordered" className="py-12">
          <EmptyState
            icon={<Package className="w-12 h-12" />}
            title="No orders found"
            description={statusFilter ? "No orders match the selected filter" : "You haven't placed any orders yet"}
            action={statusFilter ? undefined : {
              label: 'Create Order',
              onClick: () => window.location.href = '/dashboard/new-order',
            }}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/dashboard/orders/${order._id}`}>
              <Card variant="bordered" hover className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-neutral-900">{order.orderNumber}</span>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-500">
                    <span>{formatDate(order.createdAt, 'PPP')}</span>
                    <span>{order.items?.length || 0} items</span>
                    <span>{order.payment?.method || 'Pay on Delivery'}</span>
                  </div>
                </div>

                <div className="text-right flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 mt-4 md:mt-0">
                  <div className="text-right">
                    <p className="font-bold text-neutral-900 text-lg">{formatCurrency(order.total)}</p>
                    <p className={`text-xs font-medium ${order.isPaid ? 'text-success-600' : 'text-warning-600'}`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button 
            variant="outline" 
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium text-neutral-600">
            Page {page} of {pagination.totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            disabled={page === pagination.totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </PageWrapper>
  );
};

export default OrderHistoryPage;
