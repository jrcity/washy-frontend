import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useOrder, useRateOrder } from '@/hooks';
import { PageWrapper } from '@/components/layout';
import { Card, Badge, Button, Spinner, Alert } from '@/components/ui';
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '@/lib/utils';
import { ChevronLeft, MapPin, Clock, CreditCard, Star, Truck, CheckCircle2, MessageCircle, FileText, Building2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { verifyPayment } from '@/services/payments.service';
import { cn } from '@/lib/utils';
import { chatService } from '@/services/chat.service';
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
  const [isStartingSupportChat, setIsStartingSupportChat] = useState(false);
  const [isStartingRiderChat, setIsStartingRiderChat] = useState(false);

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
        {isVerifyingPayment && <p className="text-muted-foreground font-medium animate-pulse">Verifying payment status...</p>}
      </div>
    );
  }

  if (!order) return <div className="text-center py-12">Order not found</div>;

  const handleRate = () => {
    rateOrder({ id: order._id, data: { rating, feedback } });
  };

  const handleContactSupport = async () => {
    if (!order.branch) return;
    setIsStartingSupportChat(true);
    try {
      const response = await chatService.startSupportChat({
        branchId: typeof order.branch === 'string' ? order.branch : order.branch._id
      });
      if (response.success && response.data) {
        navigate('/dashboard/support');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to start chat');
    } finally {
      setIsStartingSupportChat(false);
    }
  };

  const handleContactRider = async () => {
    setIsStartingRiderChat(true);
    try {
      const response = await chatService.startRiderChat({ orderId: order._id });
      if (response.success && response.data) {
        navigate('/dashboard/support');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Rider is currently unavailable for chat');
    } finally {
      setIsStartingRiderChat(false);
    }
  };

  return (
    <PageWrapper
      title={`Order #${order.orderNumber}`}
      description={`Placed on ${formatDate(order.createdAt, 'PPP')}`}
      showBack={true}
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
              <div className="mb-4 bg-success/10 border border-success/20 p-3 rounded-lg flex items-center gap-2 text-success">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Payment Successful</span>
              </div>
            )}

            {/* Simple Timeline logic could go here */}
            {['pending', 'confirmed', 'picked_up', 'in_process', 'ready', 'out_for_delivery', 'delivered', 'completed'].includes(order.status) && (
              <div className="bg-muted p-4 rounded-xl border border-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    {order.status === 'out_for_delivery'
                      ? 'Your order is on its way to you!'
                      : 'We are processing your order with care.'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5"
                  onClick={handleContactSupport}
                  isLoading={isStartingSupportChat}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Support
                </Button>
              </div>
            )}We are processing your order with care.

            {(order.pickupRider || order.deliveryRider) && ['picked_up', 'out_for_delivery'].includes(order.status) && (
              <div className="mt-4 p-4 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-primary shadow-sm font-bold">
                    R
                  </div>
                  <p className="text-sm font-medium text-primary">Contact assigned rider</p>
                </div>
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1.5"
                  onClick={handleContactRider}
                  isLoading={isStartingRiderChat}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Chat
                </Button>
              </div>
            )}
          </Card>

          {/* Items */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Items & Services</h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shadow-sm">
                      {item.quantity}x
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {typeof item.service === 'string' ? 'Service' : item.service.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-muted-foreground capitalize px-2 py-0.5 bg-muted rounded-full">{item.garmentType.replace('_', ' ')}</p>
                        {item.isExpress && <Badge variant="warning" size="sm" className="h-4 text-[10px]">Express</Badge>}
                        <span className="text-[10px] text-muted-foreground/60">@ {formatCurrency(item.unitPrice || 0)} / unit</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-bold text-foreground">{formatCurrency(item.subtotal)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-6 pt-6 space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Delivery Fee</span>
                <span className="font-medium text-foreground">{formatCurrency(order.deliveryFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-success">
                  <span>Discount</span>
                  <span className="font-medium">-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xl text-foreground pt-3 border-t border-dashed border-border">
                <span>Total Amount</span>
                <span className="text-primary">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </Card>

          {/* Customer Notes */}
          {order.customerNotes && (
            <Card className="p-6 border-l-4 border-l-secondary bg-secondary/10">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Special Instructions
              </h3>
              <p className="text-foreground/80 italic leading-relaxed">"{order.customerNotes}"</p>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary/20" />
              Processing Branch
            </h3>
            {typeof order.branch !== 'string' ? (
              <div className="space-y-1">
                <p className="font-bold text-foreground">{order.branch.name}</p>
                <Badge variant="info" className="text-[10px] h-4 bg-muted text-muted-foreground border-border">
                  Code: {order.branch.code}
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Branch ID: {order.branch}</p>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Schedule
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Pickup Window</p>
                <p className="text-sm font-bold text-foreground">{formatDate(order.pickupDate, 'PPP')}</p>
                <p className="text-sm text-muted-foreground font-medium">{order.pickupTimeSlot}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Expected Delivery</p>
                <p className="text-sm font-bold text-foreground">{formatDate(order.expectedDeliveryDate, 'PPP')}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Pickup & Delivery
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Pickup Address
                </p>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground leading-tight">
                    {order.pickupAddress.street}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.pickupAddress.area}, {order.pickupAddress.city}, {order.pickupAddress.state}
                  </p>
                  {order.pickupAddress.landmark && (
                    <p className="text-[11px] font-medium text-secondary flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      Near {order.pickupAddress.landmark}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Delivery Address
                </p>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground leading-tight">
                    {order.deliveryAddress.street}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.deliveryAddress.area}, {order.deliveryAddress.city}, {order.deliveryAddress.state}
                  </p>
                  {order.deliveryAddress.landmark && (
                    <p className="text-[11px] font-medium text-secondary flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      Near {order.deliveryAddress.landmark}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {order.status === 'completed' && !order.rating && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-warning" />
                Rate Order
              </h3>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setRating(s)}>
                    <Star className={`w-6 h-6 ${s <= rating ? 'fill-warning text-warning' : 'text-muted-foreground/30'}`} />
                  </button>
                ))}
              </div>
              <textarea
                className={cn(
                  "w-full px-4 py-3 bg-card border border-border rounded-2xl text-base transition-all duration-300 resize-none mb-3",
                  "focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none",
                  "hover:border-primary/30 hover:shadow-sm"
                )}
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
