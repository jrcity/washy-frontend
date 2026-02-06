import { useState, useEffect } from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { Button, Input, Modal, Select, Switch, Textarea } from '@/components/ui';
import { useActiveCategories } from '@/hooks/useCategories';
import { servicesService } from '@/services/services.service';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Service, ServicePricing, GarmentType, ServiceCategory, ServiceType } from '@/types';

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    service?: Service | null;
    onSuccess?: () => void;
}

const garmentTypes: GarmentType[] = [
    'shirt', 'trouser', 'suit', 'dress', 'duvet', 'curtain',
    'bedsheet', 'towel', 'skirt', 'underwear', 'blanket',
    'jacket', 'native_attire', 'other'
];

const serviceCategories: ServiceCategory[] = [
    'laundry', 'dry_cleaning', 'alteration', 'shoe_care', 'household'
];

const serviceTypes: ServiceType[] = [
    'wash_and_fold', 'wash_and_iron', 'dry_clean', 'express', 'starch', 'iron_only'
];

export const ServiceModal = ({ isOpen, onClose, service, onSuccess }: ServiceModalProps) => {
    const isEditMode = !!service;
    const { data: categoriesData } = useActiveCategories();

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'laundry' as ServiceCategory,
        serviceType: 'wash_and_fold' as ServiceType,
        isExpressAvailable: true,
        standardDuration: 24,
        expressDuration: 6,
    });

    const [pricing, setPricing] = useState<ServicePricing[]>([
        { garmentType: 'shirt', basePrice: 500, expressMultiplier: 1.5 }
    ]);

    useEffect(() => {
        if (isOpen && service) {
            setFormData({
                name: service.name,
                description: service.description,
                category: service.category,
                serviceType: service.serviceType,
                isExpressAvailable: service.isExpressAvailable,
                standardDuration: service.estimatedDuration.standard,
                expressDuration: service.estimatedDuration.express,
            });
            setPricing(service.pricing);
        } else if (isOpen) {
            setFormData({
                name: '',
                description: '',
                category: 'laundry',
                serviceType: 'wash_and_fold',
                isExpressAvailable: true,
                standardDuration: 24,
                expressDuration: 6,
            });
            setPricing([{ garmentType: 'shirt', basePrice: 500, expressMultiplier: 1.5 }]);
        }
    }, [isOpen, service]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handlePricingChange = (index: number, field: keyof ServicePricing, value: string | number) => {
        setPricing(prev => prev.map((p, i) =>
            i === index ? { ...p, [field]: field === 'garmentType' ? value : Number(value) } : p
        ));
    };

    const addPricingTier = () => {
        const usedTypes = pricing.map(p => p.garmentType);
        const availableType = garmentTypes.find(t => !usedTypes.includes(t)) || 'other';
        setPricing(prev => [...prev, { garmentType: availableType, basePrice: 500, expressMultiplier: 1.5 }]);
    };

    const removePricingTier = (index: number) => {
        if (pricing.length > 1) {
            setPricing(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                serviceType: formData.serviceType,
                pricing,
                isExpressAvailable: formData.isExpressAvailable,
            };

            if (isEditMode) {
                // Update would need an updateService endpoint
                toast.error('Update service not implemented yet');
            } else {
                await servicesService.create(payload);
                toast.success('Service created successfully!');
            }

            onSuccess?.();
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Failed to save service');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? 'Edit Service' : 'Add Service'}
            icon={<FileText className="w-5 h-5 text-neutral-500" />}
            size="lg"
            footer={
                <>
                    <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleSubmit} isLoading={isLoading}>
                        {isEditMode ? 'Save Changes' : 'Create Service'}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="Service Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Premium Dry Cleaning"
                        required
                    />

                    <div>
                        <Select
                            name="category"
                            label="Category"
                            value={formData.category}
                            onChange={(e) => handleInputChange(e as any)}
                            options={serviceCategories.map(cat => ({
                                value: cat,
                                label: cat.replace('_', ' ')
                            }))}
                            className="bg-white"
                        />
                    </div>
                </div>

                <Textarea
                    name="description"
                    label="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe this service..."
                    rows={2}
                    className="bg-white border-border rounded-2xl"
                />

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Select
                            name="serviceType"
                            label="Service Type"
                            value={formData.serviceType}
                            onChange={(e) => handleInputChange(e as any)}
                            options={serviceTypes.map(type => ({
                                value: type,
                                label: type.replace(/_/g, ' ')
                            }))}
                            className="bg-white"
                        />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer self-end pb-2">
                        <Switch
                            name="isExpressAvailable"
                            checked={formData.isExpressAvailable}
                            onChange={(e) => setFormData(prev => ({ ...prev, isExpressAvailable: (e.target as HTMLInputElement).checked }))}
                            label="Express service available"
                        />
                    </label>
                </div>

                {/* Pricing Tiers */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-neutral-700">Pricing Tiers</label>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={addPricingTier}
                            leftIcon={<Plus className="w-4 h-4" />}
                        >
                            Add Tier
                        </Button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {pricing.map((tier, index) => (
                            <div key={index} className="flex items-center gap-2 bg-neutral-50 p-2 rounded-lg">
                                <Select
                                    value={tier.garmentType}
                                    onChange={(e) => handlePricingChange(index, 'garmentType', e.target.value)}
                                    options={garmentTypes.map(type => ({
                                        value: type,
                                        label: type.replace('_', ' ')
                                    }))}
                                    className="flex-1 min-w-[150px]"
                                />
                                <Input
                                    type="number"
                                    value={tier.basePrice}
                                    onChange={(e) => handlePricingChange(index, 'basePrice', e.target.value)}
                                    className="w-24"
                                    placeholder="Price"
                                />
                                <button
                                    type="button"
                                    onClick={() => removePricingTier(index)}
                                    className="p-1 text-neutral-400 hover:text-error-500 transition-colors"
                                    disabled={pricing.length <= 1}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default ServiceModal;
