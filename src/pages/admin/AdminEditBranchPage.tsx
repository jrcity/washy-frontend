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
            showBack={true}
        >
            <div className="max-w-4xl mx-auto space-y-6">


                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="p-8 md:p-10 rounded-[40px] border-border bg-card shadow-xl space-y-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -mr-16 -mt-16" />
                                <div className="flex items-center gap-4 mb-2 relative z-10">
                                    <div className="p-3 bg-primary/10 text-primary rounded-2xl shadow-inner">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase italic">Core Intel</h3>
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

                            <Card className="p-8 md:p-10 rounded-[40px] border-border bg-card shadow-xl space-y-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-[60px] -mr-16 -mt-16" />
                                <div className="flex items-center gap-4 mb-2 relative z-10">
                                    <div className="p-3 bg-secondary/10 text-secondary rounded-2xl shadow-inner">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase italic">Location Details</h3>
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
                            <Card className="p-8 rounded-[40px] border-border bg-card shadow-xl space-y-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-info/5 rounded-full blur-[50px] -mr-12 -mt-12" />
                                <div className="flex items-center gap-4 mb-2 relative z-10">
                                    <div className="p-3 bg-info/10 text-info rounded-2xl shadow-inner">
                                        <UserPlus className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-black text-foreground tracking-tighter uppercase italic">Management</h3>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-black text-neutral-400 uppercase tracking-widest">
                                        Assign Manager
                                    </label>
                                    <select
                                        name="managerId"
                                        value={formData.managerId}
                                        onChange={handleInputChange}
                                        className="w-full h-12 px-4 rounded-2xl border border-border focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-black text-xs uppercase tracking-widest text-foreground appearance-none bg-muted shadow-inner"
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

                            <Card className="p-8 rounded-[40px] border-border bg-foreground shadow-2xl text-background space-y-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] -mr-16 -mt-16" />
                                <h3 className="text-xl font-black tracking-tighter uppercase italic relative z-10">Operational Status</h3>
                                <div className="flex items-center justify-between p-5 bg-background/5 rounded-[24px] border border-background/10 relative z-10 shadow-inner">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-background/60">Online & Active</span>
                                    <Switch
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: (e.target as HTMLInputElement).checked }))}
                                    />
                                </div>
                                <p className="text-[10px] text-background/40 font-black uppercase tracking-widest leading-relaxed italic relative z-10">
                                    Deactivating this branch will prevent customers from placing new orders for this location immediately.
                                </p>
                            </Card>

                            <div className="flex flex-col gap-4">
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    className="w-full h-16 rounded-[24px] font-black shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all text-sm uppercase tracking-[0.2em] italic"
                                >
                                    <Save className="w-6 h-6 mr-3" />
                                    {isEditMode ? 'Update Operational Center' : 'Establish Branch'}
                                </Button>
                                {isEditMode && (
                                    <Button
                                        variant="ghost"
                                        className="w-full h-16 rounded-[24px] font-black text-destructive hover:bg-destructive/5 transition-all text-[10px] uppercase tracking-widest"
                                        onClick={async () => {
                                            if (window.confirm('Are you sure? This action is irreversible.')) {
                                                await branchesService.delete(id!);
                                                toast.success('Branch decommissioned');
                                                navigate('/admin/branches');
                                            }
                                        }}
                                    >
                                        <Trash2 className="w-5 h-5 mr-3" />
                                        Decommission Hub
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
