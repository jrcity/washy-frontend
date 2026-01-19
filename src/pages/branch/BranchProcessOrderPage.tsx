import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Package, MapPin, Phone, User, Clock, 
  CheckCircle, Truck, AlertTriangle, ArrowLeft 
} from 'lucide-react';
import { useOrder, useUpdateOrderStatus } from '@/hooks';
import { PageWrapper } from '@/components/layout';
import { Card, Badge, Button, LoadingScreen } from '@/components/ui';
import { getStatusColor, getStatusText, formatCurrency, formatDate } from '@/lib/utils';
import { AssignRiderModal } from './BranchAssignRiderModal';
import type { OrderStatus } from '@/types';

export const BranchProcessOrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(id!);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();
  
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);

  if (isLoading) return <LoadingScreen />;
  if (!order) return <div className="text-center py-12">Order not found</div>;

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    updateStatus(
      { id: order._id, data: { status: newStatus } },
      {
        onSuccess: () => {
          setSelectedStatus('');
        }
      }
    );
  };

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'picked_up', label: 'Picked Up by Rider' },
    { value: 'in_process', label: 'In Process (Cleaning)' },
    { value: 'ready', label: 'Ready for Delivery/Pickup' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <PageWrapper
      title={`Order #${order.orderNumber}`}
      description="Process and manage order details"
      action={
        <Button variant="outline" size="sm" onClick={() => navigate('/branch/orders')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Management */}
          <Card className="p-6 border-primary-100 bg-primary-50/30">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary-600" />
              Manage Status
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <p className="text-sm text-neutral-500 mb-1">Current Status</p>
                <div className="flex items-center gap-3">
                   <Badge className={`${getStatusColor(order.status)} text-base py-1 px-3`}>
                    {getStatusText(order.status)}
                   </Badge>
                </div>
              </div>
              
              <div className="flex items-end gap-2 w-full md:w-auto">
                <div className="w-full md:w-48">
                   <p className="text-sm text-neutral-500 mb-1">Update to</p>
                   <select
                     className="w-full h-10 px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                     value={selectedStatus}
                     onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                       if (e.target.value) handleStatusUpdate(e.target.value as OrderStatus);
                     }}
                     disabled={isUpdating}
                   >
                     <option value="">Select Action...</option>
                     {statusOptions.map(opt => (
                       <option key={opt.value} value={opt.value} disabled={opt.value === order.status}>
                         {opt.label}
                       </option>
                     ))}
                   </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Items */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-neutral-500" />
              Order Items
            </h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b border-neutral-100 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center font-semibold text-neutral-600">
                      {item.quantity}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">
                        {typeof item.service === 'string' ? 'Service' : item.service.name}
                      </p>
                      <p className="text-sm text-neutral-500 capitalize">{item.garmentType}</p>
                      {item.notes && (
                         <p className="text-xs text-warning-600 mt-1 flex items-center gap-1">
                           <AlertTriangle className="w-3 h-3" /> Note: {item.notes}
                         </p>
                      )}
                    </div>
                  </div>
                  <p className="font-medium text-neutral-900">{formatCurrency(item.subtotal)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-100 mt-6 pt-4">
               <div className="flex justify-between font-bold text-lg">
                 <span>Total Amount</span>
                 <span>{formatCurrency(order.total)}</span>
               </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-neutral-500" />
              Customer
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                   {order.customer.name.charAt(0)}
                 </div>
                 <div>
                   <p className="font-medium text-neutral-900">{order.customer.name}</p>
                   {/* In real app showing phone would be good */}
                   <p className="text-sm text-neutral-500">{order.customer.email}</p> 
                 </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                <Phone className="w-4 h-4 mr-2" />
                Contact Customer
              </Button>
            </div>
          </Card>

          {/* Locations */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-neutral-500" />
              Locations
            </h3>
            <div className="space-y-4 relative">
              {/* Vertical line connecting dots */}
              <div className="absolute left-[11px] top-8 bottom-8 w-0.5 bg-neutral-200"></div>
              
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-neutral-100 border-2 border-white shadow-sm flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                </div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Pickup</p>
                <p className="text-sm text-neutral-900">{order.pickupAddress.street}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-neutral-500">
                  <Clock className="w-3 h-3" />
                  {formatDate(order.pickupDate, 'PP')} • {order.pickupTimeSlot}
                </div>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-neutral-100 border-2 border-white shadow-sm flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-success-500"></div>
                </div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Delivery</p>
                <p className="text-sm text-neutral-900">{order.deliveryAddress.street}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-neutral-500">
                  <Clock className="w-3 h-3" />
                  Est. {formatDate(order.expectedDeliveryDate, 'PP')}
                </div>
              </div>
            </div>
          </Card>

          {/* Rider Assignment */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-neutral-500" />
              Logistics
            </h3>
            {order.pickupRider || order.deliveryRider ? (
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600 font-bold">
                   {(order.pickupRider || order.deliveryRider)?.name?.charAt(0)}
                 </div>
                 <div>
                   <p className="font-medium text-neutral-900">{(order.pickupRider || order.deliveryRider)?.name}</p>
                   <p className="text-xs text-neutral-500">Assigned Rider</p>
                 </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-500 mb-4">No rider assigned yet.</p>
            )}
            <Button 
               variant="outline" 
               className="w-full"
               onClick={() => setIsRiderModalOpen(true)}
            >
              {order.pickupRider || order.deliveryRider ? 'Reassign Rider' : 'Assign Rider'}
            </Button>
          </Card>
        </div>
      </div>

       <AssignRiderModal
        isOpen={isRiderModalOpen}
        onClose={() => setIsRiderModalOpen(false)}
        orderId={order._id}
        type="delivery" // Defaulting to delivery for now
      />
    </PageWrapper>
  );
};
