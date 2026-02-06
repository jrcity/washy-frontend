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
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning/10 text-warning rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
            </div>
          </div>
        </Card>

        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success/10 text-success rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
            </div>
          </div>
        </Card>

        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalSpent)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
          <Link to="/dashboard/orders" className="text-sm text-primary hover:underline">
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
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <Link key={order._id} to={`/dashboard/orders/${order._id}`}>
                <Card variant="bordered" hover className="flex flex-col sm:flex-row sm:items-center gap-4 border-border bg-card">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{order.orderNumber}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.items?.length || 0} items • {formatDate(order.createdAt, 'PPP')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{formatCurrency(order.total)}</p>
                    <p className="text-sm text-muted-foreground">
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
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/dashboard/new-order">
            <Card variant="bordered" hover className="text-center py-6 bg-card border-border">
              <div className="text-3xl mb-2">🧺</div>
              <p className="font-medium text-foreground">New Order</p>
            </Card>
          </Link>
          <Link to="/dashboard/orders">
            <Card variant="bordered" hover className="text-center py-6 bg-card border-border">
              <div className="text-3xl mb-2">📦</div>
              <p className="font-medium text-foreground">Track Orders</p>
            </Card>
          </Link>
          <Link to="/services">
            <Card variant="bordered" hover className="text-center py-6 bg-card border-border">
              <div className="text-3xl mb-2">📋</div>
              <p className="font-medium text-foreground">View Prices</p>
            </Card>
          </Link>
          <Link to="/dashboard/profile">
            <Card variant="bordered" hover className="text-center py-6 bg-card border-border">
              <div className="text-3xl mb-2">👤</div>
              <p className="font-medium text-foreground">My Profile</p>
            </Card>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CustomerDashboard;
