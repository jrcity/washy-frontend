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
      <h3 className="font-semibold text-neutral-900 mb-3 sticky top-0 bg-white z-10 py-2">
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
                      <img src={service.imageUrl} alt={service.name} className="w-16 h-16 rounded-lg object-cover bg-neutral-100" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-neutral-100 flex items-center justify-center text-2xl">
                        👕
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-neutral-900">{service.name}</p>
                      <p className="text-sm text-neutral-500 line-clamp-1">{service.description}</p>
                      <div className="mt-2">
                         <Button size="sm" variant="outline" onClick={() => setSelectedService(service)}>
                            View Prices & Add Items
                         </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                      {getServiceTotalQuantity(service._id) > 0 && (
                          <span className="bg-primary-50 text-primary-700 text-xs font-semibold px-2 py-1 rounded-full">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                <div className="sticky top-0 bg-white border-b border-neutral-100 p-4 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-lg">{selectedService.name}</h3>
                        <p className="text-sm text-neutral-500">Select garments to add</p>
                    </div>
                    <button onClick={() => setSelectedService(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-4 space-y-4">
                    {selectedService.pricing.map((option, idx) => {
                        const cartItem = findCartItem(selectedService._id, option.garmentType);
                        const qty = cartItem?.quantity || 0;

                        return (
                            <div key={idx} className="flex items-center justify-between p-3 border border-neutral-100 rounded-lg hover:border-primary-100 transition-colors">
                                <div>
                                    <p className="font-medium capitalize text-neutral-900">{option.garmentType.replace('_', ' ')}</p>
                                    <p className="text-sm text-primary-600 font-semibold">{formatCurrency(option.basePrice)}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => updateQuantity(selectedService, option, -1)}
                                        disabled={qty === 0}
                                        className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-6 text-center font-medium">{qty}</span>
                                    <button 
                                        onClick={() => updateQuantity(selectedService, option, 1)}
                                        className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="sticky bottom-0 bg-white border-t border-neutral-100 p-4">
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
