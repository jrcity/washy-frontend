import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder, useUpload } from '@/hooks';
import { PageWrapper } from '@/components/layout';
import { Card, Button, Input, Spinner } from '@/components/ui';
import { ShieldCheck, Camera, Check } from 'lucide-react';
import { ordersService } from '@/services/orders.service';
import toast from 'react-hot-toast';

export const VerifyDeliveryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(id!);
  const { mutateAsync: uploadFile, isPending: isUploading } = useUpload();
  
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
        const upload = await uploadFile({
            file,
            category: order?.status === 'confirmed' ? 'pickup_proof' : 'delivery_proof',
            relatedModel: 'Order',
            relatedId: id
        });
        setPhotoUrl(upload.url);
        toast.success('Photo uploaded successfully');
    } catch (error) {
        console.error(error);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 4) {
      toast.error('Please enter a valid 4-digit OTP');
      return;
    }

    if (!photoUrl && order?.status === 'confirmed') {
        toast.error('Please upload a photo of the items for pickup verification');
        return;
    }
    
    setIsSubmitting(true);
    try {
        await ordersService.verifyDelivery(id!, {
            type: order?.status === 'confirmed' ? 'pickup' : 'delivery',
            otpCode: otp,
            photoUrl
        });
        toast.success('Verification successful!');
        navigate('/rider');
    } catch (error) {
        toast.error('Verification failed. Check OTP.');
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
  if (!order) return <div>Order not found</div>;

  const isPickup = order.status === 'confirmed';

  return (
    <PageWrapper title="Verify Completion" showBack>
      <div className="max-w-md mx-auto">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-success-50 text-success-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Customer Confirmation</h2>
          <p className="text-neutral-500 mb-8">
            Ask the customer for the 4-digit OTP sent to their phone to verify this {isPickup ? 'pickup' : 'delivery'}.
          </p>

          <div className="space-y-6">
             {/* Photo Upload Section */}
             <div>
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <Button 
                    variant={photoUrl ? "outline" : "secondary"} 
                    className={`w-full ${photoUrl ? 'border-primary-500 text-primary-600 bg-primary-50' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    isLoading={isUploading}
                >
                  {photoUrl ? <Check className="w-4 h-4 mr-2" /> : <Camera className="w-4 h-4 mr-2" />}
                  {photoUrl ? 'Photo Uploaded' : 'Upload Proof of Items'}
                </Button>
                {photoUrl && <p className="text-xs text-primary-600 mt-1">Image attached</p>}
             </div>

             <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-neutral-500">AND</span>
              </div>
            </div>

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
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default VerifyDeliveryPage;
