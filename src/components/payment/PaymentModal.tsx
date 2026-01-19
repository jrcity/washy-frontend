import { useState } from 'react';
import { X, CreditCard, Wallet, AlertCircle } from 'lucide-react';
import { Button, Alert } from '@/components/ui';
import { initializePayment } from '@/services/payments.service';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    _id: string;
    orderNumber: string;
    total: number;
    email?: string;
  };
}

export const PaymentModal = ({ isOpen, onClose, order }: PaymentModalProps) => {
  const [method, setMethod] = useState<'card' | 'bank_transfer'>('card');
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsInitializing(true);
    setError(null);

    try {
      const response = await initializePayment({
        orderId: order._id,
        method: 'card', // Currently supporting Paystack card/bank flow initiated via 'card' method
        callbackUrl: `${window.location.origin}/dashboard/orders/${order._id}?payment_verify=true`
      });

      const payment = response.data;
      // Check for Paystack URL or generic authorization URL
      const authUrl = payment?.paystackAuthorizationUrl || (payment as any)?.authorizationUrl;

      if (authUrl) {
        window.location.href = authUrl;
      } else {
        setError('Failed to initialize payment. No authorization URL returned.');
      }
    } catch (err: any) {
      console.error('Payment initialization error:', err);
      setError(err.response?.data?.message || 'Failed to initialize payment. Please try again.');
      toast.error('Payment initialization failed');
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-neutral-500" />
            Make Payment
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="bg-primary-50 p-4 rounded-xl text-center">
            <p className="text-sm text-neutral-500 mb-1">Total Amount to Pay</p>
            <p className="text-3xl font-bold text-primary-700">{formatCurrency(order.total)}</p>
            <p className="text-xs text-neutral-400 mt-2">Order #{order.orderNumber}</p>
          </div>

          {error && (
            <Alert variant="error" className="py-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </Alert>
          )}

          <div className="space-y-3">
            <p className="text-sm font-medium text-neutral-700">Select Payment Method</p>
            
            <div 
              className={`p-4 border rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                method === 'card' 
                  ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' 
                  : 'border-neutral-200 hover:border-primary-200'
              }`}
              onClick={() => setMethod('card')}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                   method === 'card' ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Pay with Card</p>
                  <p className="text-xs text-neutral-500">Secured by Paystack</p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                 method === 'card' ? 'border-primary-500' : 'border-neutral-300'
              }`}>
                {method === 'card' && <div className="w-2 h-2 rounded-full bg-primary-500" />}
              </div>
            </div>

            <div className="opacity-50 pointer-events-none p-4 border border-neutral-200 rounded-xl flex items-center justify-between">
               <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-neutral-400">Bank Transfer</p>
                  <p className="text-xs text-neutral-400">Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100">
          <Button 
            className="w-full py-6 text-lg" 
            isLoading={isInitializing}
            onClick={handlePayment}
          >
            Pay {formatCurrency(order.total)}
          </Button>
          <p className="text-center text-xs text-neutral-400 mt-3 flex items-center justify-center gap-1">
            <LockIcon className="w-3 h-3" />
            Payments are secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

const LockIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
