import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { PageWrapper } from '@/components/layout';
import { useCreateOrder } from '@/hooks';
import { StepServices, StepAddress, StepReview } from './components';
import type { CreateOrderItemInput } from '@/types';
import toast from 'react-hot-toast';

export const NewOrderPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [cart, setCart] = useState<CreateOrderItemInput[]>([]);
  const [orderMeta, setOrderMeta] = useState({
    pickupDate: '',
    pickupTimeSlot: '',
    pickupAddressId: '',
    deliveryAddressId: '',
    notes: '',
  });

  const { mutate: createOrder, isPending } = useCreateOrder();

  const steps = ['Select Services', 'Pickup & Delivery', 'Review'];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = () => {
    if (!orderMeta.pickupAddressId || !orderMeta.deliveryAddressId) {
      toast.error('Please select pickup and delivery addresses');
      return;
    }

    createOrder({
      branchId: 'default-branch-id', // TODO: Logic to select branch
      items: cart,
      pickupDate: orderMeta.pickupDate,
      pickupTimeSlot: orderMeta.pickupTimeSlot,
      pickupAddress: { _id: orderMeta.pickupAddressId } as any, // ID reference
      deliveryAddress: { _id: orderMeta.deliveryAddressId } as any,
      customerNotes: orderMeta.notes,
    }, {
      onSuccess: () => {
        navigate('/dashboard');
      }
    });
  };

  return (
    <PageWrapper
      title="Create New Order"
      description="Select services and schedule your pickup"
    >
      <div className="max-w-4xl mx-auto">
        {/* Progress Stepper */}
        {/* Progress Stepper */}
        <div className="mb-8">
          {/* Desktop/Tablet Horizontal Stepper */}
          <div className="hidden md:flex items-center justify-between relative px-10 mb-6">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-100 rounded-full -z-10" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-600 rounded-full -z-10 transition-all duration-300 ease-out" 
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} 
            />
            
            {steps.map((step, index) => {
              const isActive = index <= currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step} className="flex flex-col items-center gap-3 relative z-10 group cursor-default">
                  <div 
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm
                      ${isActive 
                        ? 'bg-primary-600 border-primary-600 text-white scale-110 shadow-primary-200' 
                        : 'bg-white border-neutral-200 text-neutral-400 group-hover:border-neutral-300'}
                    `}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <span className="font-semibold text-sm">{index + 1}</span>}
                  </div>
                  <span 
                    className={`
                      text-sm font-semibold transition-colors duration-200 absolute -bottom-8 whitespace-nowrap
                      ${isActive ? 'text-primary-700' : 'text-neutral-400'}
                    `}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile Vertical/Compact Stepper */}
          <div className="md:hidden flex items-center gap-4 bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 text-primary-600 font-bold border border-primary-100">
               {currentStep + 1}
            </div>
            <div className="flex-1">
              <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-0.5">Step {currentStep + 1} of {steps.length}</p>
              <p className="font-bold text-neutral-900">{steps[currentStep]}</p>
            </div>
            <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
               <div 
                  className="h-full bg-primary-600 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
               />
            </div>
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-6 my-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 0 && (
                <StepServices cart={cart} setCart={setCart} />
              )}
              {currentStep === 1 && (
                <StepAddress data={orderMeta} setData={setOrderMeta} />
              )}
              {currentStep === 2 && (
                <StepReview cart={cart} meta={orderMeta} />
              )}
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Navigation Actions */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBack} disabled={isPending}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button 
            onClick={handleNext} 
            isLoading={isPending}
            disabled={
              (currentStep === 0 && cart.length === 0) ||
              (currentStep === 1 && (!orderMeta.pickupDate || !orderMeta.pickupAddressId))
            }
          >
            {currentStep === steps.length - 1 ? 'Place Order' : 'Next Step'}
            {currentStep !== steps.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default NewOrderPage;
