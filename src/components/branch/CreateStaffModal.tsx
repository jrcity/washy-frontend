import { useState } from 'react';
import { UserPlus, Mail, Phone, Lock, Shield, Zap } from 'lucide-react';
import { Button, Input, Modal, Select } from '@/components/ui';
import { usersService } from '@/services/users.service';
import { useAuthContext } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CreateStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const CreateStaffModal = ({ isOpen, onClose, onSuccess }: CreateStaffModalProps) => {
    const { user: currentUser } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'staff',
    });

    const roles = [
        { value: 'staff', label: 'Operative (Staff)' },
        { value: 'rider', label: 'Field Unit (Rider)' },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // The backend handles branch assignment for Managers
            await usersService.createInternal(formData);
            toast.success(`${formData.role === 'staff' ? 'Operative' : 'Field Unit'} enlisted successfully!`);
            onSuccess?.();
            onClose();
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                role: 'staff',
            });
        } catch (error: any) {
            toast.error(error.message || 'Failed to enlist personnel');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Enlist Personnel"
            icon={<UserPlus className="w-5 h-5 text-primary" />}
            size="md"
            footer={
                <div className="flex gap-4 w-full">
                    <Button variant="outline" className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px]" onClick={onClose} disabled={isLoading}>
                        Abort
                    </Button>
                    <Button
                        className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                        onClick={handleSubmit}
                        isLoading={isLoading}
                    >
                        Infect Authorization
                    </Button>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 mb-2">
                    <div className="flex items-center gap-3 text-primary mb-1">
                        <Shield className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Security Protocol</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                        Establishing a new authorized identity for {currentUser?.managedBranch ? 'this sector' : 'operational hubs'}.
                    </p>
                </div>

                <div className="space-y-4">
                    <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Operative Name"
                        required
                        className="bg-card border-border rounded-2xl"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="agent@washy.net"
                            required
                            className="bg-card border-border rounded-2xl"
                        />
                        <Input
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+234..."
                            required
                            className="bg-card border-border rounded-2xl"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Assigned Role"
                            name="role"
                            value={formData.role}
                            onChange={(e) => handleInputChange(e as any)}
                            options={roles}
                            className="bg-card border-border rounded-2xl"
                        />
                        <Input
                            label="Initial Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            required
                            className="bg-card border-border rounded-2xl"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl border border-border">
                    <Zap className="w-4 h-4 text-warning" />
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                        Credentials will be active immediately upon confirmation.
                    </p>
                </div>
            </form>
        </Modal>
    );
};
