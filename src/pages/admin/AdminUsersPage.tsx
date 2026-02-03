import { useState } from 'react';
import { Search, Filter, User as UserIcon, Mail, Phone, Eye } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Card, Input, Button, Badge, LoadingScreen, EmptyState, Select } from '@/components/ui';
import { UserModal } from '@/components/admin';
import { useUsers, useComponentLogger } from '@/hooks';
import { formatDate } from '@/lib/utils';
import type { User } from '@/types';

export const AdminUsersPage = () => {
    useComponentLogger('AdminUsersPage');
    const [roleFilter, setRoleFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { data, isLoading, refetch } = useUsers({
        role: roleFilter === 'all' ? undefined : roleFilter,
        limit: 50
    });

    const users = data?.users || [];

    const filteredUsers = users.filter(user => {
        if (!search) return true;
        const term = search.toLowerCase();
        return (
            user.name.toLowerCase().includes(term) ||
            (user.email?.toLowerCase() || '').includes(term) ||
            user.phone.toLowerCase().includes(term)
        );
    });

    const handleViewUser = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        refetch();
    };

    if (isLoading) return <LoadingScreen />;

    return (
        <PageWrapper title="Users" description="Manage system users and roles">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <Input
                        placeholder="Search name, email, phone..."
                        leftIcon={<Search className="w-4 h-4" />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="md:max-w-sm"
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <Select
                        label=""
                        options={[
                            { value: 'all', label: 'All Roles' },
                            { value: 'customer', label: 'Customer' },
                            { value: 'staff', label: 'Staff' },
                            { value: 'rider', label: 'Rider' },
                            { value: 'branch_manager', label: 'Branch Manager' },
                            { value: 'admin', label: 'Admin' },
                        ]}
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-48 capitalize"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                    <Card variant="bordered" className="py-12">
                        <EmptyState
                            title="No users found"
                            description="Try changing the role filter or search term"
                        />
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {filteredUsers.map((user) => (
                            <Card
                                key={user._id}
                                variant="bordered"
                                className="flex items-center justify-between p-4 cursor-pointer hover:border-primary-200 transition-colors"
                                onClick={() => handleViewUser(user)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-neutral-900">{user.name}</h3>
                                            <Badge variant="secondary" className="capitalize text-xs">
                                                {user.role.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-neutral-500 mt-1">
                                            <div className="flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                <span>{user.email || 'No email'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-3 h-3" />
                                                <span>{user.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-neutral-400">
                                        Joined {formatDate(user.createdAt)}
                                    </span>
                                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleViewUser(user); }}>
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                user={selectedUser}
                onSuccess={() => refetch()}
            />
        </PageWrapper>
    );
};
