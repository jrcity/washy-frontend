import {
  useServices
} from '@/hooks';
import type { CreateOrderItemInput, Service, ServicePricing } from '@/types';
import { Button, Card, EmptyState, Spinner } from '@/components/ui';
import { Plus, Minus, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

interface StepServicesProps {
  cart: CreateOrderItemInput[];
  setCart: (cart: CreateOrderItemInput[]) => void;
}

export const StepServices = ({ cart, setCart }: StepServicesProps) => {
  const { data: services, isLoading: isLoadingServices } = useServices({
    isActive: true
  });

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Helper to find item in cart matching service AND garment type
  const findCartItem = (serviceId: string, garmentType: string) => {
    return cart.find(i => i.service === serviceId && i.garmentType === garmentType);
  };

  const updateQuantity = (service: Service, priceOption: ServicePricing, delta: number) => {
    const existingItem = findCartItem(service._id, priceOption.garmentType);

    if (existingItem) {
      const newQuantity = existingItem.quantity + delta;
      if (newQuantity <= 0) {
        setCart(cart.filter(i => !(i.service === service._id && i.garmentType === priceOption.garmentType)));
      } else {
        setCart(cart.map(i =>
          (i.service === service._id && i.garmentType === priceOption.garmentType)
            ? { ...i, quantity: newQuantity }
            : i
        ));
      }
    } else if (delta > 0) {
      setCart([...cart, {
        service: service._id,
        quantity: 1,
        serviceType: service.serviceType,
        garmentType: priceOption.garmentType,
        isExpress: false
      }]);
    }
  };

  const getServiceTotalQuantity = (serviceId: string) => {
    return cart.filter(i => i.service === serviceId).reduce((acc, curr) => acc + curr.quantity, 0);
  };

  return (
    <div className="h-[500px] overflow-y-auto pr-2 custom-scrollbar relative">
      <h3 className="font-semibold text-foreground mb-3 sticky top-0 bg-card z-10 py-2">
        Available Services
      </h3>

      {isLoadingServices ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : services?.length === 0 ? (
        <EmptyState title="No services found" description="Please check back later" />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {services?.map((service) => (
            <Card key={service._id} variant="bordered" className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {service.imageUrl ? (
                    <img src={service.imageUrl} alt={service.name} className="w-16 h-16 rounded-lg object-cover bg-muted" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-2xl">
                      👕
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-foreground">{service.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{service.description}</p>
                    <div className="mt-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedService(service)}>
                        View Prices & Add Items
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {getServiceTotalQuantity(service._id) > 0 && (
                    <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                      {getServiceTotalQuantity(service._id)} items in cart
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Service Selection Modal / Overlay */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 border border-border">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg text-foreground">{selectedService.name}</h3>
                <p className="text-sm text-muted-foreground">Select garments to add</p>
              </div>
              <button onClick={() => setSelectedService(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {selectedService.pricing.map((option, idx) => {
                const cartItem = findCartItem(selectedService._id, option.garmentType);
                const qty = cartItem?.quantity || 0;

                return (
                  <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/20 transition-colors bg-muted/30">
                    <div>
                      <p className="font-medium capitalize text-foreground">{option.garmentType.replace('_', ' ')}</p>
                      <p className="text-sm text-primary font-semibold">{formatCurrency(option.basePrice)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(selectedService, option, -1)}
                        disabled={qty === 0}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-medium text-foreground">{qty}</span>
                      <button
                        onClick={() => updateQuantity(selectedService, option, 1)}
                        className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border p-4">
              <Button className="w-full" onClick={() => setSelectedService(null)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
