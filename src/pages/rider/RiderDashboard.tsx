import { Truck, Package, CheckCircle, Clock, MapPin } from 'lucide-react';
import { Card, Badge, EmptyState, SkeletonCard } from '@/components/ui';
import { PageWrapper } from '@/components/layout';
import { useAuthContext } from '@/context/AuthContext';
import { useOrders } from '@/hooks';
import { formatDate } from '@/lib/utils';

export const RiderDashboard = () => {
  const { user } = useAuthContext();
  // Get orders assigned to this rider
  const { data: ordersData, isLoading } = useOrders({ limit: 20 });
  
  const orders = ordersData?.orders || [];
  
  // Filter for rider's assignments (pickup or delivery)
  const myAssignments = orders.filter(
    o => o.pickupRider?._id === user?._id || o.deliveryRider?._id === user?._id
  );
  
  const pickups = myAssignments.filter(o => o.status === 'confirmed' && o.pickupRider?._id === user?._id);
  const deliveries = myAssignments.filter(o => o.status === 'out_for_delivery' && o.deliveryRider?._id === user?._id);
  const completed = myAssignments.filter(o => o.status === 'completed');

  return (
    <PageWrapper
      title={`Hey, ${user?.name?.split(' ')[0]}!`}
      description="Your assignments for today"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-info-50 text-info-600 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Pickups</p>
              <p className="text-2xl font-bold text-neutral-900">{pickups.length}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning-50 text-warning-600 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Deliveries</p>
              <p className="text-2xl font-bold text-neutral-900">{deliveries.length}</p>
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
              <p className="text-2xl font-bold text-neutral-900">{completed.length}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Total Today</p>
              <p className="text-2xl font-bold text-neutral-900">{myAssignments.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Pickups */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Pending Pickups ({pickups.length})
        </h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : pickups.length === 0 ? (
          <Card variant="bordered">
            <EmptyState
              title="No pending pickups"
              description="Check back later for new assignments"
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {pickups.map((order) => (
              <Card key={order._id} variant="bordered" className="cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-neutral-900">{order.orderNumber}</span>
                      <Badge variant="info">Pickup</Badge>
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">
                      Customer: {order.customer?.name || 'N/A'}
                    </p>
                    <div className="flex items-start gap-1 text-sm text-neutral-500">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {order.pickupAddress?.street}, {order.pickupAddress?.area}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-neutral-900">
                      {order.pickupTimeSlot}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {formatDate(order.pickupDate, 'PP')}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pending Deliveries */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Pending Deliveries ({deliveries.length})
        </h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : deliveries.length === 0 ? (
          <Card variant="bordered">
            <EmptyState
              title="No pending deliveries"
              description="Check back later for new assignments"
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {deliveries.map((order) => (
              <Card key={order._id} variant="bordered" className="cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-neutral-900">{order.orderNumber}</span>
                      <Badge variant="warning">Delivery</Badge>
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">
                      Customer: {order.customer?.name || 'N/A'}
                    </p>
                    <div className="flex items-start gap-1 text-sm text-neutral-500">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {order.deliveryAddress?.street}, {order.deliveryAddress?.area}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-neutral-900">
                      {order.items?.length || 0} items
                    </p>
                    <p className="text-sm text-neutral-500">
                      {formatDate(order.expectedDeliveryDate, 'PP')}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default RiderDashboard;
