import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '@/hooks'; // Add useVerifyDelivery hook if created
import { PageWrapper } from '@/components/layout';
import { Card, Button, Input, Spinner } from '@/components/ui';
import { ShieldCheck, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export const VerifyDeliveryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(id!);
  
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 4) {
      toast.error('Please enter a valid 4-digit OTP');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Verification successful!');
      navigate('/rider');
    }, 1500);
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
  if (!order) return <div>Order not found</div>;

  return (
    <PageWrapper title="Verify Completion" showBack>
      <div className="max-w-md mx-auto">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-success-50 text-success-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Customer Confirmation</h2>
          <p className="text-neutral-500 mb-8">
            Ask the customer for the 4-digit OTP sent to their phone to verify this {order.status === 'confirmed' ? 'pickup' : 'delivery'}.
          </p>

          <div className="space-y-6">
            <div>
              <Input
                placeholder="Enter 4-digit OTP"
                className="text-center text-2xl tracking-widest font-mono h-14"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <Button size="lg" className="w-full" onClick={handleVerify} isLoading={isSubmitting}>
              Verify & Complete
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-neutral-500">Or</span>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <Camera className="w-4 h-4 mr-2" />
              Upload Proof of Delivery
            </Button>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default VerifyDeliveryPage;
