import { Link } from 'react-router-dom';
import { 
  Package, 
  MapPin, 
  Users, 
  CreditCard, 
  TrendingUp, 
  FileText,
  Tag,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Card, Badge, SkeletonCard } from '@/components/ui';
import { PageWrapper } from '@/components/layout';
import { useAuthContext } from '@/context/AuthContext';
import { useOrders, useOrderStats, useBranches } from '@/hooks';
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '@/lib/utils';

export const AdminDashboard = () => {
  const { user } = useAuthContext();
  const { data: ordersData, isLoading: ordersLoading } = useOrders({ limit: 5 });
  const { data: stats } = useOrderStats();
  const { data: branchesData } = useBranches({ limit: 100 });

  const orders = ordersData?.orders || [];
  const branches = branchesData?.branches || [];

  return (
    <PageWrapper
      title="Admin Dashboard"
      description={`Welcome back, ${user?.name}`}
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
        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-primary-600 hover:underline">
              View all
            </Link>
          </div>

          {ordersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link key={order._id} to={`/admin/orders/${order._id}`}>
                  <Card variant="bordered" hover>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-neutral-900">{order.orderNumber}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-500">
                          {order.customer?.name} • {formatDate(order.createdAt, 'PP')}
                        </p>
                      </div>
                      <p className="font-semibold text-neutral-900">{formatCurrency(order.total)}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Branches Overview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Branches</h2>
            <Link to="/admin/branches" className="text-sm text-primary-600 hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {branches.slice(0, 5).map((branch) => (
              <Link key={branch._id} to={`/admin/branches/${branch._id}`}>
                <Card variant="bordered" hover>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-neutral-900">{branch.name}</p>
                      <p className="text-sm text-neutral-500">
                        {branch.address?.city}, {branch.address?.state}
                      </p>
                    </div>
                    <Badge variant={branch.isActive ? 'success' : 'error'}>
                      {branch.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Management</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Link to="/admin/orders">
            <Card variant="bordered" hover className="text-center py-6">
              <Package className="w-8 h-8 mx-auto mb-2 text-primary-600" />
              <p className="font-medium text-neutral-900">Orders</p>
            </Card>
          </Link>
          <Link to="/admin/branches">
            <Card variant="bordered" hover className="text-center py-6">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-primary-600" />
              <p className="font-medium text-neutral-900">Branches</p>
            </Card>
          </Link>
          <Link to="/admin/services">
            <Card variant="bordered" hover className="text-center py-6">
              <FileText className="w-8 h-8 mx-auto mb-2 text-primary-600" />
              <p className="font-medium text-neutral-900">Services</p>
            </Card>
          </Link>
          <Link to="/admin/categories">
            <Card variant="bordered" hover className="text-center py-6">
              <Tag className="w-8 h-8 mx-auto mb-2 text-primary-600" />
              <p className="font-medium text-neutral-900">Categories</p>
            </Card>
          </Link>
          <Link to="/admin/users">
            <Card variant="bordered" hover className="text-center py-6">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary-600" />
              <p className="font-medium text-neutral-900">Users</p>
            </Card>
          </Link>
          <Link to="/admin/payments">
            <Card variant="bordered" hover className="text-center py-6">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-primary-600" />
              <p className="font-medium text-neutral-900">Payments</p>
            </Card>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AdminDashboard;
