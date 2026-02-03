import { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, MapPin } from 'lucide-react';
import { Button, Input, Modal, Badge, Select } from '@/components/ui';
import { useBranches } from '@/hooks';
import { usersService } from '@/services/users.service';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { User as UserType } from '@/types';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user?: UserType | null;
    onSuccess?: () => void;
}

const roles = ['customer', 'rider', 'staff', 'branch_manager', 'admin'];

export const UserModal = ({ isOpen, onClose, user, onSuccess }: UserModalProps) => {
    const { data: branches } = useBranches();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'customer',
        branchId: '',
    });

    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                name: user.name,
                email: user.email || '',
                phone: user.phone,
                role: user.role,
                branchId: user.branchId || '',
            });
            setIsEditing(false);
        }
    }, [isOpen, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!user) return;
        setIsLoading(true);

        try {
            await usersService.update(user._id, {
                name: formData.name,
                role: formData.role as any,
                branchId: formData.branchId || undefined,
            });
            toast.success('User updated successfully!');
            onSuccess?.();
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update user');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="User Details"
            icon={<User className="w-5 h-5 text-neutral-500" />}
            size="md"
            footer={
                isEditing ? (
                    <>
                        <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button className="flex-1" onClick={handleSave} isLoading={isLoading}>
                            Save Changes
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="outline" className="flex-1" onClick={onClose}>
                            Close
                        </Button>
                        <Button className="flex-1" onClick={() => setIsEditing(true)}>
                            Edit User
                        </Button>
                    </>
                )
            }
        >
            <div className="space-y-6">
                {/* User Avatar & Name */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        {isEditing ? (
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="font-semibold"
                            />
                        ) : (
                            <h3 className="text-xl font-semibold text-neutral-900">{user.name}</h3>
                        )}
                        <Badge variant="secondary" className="capitalize mt-1">
                            {user.role.replace('_', ' ')}
                        </Badge>
                    </div>
                </div>

                {/* User Info */}
                <div className="space-y-3 bg-neutral-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-600">{user.email || 'No email'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-600">{user.phone}</span>
                    </div>
                    {user.address && (
                        <div className="flex items-center gap-3 text-sm">
                            <MapPin className="w-4 h-4 text-neutral-400" />
                            <span className="text-neutral-600">
                                {user.address.street}, {user.address.city}
                            </span>
                        </div>
                    )}
                </div>

                {/* Role Management (Edit Mode) */}
                {isEditing && (
                    <div className="space-y-4 border-t border-neutral-100 pt-4">
                        <div>
                            <Select
                                name="role"
                                label="User Role"
                                value={formData.role}
                                onChange={(e) => handleInputChange(e as any)}
                                options={roles.map(role => ({
                                    value: role,
                                    label: role.replace('_', ' ')
                                }))}
                            />
                        </div>

                        {['staff', 'branch_manager', 'rider'].includes(formData.role) && (
                            <div>
                                <Select
                                    name="branchId"
                                    label="Assigned Branch"
                                    value={formData.branchId}
                                    onChange={(e) => handleInputChange(e as any)}
                                    options={[
                                        { value: "", label: "No branch assigned" },
                                        ...(branches || []).map(branch => ({
                                            value: branch._id,
                                            label: branch.name
                                        }))
                                    ]}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Meta Info */}
                <div className="text-xs text-neutral-400 border-t border-neutral-100 pt-4">
                    <p>Joined: {formatDate(user.createdAt, 'PPP')}</p>
                </div>
            </div>
        </Modal>
    );
};

export default UserModal;
