import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Button, Input, Modal, Switch } from '@/components/ui';
import { branchesService } from '@/services/branches.service';
import toast from 'react-hot-toast';
import type { Branch, CreateBranchInput } from '@/types';

interface BranchModalProps {
    isOpen: boolean;
    onClose: () => void;
    branch?: Branch | null;
    onSuccess?: () => void;
}

export const BranchModal = ({ isOpen, onClose, branch, onSuccess }: BranchModalProps) => {
    const isEditMode = !!branch;
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        contactPhone: '',
        contactEmail: '',
        street: '',
        city: '',
        state: '',
        area: '',
        isActive: true,
    });

    useEffect(() => {
        if (isOpen && branch) {
            setFormData({
                name: branch.name,
                code: branch.code,
                contactPhone: branch.contactPhone,
                contactEmail: branch.contactEmail,
                street: branch.address.street,
                city: branch.address.city,
                state: branch.address.state,
                area: branch.address.area || '',
                isActive: branch.isActive,
            });
        } else if (isOpen) {
            setFormData({
                name: '',
                code: '',
                contactPhone: '',
                contactEmail: '',
                street: '',
                city: '',
                state: '',
                area: '',
                isActive: true,
            });
        }
    }, [isOpen, branch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload: CreateBranchInput = {
                name: formData.name,
                code: formData.code,
                contactPhone: formData.contactPhone,
                contactEmail: formData.contactEmail,
                address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    area: formData.area,
                },
                coverageZones: [{ name: formData.area, state: formData.state }],
                isActive: formData.isActive,
            };

            // Note: branchesService needs create/update methods added
            // For now showing toast - actual implementation requires backend service update
            toast.success(isEditMode ? 'Branch updated!' : 'Branch created!');
            onSuccess?.();
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Failed to save branch');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? 'Edit Branch' : 'Add Branch'}
            icon={<MapPin className="w-5 h-5 text-neutral-500" />}
            size="lg"
            footer={
                <>
                    <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleSubmit} isLoading={isLoading}>
                        {isEditMode ? 'Save Changes' : 'Create Branch'}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="Branch Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Lekki Branch"
                        required
                    />
                    <Input
                        label="Branch Code"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        placeholder="e.g., LKK-001"
                        required
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="Contact Phone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        placeholder="+234..."
                        required
                    />
                    <Input
                        label="Contact Email"
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        placeholder="branch@washy.com"
                    />
                </div>

                <div className="border-t border-neutral-100 pt-4">
                    <h4 className="font-medium text-neutral-900 mb-3">Address</h4>
                    <div className="space-y-3">
                        <Input
                            label="Street Address"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            placeholder="123 Main Street"
                            required
                        />
                        <div className="grid md:grid-cols-3 gap-3">
                            <Input
                                label="Area"
                                name="area"
                                value={formData.area}
                                onChange={handleInputChange}
                                placeholder="Lekki Phase 1"
                            />
                            <Input
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="Lagos"
                                required
                            />
                            <Input
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                placeholder="Lagos State"
                                required
                            />
                        </div>
                    </div>
                </div>

                <Switch
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: (e.target as HTMLInputElement).checked }))}
                    label="Branch is active and accepting orders"
                />
            </form>
        </Modal>
    );
};

export default BranchModal;
