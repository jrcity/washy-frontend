import { useState } from 'react';
import { useOrders } from '@/hooks';
import { PageWrapper } from '@/components/layout';
import { Card, Badge, Button, EmptyState, SkeletonCard } from '@/components/ui';
import { MapPin, Truck, Package, RefreshCw, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export const RiderTasksPage = () => {
  const [activeTab, setActiveTab] = useState<'pickups' | 'deliveries'>('pickups');
  // In real app, this would fetch 'unassigned' tasks in rider's zone
  // For now using all orders for demo purposes, filtering client-side
  const { data: ordersData, isLoading, refetch } = useOrders({ 
    limit: 50, 
    status: activeTab === 'pickups' ? 'confirmed' : 'ready' 
  });

  const orders = ordersData?.orders || [];
  
  // Logic for available tasks
  // Pickups: Status is 'confirmed' (Paid & ready for pickup)
  // Deliveries: Status is 'ready' (Processed & ready for delivery)
  const tasks = orders.filter(o => !o.pickupRider && !o.deliveryRider); 

  // Count availability (separate queries would be better but for now distinct counts are harder without extra calls)
  // We'll just show the count of current list
  const availablePickupsCount = activeTab === 'pickups' ? tasks.length : '?'; 
  const availableDeliveriesCount = activeTab === 'deliveries' ? tasks.length : '?';

  const handleAcceptTask = (id: string) => {
    // TODO: Implement accept task mutation
    toast.success('Task accepted! Navigate to dashboard to start.');
  };

  return (
    <PageWrapper
      title="Available Tasks"
      description="Accept new pickups and deliveries in your area"
      action={
        <Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw className="w-4 h-4" />}>
          Refresh
        </Button>
      }
    >
      {/* Tabs */}
      <div className="flex border-b border-neutral-200 mb-6">
        <button
          onClick={() => setActiveTab('pickups')}
          className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'pickups' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <Truck className="w-4 h-4" />
          Pickups
          {activeTab === 'pickups' && <Badge size="sm" variant="secondary" className="ml-2">{tasks.length}</Badge>}
        </button>
        <button
          onClick={() => setActiveTab('deliveries')}
          className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'deliveries' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <Package className="w-4 h-4" />
          Deliveries
          {activeTab === 'deliveries' && <Badge size="sm" variant="secondary" className="ml-2">{tasks.length}</Badge>}
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : tasks.length === 0 ? (
        <Card variant="bordered" className="py-12">
          <EmptyState
            title={`No available ${activeTab}`}
            description="There are no tasks available in your area right now."
          />
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((order) => (
            <Card key={order._id} variant="bordered" className="flex flex-col h-full">
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant={activeTab === 'pickups' ? 'info' : 'warning'}>
                    {activeTab === 'pickups' ? 'Pickup' : 'Delivery'}
                  </Badge>
                  <span className="text-sm font-medium text-neutral-900">{formatCurrency(order.deliveryFee)} Earn</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-900">
                        {activeTab === 'pickups' ? order.pickupAddress.area : order.deliveryAddress.area}
                      </p>
                      <p className="text-sm text-neutral-500 line-clamp-2">
                        {activeTab === 'pickups' ? order.pickupAddress.street : order.deliveryAddress.street}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Clock className="w-5 h-5 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-neutral-900">
                        {activeTab === 'pickups' ? order.pickupTimeSlot : 'ASAP'}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {formatDate(activeTab === 'pickups' ? order.pickupDate : order.expectedDeliveryDate, 'PP')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-neutral-100 bg-neutral-50 rounded-b-xl">
                <Button className="w-full" onClick={() => handleAcceptTask(order._id)}>
                  Accept Task
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

// Helper for currency since not imported
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
};

export default RiderTasksPage;
