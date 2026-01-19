import { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { Button, Input, Select } from '@/components/ui';
import { updateProfile } from '@/services/auth.service';
import { toast } from 'react-hot-toast';
import type { Rider } from '@/types/auth.types';

export const RiderProfileForm = () => {
  const { user } = useAuthContext();
  const rider = user as Rider;
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    vehicleType: rider.vehicleType || 'motorcycle',
    vehiclePlateNumber: rider.vehiclePlateNumber || '',
    bankName: rider.bankDetails?.bankName || '',
    accountNumber: rider.bankDetails?.accountNumber || '',
    accountName: rider.bankDetails?.accountName || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile({
        vehicleType: formData.vehicleType as any,
        vehiclePlateNumber: formData.vehiclePlateNumber,
        bankDetails: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          accountName: formData.accountName,
        }
      });
      toast.success('Rider details updated successfully');
    } catch (error) {
      toast.error('Failed to update details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-neutral-900">Vehicle Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Vehicle Type
            </label>
            <Select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              options={[
                { value: 'motorcycle', label: 'Motorcycle' },
                { value: 'bicycle', label: 'Bicycle' },
                { value: 'car', label: 'Car' },
                { value: 'van', label: 'Van' },
              ]}
            />
          </div>
          <Input
            label="Plate Number"
            name="vehiclePlateNumber"
            value={formData.vehiclePlateNumber}
            onChange={handleChange}
            placeholder="e.g. ABC-123-XYZ"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-neutral-100">
        <h3 className="text-lg font-medium text-neutral-900">Bank Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Bank Name"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            placeholder="e.g. First Bank"
          />
          <Input
            label="Account Number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            type="number"
          />
          <div className="md:col-span-2">
            <Input
              label="Account Name"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              placeholder="Account Holder Name"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" isLoading={isLoading}>
          Save Rider Details
        </Button>
      </div>
    </form>
  );
};
