import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { Card, Badge, SkeletonCard } from '@/components/ui';
import { PageWrapper } from '@/components/layout';
import { useAuthContext } from '@/context/AuthContext';
import { useOrders, useOrderStats } from '@/hooks';
import { formatCurrency, getStatusColor, getStatusText } from '@/lib/utils';

export const BranchDashboard = () => {
  const { user } = useAuthContext();
  const { data: ordersData, isLoading } = useOrders({ limit: 10 });
  const { data: stats } = useOrderStats();

  const orders = ordersData?.orders || [];
  const pendingOrders = orders.filter(o => ['pending', 'confirmed'].includes(o.status));
  const inProcessOrders = orders.filter(o => ['picked_up', 'in_process'].includes(o.status));

  return (
    <PageWrapper
      title="Branch Dashboard"
      description={`Welcome back, ${user?.name}`}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Orders</p>
              <p className="text-2xl font-bold text-neutral-900">{stats?.totalOrders || 0}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning-50 text-warning-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Pending</p>
              <p className="text-2xl font-bold text-neutral-900">{stats?.pendingOrders || 0}</p>
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
              <p className="text-2xl font-bold text-neutral-900">{stats?.completedOrders || 0}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary-100 text-secondary-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Revenue</p>
              <p className="text-2xl font-bold text-neutral-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="mt-8 grid lg:grid-cols-2 gap-8">
        {/* Pending Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Pending Orders</h2>
            <Link to="/branch/orders?status=pending" className="text-sm text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : pendingOrders.length === 0 ? (
            <Card variant="bordered" className="text-center py-8">
              <p className="text-neutral-500">No pending orders</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingOrders.slice(0, 5).map((order) => (
                <Link key={order._id} to={`/branch/orders/${order._id}`}>
                  <Card variant="bordered" hover>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-neutral-900">{order.orderNumber}</p>
                        <p className="text-sm text-neutral-500">{order.customer?.name}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* In Process Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">In Process</h2>
            <Link to="/branch/orders?status=in_process" className="text-sm text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : inProcessOrders.length === 0 ? (
            <Card variant="bordered" className="text-center py-8">
              <p className="text-neutral-500">No orders in process</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {inProcessOrders.slice(0, 5).map((order) => (
                <Link key={order._id} to={`/branch/orders/${order._id}`}>
                  <Card variant="bordered" hover>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-neutral-900">{order.orderNumber}</p>
                        <p className="text-sm text-neutral-500">{order.items?.length || 0} items</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/branch/orders">
            <Card variant="bordered" hover className="text-center py-6">
              <Package className="w-8 h-8 mx-auto mb-2 text-primary-600" />
              <p className="font-medium text-neutral-900">All Orders</p>
            </Card>
          </Link>
          <Link to="/branch/stats">
            <Card variant="bordered" hover className="text-center py-6">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-primary-600" />
              <p className="font-medium text-neutral-900">Analytics</p>
            </Card>
          </Link>
          <Link to="/branch/staff">
            <Card variant="bordered" hover className="text-center py-6">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary-600" />
              <p className="font-medium text-neutral-900">Staff</p>
            </Card>
          </Link>
          <Link to="/services">
            <Card variant="bordered" hover className="text-center py-6">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary-600" />
              <p className="font-medium text-neutral-900">Services</p>
            </Card>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};

export default BranchDashboard;
