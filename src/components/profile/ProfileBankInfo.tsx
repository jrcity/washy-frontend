import { useState } from 'react';
import { Building2, CreditCard, Save, AlertCircle } from 'lucide-react';
import { Card, Button, Input, Badge } from '@/components/ui';
import { useAuthContext } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export const ProfileBankInfo = () => {
    const { user } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Safely access bank details (may not be in User type yet)
    const bankDetails = (user as any)?.bankDetails || {};

    const [formData, setFormData] = useState({
        bankName: bankDetails.bankName || '',
        accountNumber: bankDetails.accountNumber || '',
        accountName: bankDetails.accountName || '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!formData.bankName || !formData.accountNumber || !formData.accountName) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Bank details updated successfully');
        setIsLoading(false);
        setIsEditing(false);
    };

    const isVerified = bankDetails.isVerified;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">Bank Information</h3>
                    <p className="text-sm text-neutral-500">Manage your bank account for payouts.</p>
                </div>
                {isVerified && (
                    <Badge variant="success" size="sm">Verified</Badge>
                )}
            </div>

            {/* Info Alert */}
            <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-xl border border-primary-100">
                <AlertCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-medium text-primary-900">Secure Banking</p>
                    <p className="text-xs text-primary-700 mt-1">
                        Your bank details are encrypted and securely stored. We use bank-grade security to protect your information.
                    </p>
                </div>
            </div>

            {/* Bank Details Form */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
                    <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-neutral-500" />
                    </div>
                    <div className="flex-1">
                        {isEditing ? (
                            <Input
                                name="bankName"
                                placeholder="Enter bank name"
                                value={formData.bankName}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <>
                                <p className="text-sm text-neutral-500">Bank Name</p>
                                <p className="font-medium text-neutral-900">{formData.bankName || 'Not set'}</p>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
                    <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-neutral-500" />
                    </div>
                    <div className="flex-1">
                        {isEditing ? (
                            <Input
                                name="accountNumber"
                                placeholder="Enter account number"
                                value={formData.accountNumber}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <>
                                <p className="text-sm text-neutral-500">Account Number</p>
                                <p className="font-medium text-neutral-900 font-mono">
                                    {formData.accountNumber
                                        ? `****${formData.accountNumber.slice(-4)}`
                                        : 'Not set'
                                    }
                                </p>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
                    <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center text-neutral-500 font-bold">
                        AB
                    </div>
                    <div className="flex-1">
                        {isEditing ? (
                            <Input
                                name="accountName"
                                placeholder="Enter account name"
                                value={formData.accountName}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <>
                                <p className="text-sm text-neutral-500">Account Name</p>
                                <p className="font-medium text-neutral-900">{formData.accountName || 'Not set'}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                {isEditing ? (
                    <>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
                            Save Details
                        </Button>
                    </>
                ) : (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                        Edit Bank Details
                    </Button>
                )}
            </div>
        </div>
    );
};
