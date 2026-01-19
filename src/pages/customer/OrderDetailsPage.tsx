import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useOrder, useRateOrder } from '@/hooks';
import { PageWrapper } from '@/components/layout';
import { Card, Badge, Button, Spinner, Alert } from '@/components/ui';
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '@/lib/utils';
import { ChevronLeft, MapPin, Clock, CreditCard, Star, Truck, CheckCircle2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { verifyPayment } from '@/services/payments.service';
import toast from 'react-hot-toast';

import { PaymentModal } from '@/components/payment/PaymentModal';

export const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: order, isLoading, refetch } = useOrder(id!);
  const { mutate: rateOrder, isPending: isRating } = useRateOrder();
  
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const verifyAttempted = useRef(false);

  // Payment Verification Effect
  useEffect(() => {
    const checkPayment = async () => {
        const shouldVerify = searchParams.get('payment_verify');
        const reference = searchParams.get('reference') || searchParams.get('trxref');

        if (shouldVerify && reference && !isVerifyingPayment && !verifyAttempted.current) {
            verifyAttempted.current = true;
            setIsVerifyingPayment(true);
            try {
                await verifyPayment(reference);
                toast.success('Payment verified successfully!');
                refetch(); // Reload order to show paid status
            } catch (error) {
                console.error(error);
                // Only show error if it's not a duplicate check error (optional refinement)
                toast.error('Could not verify payment. It may take a moment to reflect.');
            } finally {
                setIsVerifyingPayment(false);
                // Clear params
                setSearchParams({});
            }
        }
    };

    checkPayment();
  }, [searchParams, refetch, setSearchParams]);

  if (isLoading || isVerifyingPayment) {
      return (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
             <Spinner />
             {isVerifyingPayment && <p className="text-neutral-500 font-medium animate-pulse">Verifying payment status...</p>}
        </div>
      );
  }
  
  if (!order) return <div className="text-center py-12">Order not found</div>;

  const handleRate = () => {
    rateOrder({ id: order._id, data: { rating, feedback } });
  };

  return (
    <PageWrapper
      title={`Order #${order.orderNumber}`}
      description={`Placed on ${formatDate(order.createdAt, 'PPP')}`}
      action={
        order.status === 'pending' && !order.isPaid ? (
          <Button onClick={() => setIsPaymentModalOpen(true)}>
            Pay Now {formatCurrency(order.total)}
          </Button>
        ) : null
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status & Tracker */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Order Status</h3>
              <Badge className={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Badge>
            </div>
            
            {order.isPaid && (
                <div className="mb-4 bg-success-50 border border-success-100 p-3 rounded-lg flex items-center gap-2 text-success-700">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Payment Successful</span>
                </div>
            )}

            {/* Simple Timeline logic could go here */}
            {['pending', 'confirmed', 'picked_up', 'in_process', 'ready', 'out_for_delivery', 'delivered', 'completed'].includes(order.status) && (
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 flex items-center gap-3">
                 <Truck className="w-5 h-5 text-primary-600" />
                 <p className="text-sm text-neutral-600">
                   {order.status === 'out_for_delivery' 
                     ? 'Your order is on its way to you!' 
                     : 'We are processing your order with care.'}
                 </p>
              </div>
            )}
          </Card>

          {/* Items */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Items & Services</h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary-50 flex items-center justify-center text-primary-600 font-medium text-sm">
                      {item.quantity}x
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">
                        {typeof item.service === 'string' ? 'Service' : item.service.name}
                      </p>
                      <p className="text-xs text-neutral-500 capitalize">{item.garmentType}</p>
                    </div>
                  </div>
                  <p className="font-medium text-neutral-900">{formatCurrency(item.subtotal)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-100 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Delivery Fee</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-neutral-900 pt-2">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-500" />
              Schedule
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Pickup</p>
                <p className="text-sm font-medium">{formatDate(order.pickupDate, 'PP')}</p>
                <p className="text-sm text-neutral-600">{order.pickupTimeSlot}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Delivery Estimate</p>
                <p className="text-sm font-medium">{formatDate(order.expectedDeliveryDate, 'PP')}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-neutral-500" />
              Locations
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Pickup Address</p>
                <p className="text-sm text-neutral-600 whitespace-pre-line">{order.pickupAddress.street}</p>
              </div>
               <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Delivery Address</p>
                <p className="text-sm text-neutral-600 whitespace-pre-line">{order.deliveryAddress.street}</p>
              </div>
            </div>
          </Card>

           {order.status === 'completed' && !order.rating && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-warning-500" />
                Rate Order
              </h3>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setRating(s)}>
                    <Star className={`w-6 h-6 ${s <= rating ? 'fill-warning-400 text-warning-400' : 'text-neutral-300'}`} />
                  </button>
                ))}
              </div>
              <textarea
                className="w-full text-sm border-neutral-300 rounded-lg mb-3"
                rows={2}
                placeholder="How was your experience?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <Button size="sm" onClick={handleRate} disabled={!rating || isRating} isLoading={isRating}>
                Submit Review
              </Button>
            </Card>
          )}
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        order={order}
      />
    </PageWrapper>
  );
};

export default OrderDetailsPage;
