import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, ChevronLeft, Save, Trash2, UserPlus } from 'lucide-react';
import { Button, Input, Card, Switch, Select } from '@/components/ui';
import { PageWrapper } from '@/components/layout';
import { branchesService } from '@/services/branches.service';
import { useUsers } from '@/hooks';
import toast from 'react-hot-toast';
import type { Branch, CreateBranchInput } from '@/types/branch.types';
import { motion } from 'framer-motion';

export const AdminEditBranchPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(isEditMode);

    const { data: managersData } = useUsers({ role: 'branch_manager', limit: 100 });
    const managers = managersData?.users || [];

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        contactPhone: '',
        contactEmail: '',
        street: '',
        city: '',
        state: '',
        area: '',
        managerId: '',
        isActive: true,
    });

    useEffect(() => {
        if (id) {
            const fetchBranch = async () => {
                try {
                    const branch = await branchesService.getById(id);
                    setFormData({
                        name: branch.name,
                        code: branch.code,
                        contactPhone: branch.contactPhone,
                        contactEmail: branch.contactEmail,
                        street: branch.address.street,
                        city: branch.address.city,
                        state: branch.address.state,
                        area: branch.address.area || '',
                        managerId: typeof branch.manager === 'object' ? branch.manager._id : branch.manager || '',
                        isActive: branch.isActive,
                    });
                } catch (error) {
                    toast.error('Failed to load branch details');
                    navigate('/admin/branches');
                } finally {
                    setIsFetching(false);
                }
            };
            fetchBranch();
        }
    }, [id, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
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
                manager: formData.managerId || undefined,
                isActive: formData.isActive,
            };

            if (isEditMode) {
                await branchesService.update(id!, payload);
                toast.success('Branch updated successfully');
            } else {
                await branchesService.create(payload);
                toast.success('Branch created successfully');
            }
            navigate('/admin/branches');
        } catch (error: any) {
            toast.error(error.message || 'Failed to save branch');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <PageWrapper
            title={isEditMode ? 'Edit Branch' : 'Create Branch'}
            description={isEditMode ? `Updating ${formData.name}` : 'Setup a new operational center'}
        >
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <Button variant="ghost" className="rounded-xl justify-start w-fit" onClick={() => navigate(-1)}>
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back to List
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] border-neutral-100 shadow-sm space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-neutral-900 tracking-tight">Core Information</h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        label="Branch Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Ikeja Premium Hub"
                                        required
                                        className="rounded-2xl h-12"
                                    />
                                    <Input
                                        label="Branch Code"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        placeholder="e.g., LKK-001"
                                        required
                                        className="rounded-2xl h-12"
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
                                        className="rounded-2xl h-12"
                                    />
                                    <Input
                                        label="Contact Email"
                                        name="contactEmail"
                                        type="email"
                                        value={formData.contactEmail}
                                        onChange={handleInputChange}
                                        placeholder="branch@washy.com"
                                        className="rounded-2xl h-12"
                                    />
                                </div>
                            </Card>

                            <Card className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] border-neutral-100 shadow-sm space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-secondary-100 text-secondary-600 rounded-xl">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-neutral-900 tracking-tight">Location Details</h3>
                                </div>

                                <div className="space-y-4">
                                    <Input
                                        label="Street Address"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleInputChange}
                                        placeholder="123 Main Street"
                                        required
                                        className="rounded-2xl h-12"
                                    />
                                    <div className="grid md:grid-cols-3 gap-3">
                                        <Input
                                            label="Area"
                                            name="area"
                                            value={formData.area}
                                            onChange={handleInputChange}
                                            placeholder="Lekki Phase 1"
                                            className="rounded-2xl h-12"
                                        />
                                        <Input
                                            label="City"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="Lagos"
                                            required
                                            className="rounded-2xl h-12"
                                        />
                                        <Input
                                            label="State"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="Lagos State"
                                            required
                                            className="rounded-2xl h-12"
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Sidebar Config */}
                        <div className="space-y-6">
                            <Card className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] border-neutral-100 shadow-sm space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-info-100 text-info-600 rounded-xl">
                                        <UserPlus className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-neutral-900 tracking-tight">Management</h3>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-black text-neutral-400 uppercase tracking-widest">
                                        Assign Manager
                                    </label>
                                    <select
                                        name="managerId"
                                        value={formData.managerId}
                                        onChange={handleInputChange}
                                        className="w-full h-12 px-4 rounded-2xl border border-neutral-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-bold text-neutral-900 appearance-none bg-neutral-50"
                                    >
                                        <option value="">Select Manager</option>
                                        {managers.map((m: any) => (
                                            <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                                        ))}
                                    </select>
                                    <p className="text-[10px] font-medium text-neutral-400 leading-relaxed italic">
                                        Assigning a manager gives them command over this branch's staff and orders.
                                    </p>
                                </div>
                            </Card>

                            <Card className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] border-neutral-100 shadow-sm bg-neutral-900 text-white space-y-6">
                                <h3 className="text-xl font-black tracking-tight">Operational Status</h3>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-sm font-bold text-neutral-400">Online & Active</span>
                                    <Switch
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: (e.target as HTMLInputElement).checked }))}
                                    />
                                </div>
                                <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                                    Deactivating this branch will prevent customers from placing new orders for this location immediately.
                                </p>
                            </Card>

                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    className="w-full h-14 rounded-2xl font-black shadow-xl shadow-primary-500/20"
                                >
                                    <Save className="w-5 h-5 mr-2" />
                                    {isEditMode ? 'Update Operational Center' : 'Establish Branch'}
                                </Button>
                                {isEditMode && (
                                    <Button
                                        variant="outline"
                                        className="w-full h-14 rounded-2xl font-black text-error-600 border-error-100 hover:bg-error-50"
                                        onClick={async () => {
                                            if (window.confirm('Are you sure? This action is irreversible.')) {
                                                await branchesService.delete(id!);
                                                toast.success('Branch decommissioned');
                                                navigate('/admin/branches');
                                            }
                                        }}
                                    >
                                        <Trash2 className="w-5 h-5 mr-2" />
                                        Decommission Branch
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </PageWrapper>
    );
};

export default AdminEditBranchPage;
