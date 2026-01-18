import { Link } from 'react-router-dom';
import { Plus, Package, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { Button, Card, Badge, EmptyState, SkeletonCard } from '@/components/ui';
import { PageWrapper } from '@/components/layout';
import { useAuthContext } from '@/context/AuthContext';
import { useMyOrders } from '@/hooks';
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '@/lib/utils';

export const CustomerDashboard = () => {
  const { user } = useAuthContext();
  const { data: ordersData, isLoading } = useMyOrders({ limit: 5 });

  const orders = ordersData?.orders || [];

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => ['pending', 'confirmed', 'picked_up', 'in_process'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'completed').length,
    totalSpent: orders.reduce((acc, o) => acc + (o.isPaid ? o.total : 0), 0),
  };

  return (
    <PageWrapper
      title={`Welcome back, ${user?.name?.split(' ')[0]}!`}
      description="Here's what's happening with your laundry"
      action={
        <Link to="/dashboard/new-order">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            New Order
          </Button>
        </Link>
      }
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Orders</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning-50 text-warning-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">In Progress</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.pending}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success-50 text-success-600 rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Completed</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.completed}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary-100 text-secondary-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Spent</p>
              <p className="text-2xl font-bold text-neutral-900">{formatCurrency(stats.totalSpent)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">Recent Orders</h2>
          <Link to="/dashboard/orders" className="text-sm text-primary-600 hover:underline">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : orders.length === 0 ? (
          <Card variant="bordered">
            <EmptyState
              icon={<Package className="w-8 h-8" />}
              title="No orders yet"
              description="Place your first order and let us handle your laundry"
              action={{
                label: 'Create Order',
                onClick: () => window.location.href = '/dashboard/new-order',
              }}
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order._id} to={`/dashboard/orders/${order._id}`}>
                <Card variant="bordered" hover className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-neutral-900">{order.orderNumber}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-500">
                      {order.items?.length || 0} items • {formatDate(order.createdAt, 'PPP')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-neutral-900">{formatCurrency(order.total)}</p>
                    <p className="text-sm text-neutral-500">
                      {order.isPaid ? 'Paid' : 'Payment pending'}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/dashboard/new-order">
            <Card variant="bordered" hover className="text-center py-6">
              <div className="text-3xl mb-2">🧺</div>
              <p className="font-medium text-neutral-900">New Order</p>
            </Card>
          </Link>
          <Link to="/dashboard/orders">
            <Card variant="bordered" hover className="text-center py-6">
              <div className="text-3xl mb-2">📦</div>
              <p className="font-medium text-neutral-900">Track Orders</p>
            </Card>
          </Link>
          <Link to="/services">
            <Card variant="bordered" hover className="text-center py-6">
              <div className="text-3xl mb-2">📋</div>
              <p className="font-medium text-neutral-900">View Prices</p>
            </Card>
          </Link>
          <Link to="/dashboard/profile">
            <Card variant="bordered" hover className="text-center py-6">
              <div className="text-3xl mb-2">👤</div>
              <p className="font-medium text-neutral-900">My Profile</p>
            </Card>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CustomerDashboard;
