import {
  useServices 
} from '@/hooks';
import type { CreateOrderItemInput, Service } from '@/types';
import { Button, Card, EmptyState, Spinner } from '@/components/ui';
import { Plus, Minus } from 'lucide-react';
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

  const addToCart = (service: Service) => {
    // Check if simple pricing (basePrice) or need more complex logic
    // For now assuming basePrice from first pricing option or 'standard'
    // This is a simplification. Real app might need a modal for garment details if complex.
    const exists = cart.find(i => i.service === service._id);
    if (exists) {
      setCart(cart.map(i => i.service === service._id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { 
        service: service._id, 
        quantity: 1, 
        serviceType: service.serviceType, 
        garmentType: service.pricing[0]?.garmentType as any || 'shirt', // Default to first pricing option
        isExpress: false 
      }]);
    }
  };

  const removeFromCart = (serviceId: string) => {
    const exists = cart.find(i => i.service === serviceId);
    if (exists && exists.quantity > 1) {
      setCart(cart.map(i => i.service === serviceId ? { ...i, quantity: i.quantity - 1 } : i));
    } else {
      setCart(cart.filter(i => i.service !== serviceId));
    }
  };

  const getQuantity = (serviceId: string) => {
    return cart.find(i => i.service === serviceId)?.quantity || 0;
  };

  return (
    <div className="h-[500px] overflow-y-auto pr-2 custom-scrollbar">
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
            <Card key={service._id} variant="bordered" className="flex items-center justify-between p-4">
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
                  <p className="text-primary-600 font-semibold mt-1">
                    {formatCurrency(service.pricing[0]?.basePrice || 0)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getQuantity(service._id) > 0 ? (
                  <>
                    <button 
                      onClick={() => removeFromCart(service._id)}
                      className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center font-medium">{getQuantity(service._id)}</span>
                    <button 
                      onClick={() => addToCart(service)}
                      className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => addToCart(service)}>
                    Add
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
