import type { CreateOrderItemInput } from '@/types';
import { Card } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { useServices } from '@/hooks';

interface StepReviewProps {
  cart: CreateOrderItemInput[];
  meta: any;
}

export const StepReview = ({ cart, meta }: StepReviewProps) => {
  // We need to fetch service details to show names and prices again
  // In a real app, we might pass the full service objects or use a map
  const { data: services } = useServices({ isActive: true });
  
  const getServiceDetails = (id: string) => services?.find(s => s._id === id);

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const service = getServiceDetails(item.service);
      const price = service?.pricing[0]?.basePrice || 0;
      return acc + (price * item.quantity);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
        <h3 className="font-semibold text-neutral-900 mb-4">Order Summary</h3>
        <div className="space-y-3">
          {cart.map((item) => {
            const service = getServiceDetails(item.service);
            const price = service?.pricing[0]?.basePrice || 0;
            return (
              <div key={item.service} className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-2">
                   <span className="font-medium w-6 text-center bg-white border rounded">
                     {item.quantity}x
                   </span>
                   <span className="text-neutral-700">{service?.name || 'Loading...'}</span>
                 </div>
                 <span className="font-medium text-neutral-900">{formatCurrency(price * item.quantity)}</span>
              </div>
            );
          })}
        </div>
        <div className="h-px bg-neutral-200 my-4" />
        <div className="flex justify-between items-center text-lg font-bold text-neutral-900">
          <span>Total Estimate</span>
          <span>{formatCurrency(calculateTotal())}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card variant="bordered" className="p-4">
           <h4 className="text-sm font-medium text-neutral-500 mb-1">Pickup</h4>
           <p className="font-medium">{meta.pickupDate} at {meta.pickupTimeSlot}</p>
           <p className="text-sm text-neutral-600">123 Main St, Lagos</p>
        </Card>
        <Card variant="bordered" className="p-4">
           <h4 className="text-sm font-medium text-neutral-500 mb-1">Delivery</h4>
           <p className="font-medium">Standard Delivery (2-3 days)</p>
           <p className="text-sm text-neutral-600">123 Main St, Lagos</p>
        </Card>
      </div>
    </div>
  );
};
