import type { CreateOrderItemInput, Address } from '@/types';
import { Card } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import { useServices, useBranches } from '@/hooks';

interface StepReviewProps {
  cart: CreateOrderItemInput[];
  meta: any;
  branchId?: string;
  userAddress?: Address;
}

export const StepReview = ({ cart, meta, branchId, userAddress }: StepReviewProps) => {
  const { data: branches } = useBranches();
  const selectedBranch = branches?.find(b => b._id === branchId);
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
      <div className="bg-muted p-6 rounded-xl border border-border">
        <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
        <div className="space-y-3">
          {cart.map((item) => {
            const service = getServiceDetails(item.service);
            const price = service?.pricing[0]?.basePrice || 0;
            return (
              <div key={item.service} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium w-6 text-center bg-card border border-border rounded text-foreground">
                    {item.quantity}x
                  </span>
                  <span className="text-foreground/80">{service?.name || 'Loading...'}</span>
                </div>
                <span className="font-medium text-foreground">{formatCurrency(price * item.quantity)}</span>
              </div>
            );
          })}
        </div>
        <div className="h-px bg-border my-4" />
        <div className="flex justify-between items-center text-lg font-bold text-foreground">
          <span>Total Estimate</span>
          <span>{formatCurrency(calculateTotal())}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card variant="bordered" className="p-4 bg-card border-border">
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Pickup</h4>
          <p className="font-medium text-foreground">{meta.pickupDate} at {meta.pickupTimeSlot}</p>
          <p className="text-sm text-muted-foreground">
            {userAddress ? `${userAddress.street}, ${userAddress.area}${userAddress.landmark ? ` (Near ${userAddress.landmark})` : ''}` : 'No address selected'}
          </p>
        </Card>
        <Card variant="bordered" className="p-4 bg-card border-border">
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Delivery</h4>
          <p className="font-medium text-foreground">Standard Delivery (2-3 days)</p>
          <p className="text-sm text-muted-foreground">
            {userAddress ? `${userAddress.street}, ${userAddress.area}${userAddress.landmark ? ` (Near ${userAddress.landmark})` : ''}` : 'No address selected'}
          </p>
        </Card>
        {selectedBranch && (
          <Card variant="bordered" className="p-4 md:col-span-2 bg-card border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Processing Branch</h4>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-foreground">{selectedBranch.name}</p>
                <p className="text-xs text-muted-foreground">{selectedBranch.address.street}, {selectedBranch.address.city}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div >
  );
};
